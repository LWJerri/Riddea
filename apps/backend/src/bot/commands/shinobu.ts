import { Markup } from "telegraf";
import { waifuPicsApi } from "../helpers/waifuPicsApi";
import { ContextCallbackWithData } from "../typings/telegraf";
import { CommandInterface } from "./_interface";

export default class extends CommandInterface {
  constructor() {
    super({
      description: "Send shinobu pictures",
      collectUsage: true,
      cooldown: true,
      name: "shinobu",
      actions: [
        {
          name: "WaifuPics Service",
          callback: "NEW_SHINOBU_WAIFUPICS",
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
      if (!callback || callback == "NEW_SHINOBU_WAIFUPICS") return await waifuPicsApi({ endPoint: "sfw/shinobu", amount: 10 });
    }

    const images = await API(callback);
    await ctx.replyWithMediaGroup(
      images.map((image) => {
        return {
          type: "photo",
          media: image,
        };
      }),
    );

    await ctx.reply(ctx.i18n.translate("bot.main.newPack.images", { pack: ctx.i18n.translate("bot.packs.shinobu") }), keyboard);
  }
}
