require("dotenv").config();
import "source-map-support";
import "reflect-metadata";
import { Telegraf } from "telegraf";
import callbackEvent from "./events/callback";
import readyEvent from "./events/ready";
import { createConnection } from "typeorm";
import { loadCommands } from "./helpers/loadCommands";

export const bot = new Telegraf(process.env.TOKEN);

bot.on("callback_query", callbackEvent);

async function bootstrap() {
    await loadCommands();
    await createConnection();
    await bot.launch();
    await readyEvent();
}

bootstrap();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
process.on("unhandledRejection", (reason) => console.log(reason));
process.on("uncaughtException", (reason) => console.log(reason));
