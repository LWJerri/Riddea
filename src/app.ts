require("dotenv").config();
import "source-map-support";
import "reflect-metadata";
import { Telegraf } from "telegraf";
import callbackEvent from "./events/callback";
import readyEvent from "./events/ready";
import { createConnection } from "typeorm";
import { promises as fs } from 'fs';
import { resolve } from "path";

export const bot = new Telegraf(process.env.TOKEN);

bot.on("callback_query", callbackEvent);

async function bootstrap() {
    const commandsDirPath = resolve(__dirname, 'commands')
    const cmds = (await fs.readdir(commandsDirPath, { withFileTypes: true })).map(f => f.name)
    for (const command of cmds) {
        const file = (await import(resolve(commandsDirPath, command))).default
        const commandName = command.split('.')[0]
        bot.command(commandName, file)
        console.info(`Command ${commandName} loaded`)
    }

    await createConnection();
    await bot.launch();
    await readyEvent();
}

bootstrap();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
process.on("unhandledRejection", (reason) => console.log(reason));
process.on("uncaughtException", (reason) => console.log(reason));
