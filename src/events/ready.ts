import { bot } from "../app";
import { commands } from "../helpers/loadCommands";

export default async function readyEvent() {
    console.log(` > ${bot.botInfo.username} ready!`);

    await bot.telegram
        .setMyCommands(commands.filter((x) => x.description))
        .catch((err) => console.log("[!]: Can't set bot commands!", err));
}
