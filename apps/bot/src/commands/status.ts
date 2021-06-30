import { Context } from "telegraf";
import { getRepository } from "typeorm";
import { Statistic } from "@riddea/typeorm";
import { Upload } from "@riddea/typeorm";
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
      collectUsage: true,
      actions: ["SEND_STATISTIC"],
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
        }),
      ),
    );

    const commandsStats: Array<[string, number]> = commands.reduce((prev, current, index) => {
      return [...prev, [[current], stats[index]]];
    }, []);

    const message = `\n\nCOMMANDS STATS:\n ${commandsStats
      .map((command) => `> /${command[0]} used ${command[1]} times.`)
      .join("\n")}\n\nUPLOADS STATS:\nUploaded ${await getRepository(Upload).count()} images!\n\nBOT INFO:\nBot username: ${
      ctx.botInfo.username
    }\nBot ID: ${ctx.botInfo.id}\nVersion: ${pkg.version}\nUptime: ${uptime}`;

    await ctx.reply(message);
  }
}
