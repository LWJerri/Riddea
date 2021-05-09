require("dotenv").config();
import "source-map-support";
import "reflect-metadata";
import { Telegraf } from "telegraf";
import callbackEvent from "./events/callback";
import {
    avatarCMD,
    bondageCMD,
    helpCMD,
    hentaiCMD,
    nekoCMD,
    startCMD,
    statusCMD,
    thighsCMD,
    trapCMD,
    uploadCMD,
    wallpaperCMD,
} from "./commands";
import readyEvent from "./events/ready";

export const fileType = ["png", "jpg", "jpeg"];
export const bot = new Telegraf(process.env.TOKEN);
export var startData = Date.now();

bot.on("callback_query", callbackEvent);
bot.command("avatar", avatarCMD);
bot.command("bondage", bondageCMD);
bot.command("help", helpCMD);
bot.command("hentai", hentaiCMD);
bot.command("neko", nekoCMD);
bot.command("start", startCMD);
bot.command("status", statusCMD);
bot.command("thighs", thighsCMD);
bot.command("trap", trapCMD);
bot.command("upload", uploadCMD);
bot.command("wallpaper", wallpaperCMD);
bot.launch().then(() => readyEvent());

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
process.on("unhandledRejection", (reason) => console.log(reason));
process.on("uncaughtException", (reason) => console.log(reason));
