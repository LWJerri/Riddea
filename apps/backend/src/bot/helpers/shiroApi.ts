import { extname } from "path";

import axios, { AxiosRequestConfig, AxiosResponse, Method } from "axios";

import { fileTypes } from "../constants";

export type ShiroResponse = {
  code: string;
  url: string;
  mimeType: string;
  fileType: string;
};

export type ShiroOpts = {
  endPoint: string;
  method?: Method;
  amount?: number;
};

export const shiroApi = async (opts = { method: "GET", amount: 1 } as ShiroOpts) => {
  const axiosOptions: AxiosRequestConfig = {
    url: `https://shiro.gg/api/images/${opts.endPoint}`,
    method: opts.method,
  };

  const responses = await Promise.all<{ data: ShiroResponse }>(
    [...Array(opts.amount)].reduce((curr, val) => [...curr, axios.request(axiosOptions)], []),
  );

  const result = await axios.all<AxiosResponse<ShiroResponse>>(responses.map((r) => axios.get(r.data.url)));

  return result
    .filter((image) => {
      const correctFileType = fileTypes.includes(extname(image.config.url).replaceAll(".", ""));
      const fileSize = Number(image.headers["content-length"]) / Math.pow(1024, 2);

      return correctFileType && fileSize <= 5;
    })
    .map((image) => image.config.url);
};
