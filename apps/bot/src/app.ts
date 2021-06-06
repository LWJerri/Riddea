import findConfig from "find-config";
import dotenv from "dotenv";

dotenv.config({ path: findConfig(".env") });

import "source-map-support/register";
import "reflect-metadata";
import { Scenes, session, Telegraf } from "telegraf";
import readyEvent from "./events/ready";
import { createConnection, getConnectionOptions } from "typeorm";
import { loadCommands } from "./helpers/loadCommands";
import { stage } from "./constants/stages";
import { microserviceInit } from "./api";
import photoEvent from "./events/photo";

import * as typeormEntitites from "@riddea/typeorm";
import { botLogger } from "./helpers/logger";

export const bot = new Telegraf<Scenes.SceneContext>(process.env.TELEGRAM_BOT_TOKEN);

bot.use(session());
bot.use(stage.middleware());
bot.on("photo", photoEvent);

async function bootstrap() {
    const connectionOptions = await getConnectionOptions();
    await createConnection(Object.assign(connectionOptions, { entities: Object.values(typeormEntitites) }));
    await loadCommands();
    await bot.launch();
    await readyEvent();

    await microserviceInit();
}

bootstrap();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
process.on("unhandledRejection", (reason) => botLogger.error(reason));
process.on("uncaughtException", (reason) => botLogger.error(reason));
