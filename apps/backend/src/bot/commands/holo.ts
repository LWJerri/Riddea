import { Markup } from "telegraf";
import { nekosLifeApi } from "../helpers/nekosLifeApi";
import { ContextCallbackWithData } from "../typings/telegraf";
import { CommandInterface } from "./_interface";

export default class extends CommandInterface {
  constructor() {
    super({
      description: "[NSFW]: Send holo images",
      collectUsage: true,
      cooldown: true,
      name: "holo",
      actions: [
        {
          name: "NekosLife Service",
          callback: "NEW_HOLO_NEKOS_LEWD",
        },
        {
          name: "NekosLife Service",
          callback: "NEW_HOLO_NEKOS_ERO",
        },
        {
          name: "NekosLife Service",
          callback: "NEW_HOLO_NEKOS",
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
      if (!callback || callback == "NEW_HOLO_NEKOS_LEWD") return await nekosLifeApi({ endPoint: "hololewd", amount: 10 });
      if (callback == "NEW_HOLO_NEKOS_ERO") return await nekosLifeApi({ endPoint: "holoero", amount: 10 });
      if (callback == "NEW_HOLO_NEKOS") return await nekosLifeApi({ endPoint: "holo", amount: 10 });
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

    await ctx.reply(ctx.i18n.translate("bot.main.newPack.images", { pack: ctx.i18n.translate("bot.packs.avatars") }), keyboard);
  }
}
