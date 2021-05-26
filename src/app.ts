require("dotenv").config();
import "source-map-support";
import "reflect-metadata";
import { Scenes, session, Telegraf } from "telegraf";
import callbackEvent from "./events/callback";
import readyEvent from "./events/ready";
import { createConnection } from "typeorm";
import { loadCommands } from "./helpers/loadCommands";
import { stage } from "./constants/stages";

export const bot = new Telegraf<Scenes.SceneContext>(process.env.TOKEN);

bot.use(session());
bot.use(stage.middleware());
bot.on("callback_query", callbackEvent);

async function bootstrap() {
    await createConnection();
    await loadCommands();
    await bot.launch();
    await readyEvent();
}

bootstrap();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
process.on("unhandledRejection", (reason) => console.log(reason));
process.on("uncaughtException", (reason) => console.log(reason));
