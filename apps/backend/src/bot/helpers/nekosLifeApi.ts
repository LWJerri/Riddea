import { extname } from "path";
import axios, { AxiosRequestConfig, AxiosResponse, Method } from "axios";
import { fileTypes, ignoreEndpoints } from "../constants";

export type NekosLifeResponse = {
  url: string;
};

export type NekosLifeOpts = {
  endPoint: string;
  method?: Method;
  amount?: number;
};

export const nekosLifeApi = async (opts = { method: "GET", amount: 1 } as NekosLifeOpts) => {
  const axiosOptions: AxiosRequestConfig = {
    url: `https://nekos.life/api/v2/img/${opts.endPoint}`,
    method: opts.method,
  };

  const responses = await Promise.all<{ data: NekosLifeResponse }>(
    [...Array(opts.amount)].reduce((curr) => [...curr, axios.request(axiosOptions)], []),
  );

  const result = await axios.all<AxiosResponse<NekosLifeResponse>>(responses.map((r) => axios.get(r.data.url)));

  return result
    .filter((image) => {
      let correctFileType = false;

      ignoreEndpoints.includes(opts.endPoint)
        ? (correctFileType = true)
        : (correctFileType = fileTypes.includes(extname(image.config.url).replaceAll(".", "")));

      const fileSize = Number(image.headers["content-length"]) / Math.pow(1024, 2);

      return correctFileType && fileSize <= 5;
    })
    .map((image) => image.config.url);
};
