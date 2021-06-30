import { Context, Markup } from "telegraf";
import { CommandInterface } from "./_interface";
import { shiroApi } from "../helpers/shiroApi";
import { Callback } from "../constants";
import { waifyPicsApi } from "../helpers/waifyPicsApi";

export default class extends CommandInterface {
  constructor() {
    super({
      name: "hentai",
      description: "[NSFW]: Send hentai images",
      collectUsage: true,
      actionsName: ["Shiro Service", "WaifyPics Service"],
      actions: ["NEW_HENTAI_SHIRO", "NEW_HENTAI_WAIFYPICS"],
    });
  }

  async run(ctx: Context) {
    const CBData = ctx.callbackQuery ? (ctx.callbackQuery as Callback).data : undefined;
    const keyboard = Markup.inlineKeyboard(
      this.actions.map((x, i) => Markup.button.callback(this.actionsName[i], x)),
      { columns: 1 },
    );

    if (!CBData || CBData == "NEW_HENTAI_SHIRO") {
      const images = await shiroApi({ endPoint: "nsfw/hentai", amount: 10 });

      await ctx.replyWithMediaGroup(
        images.map((image) => {
          return {
            type: "photo",
            media: image,
          };
        }),
      );
    }

    if (CBData == "NEW_HENTAI_WAIFYPICS") {
      const images = await waifyPicsApi({ endPoint: "nsfw/waifu", amount: 10 });

      await ctx.replyWithMediaGroup(
        images.map((image) => {
          return {
            type: "photo",
            media: image,
          };
        }),
      );
    }

    await ctx.reply("Do you like to see more hentai images?", keyboard);
  }
}
