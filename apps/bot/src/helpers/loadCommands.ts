import { bot } from "../app";
import { promises as fs } from "fs";
import { resolve } from "path";
import { CommandInterface } from "../commands/_interface";
import { botLogger } from "./logger";

export const commands: Array<CommandInterface> = [];

export async function loadCommands() {
    const commandsDirPath = resolve(__dirname, "..", "commands");
    const cmds = (await fs.readdir(commandsDirPath, { withFileTypes: true }))
        .map((f) => f.name)
        .filter((name) => !name.includes("index") && !name.includes(".d.ts") && !name.includes("_interface"));

    for (const commandPath of cmds) {
        const command: CommandInterface = new ((await import(resolve(commandsDirPath, commandPath)))?.default)();

        if (!command) {
            botLogger.log(`[!]: Command ${commandPath} havent exported class, will not work!`);

            return;
        }

        bot.command(command.name, (ctx) => command.execute(ctx));

        if (command.aliases) {
            for (const aliase of command.aliases) {
                bot.command(aliase, command.execute);
            }
        }

        if (command.action) {
            bot.action(command.action, async (ctx) => {
                await ctx.answerCbQuery().catch(() => {});
                (ctx as any).isAction = true;
                command.execute(ctx);
            });
            botLogger.log(`[ACTIONS]: Action ${command.action} loaded`);
        }

        commands.push(command);
        botLogger.log(`[COMMANDS]: Command ${command.name} loaded`);
    }
}
