import { Context } from "telegraf";
import { getRepository } from "typeorm";
import { Statistic } from "../entities/Statistic";
import { Upload } from "../entities/Upload";
import humanize from "humanize-duration";
import { resolve } from "path";
import { CommandInterface } from "./_interface";
import { commands as commandsStore } from "../helpers/loadCommands";

const pkg = require(resolve(process.cwd(), "package.json"));

export default class extends CommandInterface {
    constructor() {
        super({
            name: "status",
            description: "Send bot statistic",
            action: "SEND_STATISTIC",
        });
    }

    async run(ctx: Context) {
        const uptime = humanize(Math.floor(process.uptime()) * 1000, {
            round: true,
            language: "en",
        });

        const statisticRepository = getRepository(Statistic);

        const commands = commandsStore.filter((c) => c.collectUsage).map((c) => c.name);
        const stats = await Promise.all(
            commands.map((command) =>
                statisticRepository.count({
                    where: {
                        command,
                    },
                })
            )
        );

        const commandsStats: Array<[string, number]> = commands.reduce((prev, current, index) => {
            return [...prev, [[current], stats[index]]];
        }, []);

        const msg = `COMMANDS STATS:\n ${commandsStats.map((command) => `> /${command[0]} used ${command[1]} times.`).join("\n")}`;

        await ctx.reply(msg).catch(() => {});

        await ctx.reply(`UPLOADS STATS:\nUploaded ${await getRepository(Upload).count()} images!`).catch(() => {});

        await ctx
            .reply(
                `BOT INFO:\nBot username: ${ctx.botInfo.username}\nBot ID: ${ctx.botInfo.id}\nVersion: ${pkg.version}\nUptime: ${uptime}`
            )
            .catch(() => {});

        return;
    }
}
