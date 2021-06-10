import { Context, Markup } from "telegraf";
import { sponsors } from "../constants";
import { CommandInterface } from "./_interface";

export default class extends CommandInterface {
  constructor() {
    super({
      description: "Display list of all bot sponsors",
      collectUsage: false,
      name: "sponsors",
      action: "SEND_SPONSORS",
    });
  }

  async run(ctx: Context) {
    const keyboard = Markup.inlineKeyboard(
      sponsors.map((x) => Markup.button.url(x.name, x.url)),
      { columns: 1 },
    );

    await ctx.reply(`Here you can find a list of all our sponsors. We are very grateful for their support!`, keyboard);
  }
}
