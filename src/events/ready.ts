import { BotCommand } from "typegram";
import { bot } from "../app";
import { commands as commandsStore } from "../helpers/loadCommands";

export default async function readyEvent() {
    console.log(`\n[TELEGRAF]: Bot @${bot.botInfo.username} ready!\n`);

    const commands: BotCommand[] = commandsStore.filter((c) => c.description).map((c) => ({ command: c.name, description: c.description }));

    await bot.telegram.setMyCommands(commands).catch(() => {});
}
