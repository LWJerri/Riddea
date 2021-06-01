import telegraf from "telegraf";

declare module "telegraf" {
    interface Context {
        public isAction: boolean;
    }
}
