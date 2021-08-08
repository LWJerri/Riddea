import { Scenes, session, Telegraf } from "telegraf";
import readyEvent from "./events/ready";
import { loadCommands } from "./helpers/loadCommands";
import { stage } from "./constants/stages";
import photoEvent from "./events/photo";

import { botLogger } from "./helpers/logger";
import userMiddleware from "./middlewares/user";
import i18nMiddleware from "./middlewares/i18n";
import { setupS3 } from "./libs/s3";

export const bot = new Telegraf<Scenes.SceneContext>(process.env.TELEGRAM_BOT_TOKEN);

bot.use(userMiddleware);
bot.use(i18nMiddleware);
bot.use(session());
bot.use(stage.middleware());
bot.on("photo", photoEvent);

export async function bootstrap() {
  try {
    await setupS3();
    await loadCommands();
    await bot.launch();
    await readyEvent();
  } catch (err) {
    botLogger.error(`App boot error:`, err.stack);
  }
}

async function shutDownServices() {
  bot.stop();
  process.exit(0);
}

bot.catch((err: Error) => {
  botLogger.error(`Main app error:`, err.stack);
});

process.on("SIGINT", () => shutDownServices());
process.on("SIGTERM", () => shutDownServices());
process.on("unhandledRejection", (reason) => botLogger.error(reason));
process.on("uncaughtException", (reason) => botLogger.error(reason));
