import { Markup } from "telegraf";
import { nekosLifeApi } from "../helpers/nekosLifeApi";
import { ContextCallbackWithData } from "../typings/telegraf";
import { CommandInterface } from "./_interface";

export default class extends CommandInterface {
  constructor() {
    super({
      description: "[NSFW]: Send Kitsune images",
      collectUsage: true,
      cooldown: true,
      name: "kitsune",
      actions: [
        {
          name: "NekosLife Service [NSFW]",
          callback: "NEW_KITSUNE_NEKOS",
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
      if (!callback || callback == "NEW_KITSUNE_NEKOS") {
        const endpoints = ["lewdk", "erok"];

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
      ctx.i18n.translate("bot.main.newPack.images", { pack: ctx.i18n.translate("bot.packs.kitsune") }),
      keyboard,
    );
  }
}
