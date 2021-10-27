import { Markup } from "telegraf";
import { nekosLifeApi } from "../helpers/nekosLifeApi";
import { shiroApi } from "../helpers/shiroApi";
import { waifuPicsApi } from "../helpers/waifuPicsApi";
import { ContextCallbackWithData } from "../typings/telegraf";
import { CommandInterface } from "./_interface";

export default class extends CommandInterface {
  constructor() {
    super({
      name: "neko",
      description: "[NSFW]: Send neko images",
      collectUsage: true,
      cooldown: true,
      actions: [
        {
          name: "Shiro Service",
          callback: "NEW_NEKO_SHIRO",
        },
        {
          name: "WaifuPics Service",
          callback: "NEW_NEKO_WAIFUPICS",
        },
        {
          name: `WaifuPics Service [NSFW]`,
          callback: "NEW_NEKO_NSFW_WAIFUPICS",
        },
        {
          name: `NekosLife Service`,
          callback: "NEW_NEKO_NEKOS",
        },
        {
          name: `NekosLife Service [NSFW]`,
          callback: "NEW_NEKO_NSFW_NEKOS",
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
      if (!callback || callback == "NEW_NEKO_SHIRO") return await shiroApi({ endPoint: "neko", amount: 10 });
      if (callback == "NEW_NEKO_WAIFUPICS") return await waifuPicsApi({ endPoint: "sfw/neko", amount: 10 });
      if (callback == "NEW_NEKO_NSFW_WAIFUPICS") return await waifuPicsApi({ endPoint: "nsfw/neko", amount: 10 });
      if (callback == "NEW_NEKO_NEKOS") return await nekosLifeApi({ endPoint: "neko", amount: 10 });
      if (callback == "NEW_NEKO_NSFW_NEKOS") {
        const endpoints = ["eron", "lewd"];

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

    await ctx.reply(ctx.i18n.translate("bot.main.newPack.images", { pack: ctx.i18n.translate("bot.packs.neko") }), keyboard);
  }
}
