import { Markup } from "telegraf";
import { CommandInterface } from "./_interface";
import { shiroApi } from "../helpers/shiroApi";
import { ContextCallbackWithData } from "../typings/telegraf";
import i18n from "../helpers/localization";

export default class extends CommandInterface {
  constructor() {
    super({
      description: "[NSFW]: Send bondage images",
      collectUsage: true,
      cooldown: true,
      name: "bondage",
      actions: [
        {
          name: "Shiro Service",
          callback: "NEW_BONDAGE_SHIRO",
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

    if (!CBData || CBData == "NEW_BONDAGE_SHIRO") {
      const images = await shiroApi({ endPoint: "nsfw/bondage", amount: 10 });

      await ctx.replyWithMediaGroup(
        images.map((image) => {
          return {
            type: "photo",
            media: image,
          };
        }),
      );
    }

    await ctx.reply(i18n.translate("newPackBondage"), keyboard);
  }
}
