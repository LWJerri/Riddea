require("dotenv").config();
import "source-map-support";
import "reflect-metadata";
import { Telegraf } from "telegraf";
import callbackEvent from "./events/callback";
import readyEvent from "./events/ready";
import * as commands from './commands'
import { createConnection } from "typeorm";

export const bot = new Telegraf(process.env.TOKEN);

bot.on("callback_query", callbackEvent);
bot.command("avatar", commands.avatarCmd);
bot.command("bondage", commands.bondageCMD);
bot.command("help", commands.helpCMD);
bot.command("hentai", commands.hentaiCMD);
bot.command("neko", commands.nekoCMD);
bot.command("start", commands.startCMD);
bot.command("status", commands.statusCMD);
bot.command("thighs", commands.thighsCMD);
bot.command("trap", commands.trapCMD);
bot.command("upload", commands.uploadCMD);
bot.command("wallpaper", commands.wallpaperCMD);

async function bootstrap() {
    await createConnection();
    await bot.launch();
    await readyEvent();
}

bootstrap();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
process.on("unhandledRejection", (reason) => console.log(reason));
process.on("uncaughtException", (reason) => console.log(reason));
