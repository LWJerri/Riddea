import { Context, Markup } from "telegraf";
import { CommandInterface } from "./_interface";
import { Callback } from "../constants";
import { waifyPicsApi } from "../helpers/waifyPicsApi";

export default class extends CommandInterface {
  constructor() {
    super({
      description: "[NSFW]: Send blowjob pictures",
      collectUsage: true,
      name: "blowjob",
      actionsName: ["WaifyPics Service"],
      actions: ["NEW_BLOWJOB_WAIFYPICS"],
    });
  }

  async run(ctx: Context) {
    const CBData = ctx.callbackQuery ? (ctx.callbackQuery as Callback).data : undefined;
    const keyboard = Markup.inlineKeyboard(
      this.actions.map((x, i) => Markup.button.callback(this.actionsName[i], x)),
      { columns: 1 },
    );

    if (!CBData || CBData == "NEW_BLOWJOB_WAIFYPICS") {
      const images = await waifyPicsApi({ endPoint: "nsfw/blowjob", amount: 1 });

      await ctx.replyWithVideo({ url: images[0] });
    }

    await ctx.reply("Do you like to see more blowjob video?", keyboard);
  }
}
