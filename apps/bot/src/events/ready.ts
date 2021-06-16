import { botLogger } from "../helpers/logger";
import { BotCommand } from "typegram";
import { bot } from "../app";
import { commands as commandsStore } from "../helpers/loadCommands";

export default async function readyEvent() {
  botLogger.log(`READY AS @${bot.botInfo.username}!`);

  const commands: BotCommand[] = commandsStore.filter((c) => c.description).map((c) => ({ command: c.name, description: c.description }));

  try {
    await bot.telegram.setMyCommands(commands);
  } catch (err) {
    botLogger.error("Can't set bot commands list!", err.stack);
  }
}
