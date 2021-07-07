import { Context, Markup } from "telegraf";
import { CommandInterface } from "./_interface";
import { shiroApi } from "../helpers/shiroApi";
import { waifyPicsApi } from "../helpers/waifyPicsApi";
import { ContextCallbackWithData } from "../typings/telegraf";

export default class extends CommandInterface {
  constructor() {
    super({
      name: "neko",
      description: "[NSFW]: Send neko images",
      collectUsage: true,
      actions: [
        {
          name: "Shiro Service",
          callback: "NEW_NEKO_SHIRO",
        },
        {
          name: "WaifyPics Service",
          callback: "NEW_NEKO_WAIFYPICS",
        },
        {
          name: "WaifyPics Service (NSFW)",
          callback: "NEW_NEKO_NSFW_WAIFYPICS",
        },
      ],
    });
  }

  async run(ctx: ContextCallbackWithData) {
    const CBData = ctx.callbackQuery?.data;
    const keyboard = Markup.inlineKeyboard(
      this.actions.map((action) => Markup.button.callback(action.name, action.callback)),
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
