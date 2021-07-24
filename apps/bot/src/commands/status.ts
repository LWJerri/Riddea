import { Context } from "telegraf";
import { getRepository } from "typeorm";
import { Statistic, User } from "@riddea/typeorm";
import { Upload } from "@riddea/typeorm";
import humanize from "humanize-duration";
import { CommandInterface } from "./_interface";
import { commands as commandsStore } from "../helpers/loadCommands";
import i18n from "../helpers/localization";
import pkg from '../../package.json'

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

    const cmdStats = commandsStats.map((command) => i18n.translate("commandInfo", { command: command[0], uses: command[1] })).join("\n");
    const uploadStats = await getRepository(Upload).count();

    const message = `\n\n${i18n.translate("commandStats")}:\n${cmdStats}\n\n${i18n.translate("uploadStats")}:\n${i18n.translate(
      "uploadInfo",
      { count: uploadStats },
    )}\n\n${i18n.translate("botInfo")}:\n${i18n.translate("botUsername", { username: ctx.botInfo.username })}\n${i18n.translate("botID", {
      id: ctx.botInfo.id,
    })}\n${i18n.translate("botVersion", { version: pkg.version })}\n${i18n.translate("botUptime", { uptime: uptime })}`;

    await ctx.reply(message);
  }
}
