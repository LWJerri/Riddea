import { shiroApi } from "../helpers/shiroApi";
import { Context, Markup } from "telegraf";
import { CommandInterface } from "./_interface";
import { Callback } from "../constants";

export default class extends CommandInterface {
  constructor() {
    super({
      description: "Send anime pictures for avatar",
      collectUsage: true,
      name: "avatar",
      actionsName: ["Shiro Service"],
      actions: ["NEW_AVATAR_SHIRO"],
    });
  }

  async run(ctx: Context) {
    const CBData = ctx.callbackQuery ? (ctx.callbackQuery as Callback).data : undefined;
    const keyboard = Markup.inlineKeyboard(
      this.actions.map((x, i) => Markup.button.callback(this.actionsName[i], x)),
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

    await ctx.reply("Do you like to see more avatars images?", keyboard);
  }
}
