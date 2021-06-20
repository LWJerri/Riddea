import { Context } from "telegraf";
import humanize from "humanize-duration";
import { resolve } from "path";
import { CommandInterface } from "./_interface";
import { commands as commandsStore } from "../helpers/loadCommands";
import { prisma } from "../libs/prisma";

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

    const commands = commandsStore.filter((c) => c.collectUsage).map((c) => c.name);
    const stats = await Promise.all(
      commands.map((command) =>
        prisma.statistic.count({
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
      .join("\n")}\n\nUPLOADS STATS:\nUploaded ${await prisma.upload.count()} images!\n\nBOT INFO:\nBot username: ${
      ctx.botInfo.username
    }\nBot ID: ${ctx.botInfo.id}\nVersion: ${pkg.version}\nUptime: ${uptime}`;

    await ctx.reply(message);
  }
}
