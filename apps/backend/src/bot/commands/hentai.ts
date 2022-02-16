import { Markup } from "telegraf";
import { nekosLifeApi } from "../helpers/nekosLifeApi";
import { shiroApi } from "../helpers/shiroApi";
import { waifuPicsApi } from "../helpers/waifuPicsApi";
import { ContextCallbackWithData } from "../typings/telegraf";
import { CommandInterface } from "./_interface";

export default class extends CommandInterface {
  constructor() {
    super({
      name: "hentai",
      description: "[NSFW]: Send hentai images",
      collectUsage: true,
      cooldown: true,
      actions: [
        { name: "Shiro Service [NSFW]", callback: "NEW_HENTAI_SHIRO" },
        { name: "WaifuPics Service [NSFW]", callback: "NEW_HENTAI_WAIFUPICS" },
        { name: "NekosLife Service [NSFW]", callback: "NEW_HENTAI_NEKOS" },
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
      if (!callback || callback == "NEW_HENTAI_SHIRO") return await shiroApi({ endPoint: "nsfw/hentai", amount: 10 });
      if (callback == "NEW_HENTAI_WAIFUPICS") return await waifuPicsApi({ endPoint: "nsfw/waifu", amount: 10 });
      if (callback == "NEW_HENTAI_NEKOS") {
        const endpoints = ["hentai", "solo", "keta", "pussy_jpg", "cum_jpg", "tits", "ero"];

        return await nekosLifeApi({ endPoint: endpoints[Math.floor(Math.random() * endpoints.length)], amount: 10 });
      }
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
      ctx.i18n.translate("bot.main.newPack.images", { pack: ctx.i18n.translate("bot.packs.hentai") }),
      keyboard,
    );
  }
}
