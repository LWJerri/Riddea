import { Markup } from "telegraf";
import { CommandInterface } from "./_interface";
import { shiroApi } from "../helpers/shiroApi";
import { waifuPicsApi } from "../helpers/waifuPicsApi";
import { ContextCallbackWithData } from "../typings/telegraf";
import i18n from "../helpers/localization";

export default class extends CommandInterface {
  constructor() {
    super({
      name: "trap",
      description: "[NSFW]: Send trap images",
      collectUsage: true,
      actions: [
        {
          name: "Shiro Service",
          callback: "NEW_TRAP_SHIRO",
        },
        {
          name: `${"WaifuPics Service"} [NSFW]`,
          callback: "NEW_TRAP_WAIFUPICS",
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

    if (!CBData || CBData == "NEW_TRAP_SHIRO") {
      const images = await shiroApi({ endPoint: "trap", amount: 10 });

      await ctx.replyWithMediaGroup(
        images.map((image) => {
          return {
            type: "photo",
            media: image,
          };
        }),
      );
    }

    if (CBData == "NEW_TRAP_WAIFUPICS") {
      const images = await waifuPicsApi({ endPoint: "nsfw/trap", amount: 10 });

      await ctx.replyWithMediaGroup(
        images.map((image) => {
          return {
            type: "photo",
            media: image,
          };
        }),
      );
    }

    await ctx.reply(i18n.translate("newPackTrap"), keyboard);
  }
}
