import { Markup } from "telegraf";
import { CommandInterface } from "./_interface";
import { waifuPicsApi } from "../helpers/waifuPicsApi";
import { ContextCallbackWithData } from "../typings/telegraf";

export default class extends CommandInterface {
  constructor() {
    super({
      description: "[NSFW]: Send hentai blowjob video",
      collectUsage: true,
      cooldown: true,
      name: "blowjob",
      actions: [
        {
          name: "WaifuPics Service",
          callback: "NEW_BLOWJOB_WAIFUPICS",
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

    if (!CBData || CBData == "NEW_BLOWJOB_WAIFUPICS") {
      const images = await waifuPicsApi({ endPoint: "nsfw/blowjob", amount: 1 });

      await ctx.replyWithVideo({ url: images[0] });
    }

    await ctx.reply(ctx.i18n.translate("newPackBlowjob"), keyboard);
  }
}