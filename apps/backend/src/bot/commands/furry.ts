import { Markup } from "telegraf";
import { yiffyPicsApi } from "../helpers/yiffyApi";
import { ContextCallbackWithData } from "../typings/telegraf";
import { CommandInterface } from "./_interface";

export default class extends CommandInterface {
  constructor() {
    super({
      description: "[NSFW]: Send furry images",
      collectUsage: true,
      cooldown: true,
      name: "furry",
      actions: [
        {
          name: "Yiffy Service",
          callback: "NEW_SFW_YIFFY",
        },
        {
          name: "Yiffy Service [NSFW]",
          callback: "NEW_NSFW_YIFFY",
        },
      ],
    });
  }

  async run(ctx: ContextCallbackWithData) {
    const сallback = ctx.callbackQuery?.data;

    const keyboard = Markup.inlineKeyboard(
      this.actions.map((action) => Markup.button.callback(action.name, action.callback)),
      { columns: 1 },
    );

    async function API(callback?: string) {
      if (!callback || callback == "NEW_SFW_YIFFY") {
        const endpoints = ["furry/boop", "furry/cuddle", "furry/flop", "furry/hold", "furry/hug", "furry/kiss", "furry/propose"];

        return await yiffyPicsApi({ endPoint: endpoints[Math.floor(Math.random() * endpoints.length)], amount: 2 });
      }
      if (callback == "NEW_NSFW_YIFFY") {
        const endpoints = ["furry/bulge", "furry/yiff/andromorph", "furry/yiff/gynomorph", "furry/yiff/lesbian", "furry/yiff/straight"];

        return await yiffyPicsApi({ endPoint: endpoints[Math.floor(Math.random() * endpoints.length)], amount: 2 });
      }
    }

    const images = await API(сallback);

    await ctx.replyWithMediaGroup(
      images.map((image) => {
        return {
          type: "photo",
          media: { source: image },
        };
      }),
    );

    await ctx.reply(ctx.i18n.translate("bot.main.newPack.images", { pack: ctx.i18n.translate("bot.packs.furry") }), keyboard);
  }
}
