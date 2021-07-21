import { Markup } from "telegraf";
import { CommandInterface } from "./_interface";
import { shiroApi } from "../helpers/shiroApi";
import { waifuPicsApi } from "../helpers/waifuPicsApi";
import { ContextCallbackWithData } from "../typings/telegraf";
import i18n from "../helpers/localization";

export default class extends CommandInterface {
  constructor() {
    super({
      name: "neko",
      description: "[NSFW]: Send neko images",
      collectUsage: true,
      actions: [
        {
          name: i18n.translate("shiroService"),
          callback: "NEW_NEKO_SHIRO",
        },
        {
          name: i18n.translate("waifuPicsService"),
          callback: "NEW_NEKO_WAIFUPICS",
        },
        {
          name: `${i18n.translate("waifuPicsService")} [NSFW]`,
          callback: "NEW_NEKO_NSFW_WAIFUPICS",
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

    if (CBData == "NEW_NEKO_WAIFUPICS") {
      const images = await waifuPicsApi({ endPoint: "sfw/neko", amount: 10 });

      await ctx.replyWithMediaGroup(
        images.map((image) => {
          return {
            type: "photo",
            media: image,
          };
        }),
      );
    }

    if (CBData == "NEW_NEKO_NSFW_WAIFUPICS") {
      const images = await waifuPicsApi({ endPoint: "nsfw/neko", amount: 10 });

      await ctx.replyWithMediaGroup(
        images.map((image) => {
          return {
            type: "photo",
            media: image,
          };
        }),
      );
    }

    await ctx.reply(i18n.translate("newPackNeko"), keyboard);
  }
}
