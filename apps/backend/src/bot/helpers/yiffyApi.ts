import axios, { AxiosRequestConfig, Method } from "axios";
import { fileTypes, ignoreEndpoints } from "../constants";

export type YiffyPicsResponse = {
  images: Array<{ url: string | unknown; type: string; ext: string; size: number; shortURL: string }>;
};

export type YiffyPicsOpts = {
  endPoint: string;
  method?: Method;
  amount?: number;
};

export const yiffyPicsApi = async (opts = { method: "GET", amount: 1 } as YiffyPicsOpts) => {
  const axiosOptions: AxiosRequestConfig = {
    url: `https://v2.yiff.rest/${opts.endPoint}?notes=disabled&sizeLimit=5000000&amount=5`,
    method: opts.method,
    headers: { "User-Agent": "RiddeaBot", "Content-Type": "application/json" },
  };

  const responses = await Promise.all<{ data: YiffyPicsResponse }>(
    [...Array(opts.amount)].reduce((curr) => [...curr, axios.request(axiosOptions)], []),
  );

  console.log(responses[0]);

  const result = responses.map((x) => x.data.images).flat();

  return result
    .filter((image) => {
      let correctFileType = false;

      ignoreEndpoints.includes(opts.endPoint) ? (correctFileType = true) : (correctFileType = fileTypes.includes(image.ext));

      return correctFileType;
    })
    .map((image) => image.url);
};
