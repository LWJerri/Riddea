import { Markup } from "telegraf";
import { shiroApi } from "../helpers/shiroApi";
import { ContextCallbackWithData } from "../typings/telegraf";
import { CommandInterface } from "./_interface";

export default class extends CommandInterface {
  constructor() {
    super({
      name: "thighs",
      description: "[NSFW]: Send thighs images",
      collectUsage: true,
      cooldown: true,
      actions: [{ name: "Shiro Service", callback: "NEW_THIGHS_SHIRO" }],
    });
  }

  async run(ctx: ContextCallbackWithData) {
    const callback = ctx.callbackQuery?.data;
    const keyboard = Markup.inlineKeyboard(
      this.actions.map((action) => Markup.button.callback(action.name, action.callback)),
      { columns: 1 },
    );

    async function API(callback?: string) {
      if (!callback || callback == "NEW_THIGHS_SHIRO") return await shiroApi({ endPoint: "nsfw/thighs", amount: 10 });
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

    await ctx.reply(ctx.i18n.translate("bot.main.newPack.images", { pack: ctx.i18n.translate("bot.packs.thighs") }), keyboard);
  }
}
