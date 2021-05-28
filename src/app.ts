require("dotenv").config();
import "source-map-support";
import "reflect-metadata";
import { Scenes, session, Telegraf } from "telegraf";
import readyEvent from "./events/ready";
import { createConnection } from "typeorm";
import { loadCommands } from "./helpers/loadCommands";
import { stage } from "./constants/stages";
import photoEvent from "./events/photo";

export const bot = new Telegraf<Scenes.SceneContext>(process.env.TOKEN);

bot.use(session());
bot.use(stage.middleware());
bot.on("photo", photoEvent);

async function bootstrap() {
    try {
        await createConnection();
        await loadCommands();
        await bot.launch();
        await readyEvent();
    } catch (err: any) {
        console.log(`[ERROR]: `, err);
    }
}

bootstrap();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
process.on("unhandledRejection", (reason) => console.log(reason));
process.on("uncaughtException", (reason) => console.log(reason));
