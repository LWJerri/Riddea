import { Markup } from "telegraf";
import { waifuPicsApi } from "../helpers/waifuPicsApi";
import { ContextCallbackWithData } from "../typings/telegraf";
import { CommandInterface } from "./_interface";

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
    const callback = ctx.callbackQuery?.data;
    const keyboard = Markup.inlineKeyboard(
      this.actions.map((action) => Markup.button.callback(action.name, action.callback)),
      { columns: 1 },
    );

    async function API(callback?: string) {
      if (!callback || callback == "NEW_BLOWJOB_WAIFUPICS") return await waifuPicsApi({ endPoint: "nsfw/blowjob", amount: 1 });
    }

    const images = await API(callback);
    await ctx.replyWithVideo({ url: images[0] });

    await ctx.reply(ctx.i18n.translate("bot.main.newPack.videos", { pack: ctx.i18n.translate("bot.packs.blowjob") }), keyboard);
  }
}
