import { Context } from "telegraf";
import i18n from "../helpers/localization";
import { CommandInterface } from "./_interface";

export default class extends CommandInterface {
  constructor() {
    super({
      name: "start",
      collectUsage: true,
      cooldown: false,
      description: "Display start menu",
    });
  }

  async run(ctx: Context) {
    const keyboard = {
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: i18n.translate("helpMenu"),
              callback_data: "SEND_HELPMENU",
            },
            {
              text: i18n.translate("statistics"),
              callback_data: "SEND_STATISTIC",
            },
            {
              text: "GitHub",
              url: "https://github.com/Riddea",
            },
          ],
          [{ text: i18n.translate("settings"), callback_data: "USER_SETTINGS" }],
        ],
      },
    };

    await ctx.reply(i18n.translate("firstStartMessage", { user: ctx.from.first_name }));
    await ctx.replyWithMarkdown(i18n.translate("secondStartMessage"), keyboard);
  }
}
