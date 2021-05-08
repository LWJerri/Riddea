require("dotenv").config();
import "source-map-support";
import "reflect-metadata";
import { Telegraf } from "telegraf";
import { callbackEvent } from "./events/callback";
import { avatarCMD } from "./commands/avatar";
import { bondageCMD } from "./commands/bondage";
import { hentaiCMD } from "./commands/hentai";
import { nekoCMD } from "./commands/neko";
import { startCMD } from "./commands/start";
import { thighsCMD } from "./commands/thighs";
import { trapCMD } from "./commands/trap";
import { uploadCMD } from "./commands/upload";
import { wallpaperCMD } from "./commands/wallpaper";
import { readyEvent } from "./events/ready";
import { statusCMD } from "./commands/status";
import { helpCMD } from "./commands/help";
import { createConnection } from "typeorm";

export const fileType = ["png", "jpg", "jpeg"];
export const bot = new Telegraf(process.env.TOKEN);
export var startData = Date.now();
export const connection = async () =>
    await createConnection({
        type: "postgres",
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        synchronize: true,
        logging: false,
        entities: ["dist/entities/**/*.js"],
        migrations: ["dist/migrations/**/*.js"],
        cli: {
            entitiesDir: "dist/entities",
            migrationsDir: "dist/migrations",
        },
        ssl: {
            rejectUnauthorized: false,
        },
    });

bot.on("callback_query", async (callback) => callbackEvent(callback));
bot.command("avatar", async (message) => avatarCMD(message));
bot.command("bondage", async (message) => bondageCMD(message));
bot.command("help", async (message) => helpCMD(message));
bot.command("hentai", async (message) => hentaiCMD(message));
bot.command("neko", async (message) => nekoCMD(message));
bot.command("start", async (message) => startCMD(message));
bot.command("status", async (message) => statusCMD(message));
bot.command("thighs", async (message) => thighsCMD(message));
bot.command("trap", async (message) => trapCMD(message));
bot.command("upload", async (message) => uploadCMD(message));
bot.command("wallpaper", async (message) => wallpaperCMD(message));
bot.launch().then(() => readyEvent());

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
process.on("unhandledRejection", (reason) => console.log(reason));
process.on("uncaughtException", (reason) => console.log(reason));
