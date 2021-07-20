import { Context, Markup } from "telegraf";
import { CommandInterface } from "./_interface";

import { waifyPicsApi } from "../helpers/waifyPicsApi";
import { ContextCallbackWithData } from "../typings/telegraf";

export default class extends CommandInterface {
  constructor() {
    super({
      description: "Send waifu pictures",
      collectUsage: true,
      name: "waifu",
      actions: [
        {
          name: "WaifyPics Service",
          callback: "NEW_WAIFY_WAIFYPICS",
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

    if (!CBData || CBData == "NEW_WAIFY_WAIFYPICS") {
      const images = await waifyPicsApi({ endPoint: "sfw/waifu", amount: 10 });

      await ctx.replyWithMediaGroup(
        images.map((image) => {
          return {
            type: "photo",
            media: image,
          };
        }),
      );
    }

    await ctx.reply("Do you like to see more waifu images?", keyboard);
  }
}
