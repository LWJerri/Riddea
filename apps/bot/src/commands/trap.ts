import { Context, Markup } from "telegraf";
import { CommandInterface } from "./_interface";
import { shiroApi } from "../helpers/shiroApi";

import { waifyPicsApi } from "../helpers/waifyPicsApi";
import { ContextCallbackWithData } from "../typings/telegraf";

export default class extends CommandInterface {
  constructor() {
    super({
      name: "trap",
      description: "Send trap images",
      collectUsage: true,
      actions: [
        {
          name: "Shiro Service",
          callback: "NEW_TRAP_SHIRO",
        },
        {
          name: "WaifyPics Service (NSFW)",
          callback: "NEW_TRAP_WAIFYPICS",
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

    if (CBData == "NEW_TRAP_WAIFYPICS") {
      const images = await waifyPicsApi({ endPoint: "nsfw/trap", amount: 10 });

      await ctx.replyWithMediaGroup(
        images.map((image) => {
          return {
            type: "photo",
            media: image,
          };
        }),
      );
    }

    await ctx.reply("Do you like to see more trap images?", keyboard);
  }
}
