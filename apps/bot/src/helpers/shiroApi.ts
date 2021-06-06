import axios, { AxiosRequestConfig, Method } from "axios";
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

  return responses.map((r) => r.data).filter((image) => fileTypes.includes(image.fileType));
};
