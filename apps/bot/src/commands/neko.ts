import { Context, Markup } from "telegraf";
import { CommandInterface } from "./_interface";
import { shiroApi } from "../helpers/shiroApi";
import { Callback } from "../constants";
import { waifyPicsApi } from "../helpers/waifyPicsApi";

export default class extends CommandInterface {
  constructor() {
    super({
      name: "neko",
      description: "Send neko image",
      collectUsage: true,
      actionsName: ["Shiro Service", "WaifyPics Service", "WaifyPics Service [NSFW]"],
      actions: ["NEW_NEKO_SHIRO", "NEW_NEKO_WAIFYPICS", "NEW_NEKO_NSFW_WAIFYPICS"],
    });
  }

  async run(ctx: Context) {
    const CBData = ctx.callbackQuery ? (ctx.callbackQuery as Callback).data : undefined;
    const keyboard = Markup.inlineKeyboard(
      this.actions.map((x, i) => Markup.button.callback(this.actionsName[i], x)),
      { columns: 1 },
    );

    if (!CBData || CBData == "NEW_NEKO_SHIRO") {
      const images = await shiroApi({ endPoint: "neko", amount: 10 });

      await ctx.replyWithMediaGroup(
        images.map((image) => {
          return {
            type: "photo",
            media: image,
          };
        }),
      );
    }

    if (CBData == "NEW_NEKO_WAIFYPICS") {
      const images = await waifyPicsApi({ endPoint: "sfw/neko", amount: 10 });

      await ctx.replyWithMediaGroup(
        images.map((image) => {
          return {
            type: "photo",
            media: image,
          };
        }),
      );
    }

    if (CBData == "NEW_NEKO_NSFW_WAIFYPICS") {
      const images = await waifyPicsApi({ endPoint: "nsfw/neko", amount: 10 });

      await ctx.replyWithMediaGroup(
        images.map((image) => {
          return {
            type: "photo",
            media: image,
          };
        }),
      );
    }

    await ctx.reply("Do you like to see more neko images?", keyboard);
  }
}
