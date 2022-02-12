import axios, { AxiosRequestConfig, Method } from "axios";
import { fileTypes, ignoreEndpoints } from "../constants";

export type YiffyPicsResponse = {
  images: Array<{ url: string; type: string; ext: string; size: number; shortURL: string }>;
};

export type YiffyPicsOpts = {
  endPoint: string;
  method?: Method;
  amount?: number;
};

export const yiffyPicsApi = async (opts = { method: "GET", amount: 1 } as YiffyPicsOpts) => {
  const headerOptions = { "User-Agent": "Mozilla/5.0 (compatible; Riddeabot/2.1; +http://riddea.ml)" };

  const axiosOptions: AxiosRequestConfig = {
    url: `https://v2.yiff.rest/${opts.endPoint}?notes=disabled&sizeLimit=5000000&amount=5`,
    method: opts.method,
    headers: { ...headerOptions, "Content-Type": "application/json" },
  };

  const responses = await Promise.all<{ data: YiffyPicsResponse }>(
    [...Array(opts.amount)].reduce((curr) => [...curr, axios.request(axiosOptions)], []),
  );

  const result = responses.map((x) => x.data.images).flat();

  const outImage = result
    .filter((image) => {
      let correctFileType = false;

      ignoreEndpoints.includes(opts.endPoint) ? (correctFileType = true) : (correctFileType = fileTypes.includes(image.ext));

      return correctFileType;
    })
    .map((imageData) => {
      return axios.get(imageData.url, { responseType: "arraybuffer", headers: headerOptions });
    });

  const imageData = await Promise.all(outImage);

  return imageData.map((output) => Buffer.from(output.data, "base64"));
};
