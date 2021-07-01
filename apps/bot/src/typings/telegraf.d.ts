import telegraf from "telegraf";
import { CallbackQuery } from "typegram";
import { Context } from "vm";

declare module "telegraf" {
  interface Context {
    isAction: boolean;
  }
}

export interface ContextCallbackWithData extends Context {
  callbackQuery?: CallbackQuery & { data?: string };
}
