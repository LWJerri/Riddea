import { Context, Markup } from "telegraf";
import { partners } from "../constants";
import { CommandInterface } from "./_interface";

export default class extends CommandInterface {
  constructor() {
    super({
      description: "Display list of all bot partners",
      collectUsage: true,
      name: "partners",
      actions: [{ callback: "SEND_PARTNERS" }],
    });
  }

  async run(ctx: Context) {
    const keyboard = Markup.inlineKeyboard(
      partners.map((x) => Markup.button.url(x.name, x.url)),
      { columns: 1 },
    );

    await ctx.reply(`Here you can find a list of all our partners. We are very grateful for their support!`, keyboard);
  }
}
