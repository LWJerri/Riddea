import { shiroApi } from "../helpers/shiroApi";
import { Markup } from "telegraf";
import { CommandInterface } from "./_interface";
import { ContextCallbackWithData } from "../typings/telegraf";
import i18n from "../helpers/localization";

export default class extends CommandInterface {
  constructor() {
    super({
      description: "Search best anime picture for your avatar",
      collectUsage: true,
      name: "avatar",
      actions: [
        {
          name: "Shiro Service",
          callback: "NEW_AVATAR_SHIRO",
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

    if (!CBData || CBData == "NEW_AVATAR_SHIRO") {
      const images = await shiroApi({ endPoint: "avatars", amount: 10 });

      await ctx.replyWithMediaGroup(
        images.map((image) => {
          return {
            type: "photo",
            media: image,
          };
        }),
      );
    }

    await ctx.reply(i18n.translate("newPackAvatars"), keyboard);
  }
}
