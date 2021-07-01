import { Markup } from "telegraf";
import { CommandInterface } from "./_interface";
import { shiroApi } from "../helpers/shiroApi";
import { waifyPicsApi } from "../helpers/waifyPicsApi";
import { ContextCallbackWithData } from "../typings/telegraf";

export default class extends CommandInterface {
  constructor() {
    super({
      name: "hentai",
      description: "[NSFW]: Send hentai images",
      collectUsage: true,
      actions: [
        { name: "Shiro Service", callback: "NEW_HENTAI_SHIRO" },
        { name: "WaifyPics Service", callback: "NEW_HENTAI_WAIFYPICS" },
      ],
    });
  }

  async run(ctx: ContextCallbackWithData) {
    const CBData = ctx.callbackQuery?.data;
    const keyboard = Markup.inlineKeyboard(
      this.actions.map((action) => Markup.button.callback(action.name, action.callback)),
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
