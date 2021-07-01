import { Context, Markup } from "telegraf";
import { CommandInterface } from "./_interface";

import { waifyPicsApi } from "../helpers/waifyPicsApi";
import { ContextCallbackWithData } from "../typings/telegraf";

export default class extends CommandInterface {
  constructor() {
    super({
      description: "Send shinobu pictures",
      collectUsage: true,
      name: "shinobu",
      actions: [
        {
          name: "WaifyPics Service",
          callback: "NEW_SHINOBU_WAIFYPICS",
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

    if (!CBData || CBData == "NEW_SHINOBU_WAIFYPICS") {
      const images = await waifyPicsApi({ endPoint: "sfw/shinobu", amount: 10 });

      await ctx.replyWithMediaGroup(
        images.map((image) => {
          return {
            type: "photo",
            media: image,
          };
        }),
      );
    }

    await ctx.reply("Do you like to see more shinobu images?", keyboard);
  }
}
