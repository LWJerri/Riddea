import { Markup } from "telegraf";
import { nekosLifeApi } from "../helpers/nekosLifeApi";
import { shiroApi } from "../helpers/shiroApi";
import { waifuPicsApi } from "../helpers/waifuPicsApi";
import { ContextCallbackWithData } from "../typings/telegraf";
import { CommandInterface } from "./_interface";

export default class extends CommandInterface {
  constructor() {
    super({
      name: "trap",
      description: "[NSFW]: Send trap images",
      collectUsage: true,
      cooldown: true,
      actions: [
        {
          name: "Shiro Service",
          callback: "NEW_TRAP_SHIRO",
        },
        {
          name: "WaifuPics Service [NSFW]",
          callback: "NEW_TRAP_WAIFUPICS",
        },
        {
          name: "NekosLife Service [NSFW]",
          callback: "NEW_TRAP_NEKOS",
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
      if (!callback || callback == "NEW_TRAP_SHIRO") return await shiroApi({ endPoint: "trap", amount: 10 });
      if (callback == "NEW_TRAP_WAIFUPICS") return await waifuPicsApi({ endPoint: "nsfw/trap", amount: 10 });
      if (callback == "NEW_TRAP_NEKOS") return await nekosLifeApi({ endPoint: "trap", amount: 10 });
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
      ctx.i18n.translate("bot.main.newPack.images", { pack: ctx.i18n.translate("bot.packs.trap") }),
      keyboard,
    );
  }
}
