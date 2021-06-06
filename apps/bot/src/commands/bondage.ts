import { Context, Markup } from "telegraf";
import { CommandInterface } from "./_interface";
import { shiroApi } from "../helpers/shiroApi";

export default class extends CommandInterface {
  constructor() {
    super({
      description: "[NSFW]: Send bondage image",
      collectUsage: true,
      name: "bondage",
      action: "NEW_BONDAGE",
    });
  }

  async run(ctx: Context) {
    const images = await shiroApi({ endPoint: "bondage", amount: 10 });

    await ctx.replyWithMediaGroup(
      images.map((image) => {
        return {
          type: "photo",
          media: image.url,
        };
      }),
    );

    await ctx.reply("Do you like to see more bondage?", Markup.inlineKeyboard([Markup.button.callback("Give me more!", this.action)]));
  }
}
