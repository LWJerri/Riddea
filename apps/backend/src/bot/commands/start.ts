import { Context } from "telegraf";
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
              text: ctx.i18n.translate("bot.buttons.help"),
              callback_data: "SEND_HELPMENU",
            },
            {
              text: ctx.i18n.translate("bot.buttons.statistics"),
              callback_data: "SEND_STATISTIC",
            },
            {
              text: "GitHub",
              url: "https://github.com/Riddea",
            },
          ],
          [{ text: ctx.i18n.translate("bot.buttons.settings"), callback_data: "USER_SETTINGS" }],
        ],
      },
    };

    await ctx.reply(ctx.i18n.translate("bot.main.start.first", { user: ctx.from.first_name }));
    await ctx.replyWithMarkdown(ctx.i18n.translate("bot.main.start.second"), keyboard);
  }
}
