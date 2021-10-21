import { Markup } from "telegraf";
import { shiroApi } from "../helpers/shiroApi";
import { ContextCallbackWithData } from "../typings/telegraf";
import { CommandInterface } from "./_interface";

export default class extends CommandInterface {
  constructor() {
    super({
      description: "Send femdom images",
      collectUsage: true,
      cooldown: true,
      name: "femdom",
      actions: [
        {
          name: "NekosLife Service",
          callback: "NEW_FEMDOM_NEKOS",
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
      if (!callback || callback == "NEW_FEMDOM_NEKOS") return await shiroApi({ endPoint: "femdom", amount: 10 });
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
