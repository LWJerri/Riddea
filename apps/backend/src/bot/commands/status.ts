import humanize from "humanize-duration";
import { Context } from "telegraf";
import { getRepository } from "typeorm";

import { Statistic, User, Upload } from "../../entities";
import { commands as commandsStore } from "../helpers/loadCommands";
import { CommandInterface } from "./_interface";

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
      .map((command) => ctx.i18n.translate("commandInfo", { command: command[0], uses: command[1] }))
      .join("\n");
    const uploadStats = await getRepository(Upload).count();

    const message = `\n\n${ctx.i18n.translate("commandStats")}:\n${cmdStats}\n\n${ctx.i18n.translate("uploadStats")}:\n${ctx.i18n.translate(
      "uploadInfo",
      { count: uploadStats },
    )}\n\n${ctx.i18n.translate("botInfo")}:\n${ctx.i18n.translate("botUsername", { username: ctx.botInfo.username })}\n${ctx.i18n.translate(
      "botID",
      {
        id: ctx.botInfo.id,
      },
    )}\n${ctx.i18n.translate("botVersion", { version: pkg.version })}\n${ctx.i18n.translate("botUptime", { uptime: uptime })}`;

    await ctx.reply(message);
  }
}
