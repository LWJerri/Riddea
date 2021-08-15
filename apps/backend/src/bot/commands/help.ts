import { Context, Markup } from "telegraf";

import { CommandInterface } from "./_interface";

export default class extends CommandInterface {
  constructor() {
    super({
      description: "Display help menu",
      collectUsage: false,
      cooldown: false,
      name: "help",
      actions: [{ callback: "SEND_HELPMENU" }],
    });
  }

  async run(ctx: Context) {
    const keyboard = Markup.inlineKeyboard([
      [
        {
          text: "GitHub",
          url: "https://github.com/Riddea",
        },
        {
          text: ctx.i18n.translate("bot.buttons.donate"),
          url: "https://www.donationalerts.com/r/lwjerri",
        },
        {
          text: ctx.i18n.translate("bot.buttons.partners"),
          callback_data: "SEND_PARTNERS",
        },
      ],
    ]);

    await ctx.reply(ctx.i18n.translate("bot.main.other.menuMessage"), keyboard);
  }
}
