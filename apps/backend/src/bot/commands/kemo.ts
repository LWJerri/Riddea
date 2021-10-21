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
          name: "NekosLife Service",
          callback: "NEW_SOLOG_NEKOS_LEWD",
        },
        {
          name: "NekosLife Service",
          callback: "NEW_SOLOG_NEKOS_ERO",
        },
        {
          name: "NekosLife Service",
          callback: "NEW_SOLOG_NEKOS_MIMI",
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
      if (!callback || callback == "NEW_SOLOG_NEKOS_LEWD") return await nekosLifeApi({ endPoint: "lewdkemo", amount: 10 });
      if (callback == "NEW_SOLOG_NEKOS_ERO") return await nekosLifeApi({ endPoint: "erokemo", amount: 10 });
      if (callback == "NEW_SOLOG_NEKOS_MIMI") return await nekosLifeApi({ endPoint: "kemonomimi", amount: 10 });
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
