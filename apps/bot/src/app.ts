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
  try {
    const connectionOptions = await getConnectionOptions();
    await createConnection(Object.assign(connectionOptions, { entities: Object.values(typeormEntitites) }));
    await loadCommands();
    await bot.launch();
    await readyEvent();

    await microserviceInit();
  } catch (err) {
    botLogger.error(`App boot error:`, err.stack);
  }
}

bootstrap();

process.on("SIGINT", async () => {
  bot.stop("SIGINT");
  await bot.launch();
});

process.on("SIGTERM", async () => {
  bot.stop("SIGTERM");
  await bot.launch();
});

process.on("unhandledRejection", async (reason) => {
  botLogger.error(reason);
  bot.stop("BOT_TAPI_STUCK_REJECTION");
  await bot.launch();
});

process.on("uncaughtException", async (reason) => {
  botLogger.error(reason);
  bot.stop("BOT_TAPI_STUCK_EXCEPTION");
  await bot.launch();
});
