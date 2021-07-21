import { Context, Markup } from "telegraf";
import i18n from "../helpers/localization";
import { CommandInterface } from "./_interface";

export default class extends CommandInterface {
  constructor() {
    super({
      description: "Display help menu",
      collectUsage: false,
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
          text: i18n.translate("support"),
          url: "https://www.donationalerts.com/r/lwjerri",
        },
        {
          text: i18n.translate("partners"),
          callback_data: "SEND_PARTNERS",
        },
      ],
    ]);

    await ctx.reply(i18n.translate("helpMenuMessage"), keyboard);
  }
}
