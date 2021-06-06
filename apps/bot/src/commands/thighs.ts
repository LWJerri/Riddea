import { Context, Markup } from "telegraf";
import { CommandInterface } from "./_interface";
import { shiroApi } from "../helpers/shiroApi";

export default class extends CommandInterface {
  constructor() {
    super({
      name: "thighs",
      description: "[NSFW]: Send thighs image",
      collectUsage: true,
      action: "NEW_THIGHS",
    });
  }

  async run(ctx: Context) {
    const images = await shiroApi({ endPoint: "nsfw/thighs", amount: 10 });

    await ctx.replyWithMediaGroup(
      images.map((image) => {
        return {
          type: "photo",
          media: image.url,
        };
      }),
    );

    await ctx.reply("Do you like to see more thighs?", Markup.inlineKeyboard([Markup.button.callback("Give me more!", this.action)]));
  }
}
