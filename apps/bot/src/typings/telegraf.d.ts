import telegraf from "telegraf";

declare module "telegraf" {
  interface Context {
    isAction: boolean;
  }
}
