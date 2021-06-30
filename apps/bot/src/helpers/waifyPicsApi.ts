import axios, { AxiosRequestConfig, AxiosResponse, Method } from "axios";
import { fileTypes, ignoreEndpoints } from "../constants";
import { extname } from "path";

export type WaifyPicsResponse = {
  url: string;
};

export type WaifyPicsOpts = {
  endPoint: string;
  method?: Method;
  amount?: number;
};

export const waifyPicsApi = async (opts = { method: "GET", amount: 1 } as WaifyPicsOpts) => {
  const axiosOptions: AxiosRequestConfig = {
    url: `https://api.waifu.pics/${opts.endPoint}`,
    method: opts.method,
  };

  const responses = await Promise.all<{ data: WaifyPicsResponse }>(
    [...Array(opts.amount)].reduce((curr, val) => [...curr, axios.request(axiosOptions)], []),
  );

  const result = await axios.all<AxiosResponse<WaifyPicsResponse>>(responses.map((r) => axios.get(r.data.url)));

  return result
    .filter((image) => {
      const correctFileType = ignoreEndpoints.includes(opts.endPoint)
        ? true
        : fileTypes.includes(extname(image.config.url).replaceAll(".", ""));
      const fileSize = Number(image.headers["content-length"]) / Math.pow(1024, 2);

      if (correctFileType && fileSize < 10) {
        return true;
      } else return false;
    })
    .map((image) => image.config.url);
};
