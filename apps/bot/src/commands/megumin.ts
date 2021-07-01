import { Context, Markup } from "telegraf";
import { CommandInterface } from "./_interface";

import { waifyPicsApi } from "../helpers/waifyPicsApi";
import { ContextCallbackWithData } from "../typings/telegraf";

export default class extends CommandInterface {
  constructor() {
    super({
      description: "Send megumin pictures",
      collectUsage: true,
      name: "megumin",
      actions: [
        {
          name: "WaifyPics Service",
          callback: "NEW_MEGUMIN_WAIFYPICS",
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

    if (!CBData || CBData == "NEW_MEGUMIN_WAIFYPICS") {
      const images = await waifyPicsApi({ endPoint: "sfw/megumin", amount: 10 });

      await ctx.replyWithMediaGroup(
        images.map((image) => {
          return {
            type: "photo",
            media: image,
          };
        }),
      );
    }

    await ctx.reply("Do you like to see more megumin images?", keyboard);
  }
}
