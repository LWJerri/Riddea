import { bot } from "../app";
import { promises as fs } from "fs";
import { resolve } from "path";
import { BotCommand } from "typegram";

export const commands: Array<BotCommand> = [];

export async function loadCommands() {
    const commandsDirPath = resolve(__dirname, "..", "commands");
    const cmds = (await fs.readdir(commandsDirPath, { withFileTypes: true }))
        .map((f) => f.name)
        .filter((name) => !name.includes("index"));

    for (const command of cmds) {
        const file = await import(resolve(commandsDirPath, command));
        const commandName = command.split(".")[0];

        bot.command(commandName, file.default);

        commands.push({
            command: commandName,
            description: file.description
                ? file.description
                : "Command doesen't have description",
        });

        console.log(` > Command ${commandName} loaded`);
    }
}
