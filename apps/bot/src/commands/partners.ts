import { Context, Markup } from "telegraf";
import { partners } from "../constants";
import i18n from "../helpers/localization";
import { CommandInterface } from "./_interface";

export default class extends CommandInterface {
  constructor() {
    super({
      description: "Display list of all bot partners",
      collectUsage: false,
      name: "partners",
      actions: [{ callback: "SEND_PARTNERS" }],
    });
  }

  async run(ctx: Context) {
    const keyboard = Markup.inlineKeyboard(
      partners.map((x) => Markup.button.url(x.name, x.url)),
      { columns: 1 },
    );

    await ctx.reply(i18n.translate("partnersMessage"), keyboard);
  }
}
