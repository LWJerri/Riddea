import { extname } from "path";

import axios, { AxiosRequestConfig, AxiosResponse, Method } from "axios";

import { fileTypes, ignoreEndpoints } from "../constants";

export type WaifuPicsResponse = {
  url: string;
};

export type WaifuPicsOpts = {
  endPoint: string;
  method?: Method;
  amount?: number;
};

export const waifuPicsApi = async (opts = { method: "GET", amount: 1 } as WaifuPicsOpts) => {
  const axiosOptions: AxiosRequestConfig = {
    url: `https://api.waifu.pics/${opts.endPoint}`,
    method: opts.method,
  };

  const responses = await Promise.all<{ data: WaifuPicsResponse }>(
    [...Array(opts.amount)].reduce((curr, val) => [...curr, axios.request(axiosOptions)], []),
  );

  const result = await axios.all<AxiosResponse<WaifuPicsResponse>>(responses.map((r) => axios.get(r.data.url)));

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
