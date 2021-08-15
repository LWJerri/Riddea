import humanize from "humanize-duration";
import { Context } from "telegraf";
import { getRepository } from "typeorm";

import { Statistic, User, Upload } from "../../entities";
import { commands as commandsStore } from "../helpers/loadCommands";
import { CommandInterface } from "./_interface";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require("../../../../package.json");

export default class extends CommandInterface {
  constructor() {
    super({
      name: "status",
      description: "Send bot statistic",
      collectUsage: false,
      cooldown: false,
      actions: [{ callback: "SEND_STATISTIC" }],
    });
  }

  async run(ctx: Context) {
    const userLang = (await getRepository(User).findOne({ userID: ctx.from.id })).lang;

    const uptime = humanize(Math.floor(process.uptime()) * 1000, {
      round: true,
      language: userLang,
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

    const cmdStats = commandsStats
      .map((command) => ctx.i18n.translate("bot.stats.commands.text", { command: command[0], uses: command[1] }))
      .join("\n");
    const uploadStats = await getRepository(Upload).count();

    const message = `\n\n${ctx.i18n.translate("bot.stats.commands.title").toUpperCase()}:\n${cmdStats}\n\n${ctx.i18n
      .translate("bot.stats.uploads.title")
      .toUpperCase()}:\n${ctx.i18n.translate("bot.stats.uploads.text", { count: uploadStats })}\n\n${ctx.i18n
      .translate("bot.stats.bot.title")
      .toUpperCase()}:\n${ctx.i18n.translate("bot.stats.bot.username", { username: ctx.botInfo.username })}\n${ctx.i18n.translate(
      "bot.stats.bot.id",
      {
        id: ctx.botInfo.id,
      },
    )}\n${ctx.i18n.translate("bot.stats.bot.version", { version: pkg.version })}\n${ctx.i18n.translate("bot.stats.bot.uptime", {
      uptime: uptime,
    })}`;

    await ctx.reply(message);
  }
}
