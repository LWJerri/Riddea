import { RateLimiter } from "@riddea/telegraf-rate-limiter";

export const fileTypes = ["png", "jpg", "jpeg"];
export const ignoreEndpoints = ["nsfw/blowjob"];
export const sponsors = [
  {
    name: "Не смотри, бака! (anime arts)",
    url: "https://vk.com/moushiwake",
  },
  {
    name: "aestheticsJPG",
    url: "https://t.me/aestheticsJPG",
  },
];
export const cmdLimiter = new RateLimiter(1, 5000);
export interface Callback {
  data: string;
}
