import { Context, Markup } from "telegraf";
import { CommandInterface } from "./_interface";
import { shiroApi } from "../helpers/shiroApi";

export default class extends CommandInterface {
  constructor() {
    super({
      name: "hentai",
      description: "[NSFW]: Send hentai image",
      collectUsage: true,
      action: "NEW_HENTAI",
    });
  }

  async run(ctx: Context) {
    const images = await shiroApi({ endPoint: "nsfw/hentai", amount: 10 });

    await ctx.replyWithMediaGroup(
      images.map((image) => {
        return {
          type: "photo",
          media: image.url,
        };
      }),
    );

    await ctx.reply("Do you like to see more hentai?", Markup.inlineKeyboard([Markup.button.callback("Give me more!", this.action)]));
  }
}
