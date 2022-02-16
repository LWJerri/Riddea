import { Markup } from "telegraf";
import { nekosLifeApi } from "../helpers/nekosLifeApi";
import { shiroApi } from "../helpers/shiroApi";
import { ContextCallbackWithData } from "../typings/telegraf";
import { CommandInterface } from "./_interface";

export default class extends CommandInterface {
  constructor() {
    super({
      name: "wallpaper",
      description: "[NSFW]: Send wallpaper images",
      collectUsage: true,
      cooldown: true,
      actions: [
        {
          name: "Shiro Service",
          callback: "NEW_WALLPAPER_SHIRO",
        },
        {
          name: "NekosLife Service [NSFW]",
          callback: "NEW_WALLPAPER_NEKOS",
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
      if (!callback || callback == "NEW_WALLPAPER_SHIRO") return await shiroApi({ endPoint: "wallpapers", amount: 10 });
      if (callback == "NEW_WALLPAPER_NEKOS") return await nekosLifeApi({ endPoint: "wallpaper", amount: 10 });
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

    await ctx.reply(
      ctx.i18n.translate("bot.main.newPack.images", { pack: ctx.i18n.translate("bot.packs.wallpaper") }),
      keyboard,
    );
  }
}
