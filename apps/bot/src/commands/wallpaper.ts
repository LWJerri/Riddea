import { Context, Markup } from "telegraf";
import axios from "axios";
import { fileTypes } from "../constants";
import { CommandInterface } from "./_interface";
import { shiroApi } from "src/helpers/shiroApi";

export default class extends CommandInterface {
  constructor() {
    super({
      name: "wallpaper",
      description: "Send wallpaper image",
      collectUsage: true,
      action: "NEW_WALLPAPER",
    });
  }

  async run(ctx: Context) {
    const images = await shiroApi({ endPoint: "wallpaper", amount: 10 });

    await ctx.replyWithMediaGroup(
      images.map((image) => {
        return {
          type: "photo",
          media: image.url,
        };
      }),
    );

    await ctx.reply("Do you like to see more wallpapers?", Markup.inlineKeyboard([Markup.button.callback("Give me more!", this.action)]));
  }
}
