import { Markup } from "telegraf";
import { nekosLifeApi } from "../helpers/nekosLifeApi";
import { ContextCallbackWithData } from "../typings/telegraf";
import { CommandInterface } from "./_interface";

export default class extends CommandInterface {
  constructor() {
    super({
      description: "[NSFW]: Send solog images",
      collectUsage: true,
      cooldown: true,
      name: "solog",
      actions: [
        {
          name: "NekosLife Service [NSFW]",
          callback: "NEW_SOLOG_NEKOS",
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
      if (!callback || callback == "NEW_SOLOG_NEKOS") return await nekosLifeApi({ endPoint: "solog", amount: 1 });
    }

    const images = await API(сallback);

    await ctx.replyWithAnimation(images[0]);

    await ctx.reply(
      ctx.i18n.translate("bot.main.newPack.images", { pack: ctx.i18n.translate("bot.packs.solog") }),
      keyboard,
    );
  }
}
