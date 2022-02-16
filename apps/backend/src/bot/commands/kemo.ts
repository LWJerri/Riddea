import { Markup } from "telegraf";
import { nekosLifeApi } from "../helpers/nekosLifeApi";
import { ContextCallbackWithData } from "../typings/telegraf";
import { CommandInterface } from "./_interface";

export default class extends CommandInterface {
  constructor() {
    super({
      description: "[NSFW]: Send kemo images",
      collectUsage: true,
      cooldown: true,
      name: "kemo",
      actions: [
        {
          name: "NekosLife Service [NSFW]",
          callback: "NEW_KEMO_NEKOS",
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
      if (!callback || callback == "NEW_KEMO_NEKOS") {
        const endpoints = ["lewdneko", "erokemo", "kemonomimi"];

        return await nekosLifeApi({ endPoint: endpoints[Math.floor(Math.random() * endpoints.length)], amount: 10 });
      }
    }

    const images = await API(сallback);

    await ctx.replyWithMediaGroup(
      images.map((image) => {
        return {
          type: "photo",
          media: image,
        };
      }),
    );

    await ctx.reply(
      ctx.i18n.translate("bot.main.newPack.images", { pack: ctx.i18n.translate("bot.packs.kemo") }),
      keyboard,
    );
  }
}
