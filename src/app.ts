require("dotenv").config();
import "source-map-support";
import "reflect-metadata";
import { Scenes, session, Telegraf } from "telegraf";
import readyEvent from "./events/ready";
import { createConnection, getRepository } from "typeorm";
import { loadCommands } from "./helpers/loadCommands";
import { stage } from "./constants/stages";
import { Collection } from "./entities/Collection";
import { Upload } from "./entities/Upload";

export const bot = new Telegraf<Scenes.SceneContext>(process.env.TOKEN);

bot.use(session());
bot.use(stage.middleware());

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
