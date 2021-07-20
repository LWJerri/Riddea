import { Context, Markup } from "telegraf";
import { CommandInterface } from "./_interface";
import { waifyPicsApi } from "../helpers/waifyPicsApi";
import { ContextCallbackWithData } from "../typings/telegraf";

export default class extends CommandInterface {
  constructor() {
    super({
      description: "[NSFW]: Send blowjob pictures",
      collectUsage: true,
      name: "blowjob",
      actions: [
        {
          name: "WaifyPics Service",
          callback: "NEW_BLOWJOB_WAIFYPICS",
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

    if (!CBData || CBData == "NEW_BLOWJOB_WAIFYPICS") {
      const images = await waifyPicsApi({ endPoint: "nsfw/blowjob", amount: 1 });

      await ctx.replyWithVideo({ url: images[0] });
    }

    await ctx.reply("Do you like to see more blowjob video?", keyboard);
  }
}
