import { Markup } from "telegraf";
import { nekosLifeApi } from "../helpers/nekosLifeApi";
import { shiroApi } from "../helpers/shiroApi";
import { ContextCallbackWithData } from "../typings/telegraf";
import { CommandInterface } from "./_interface";

export default class extends CommandInterface {
  constructor() {
    super({
      description: "[NSFW]: Search anime picture for your avatar",
      collectUsage: true,
      cooldown: true,
      name: "avatar",
      actions: [
        {
          name: "Shiro Service",
          callback: "NEW_AVATAR_SHIRO",
        },
        {
          name: "NekosLife Service",
          callback: "NEW_AVATAR_NEKOS",
        },
        {
          name: "NekosLife Service #1 [NSFW]",
          callback: "NEW_AVATAR_NSFW_NEKOS",
        },
        {
          name: "NekosLife Service #2 [NSFW]",
          callback: "NEW_AVATAR_GASM_NEKOS",
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
      if (!callback || callback == "NEW_AVATAR_SHIRO") return await shiroApi({ endPoint: "avatars", amount: 10 });
      if (callback == "NEW_AVATAR_NEKOS") return await nekosLifeApi({ endPoint: "avatar", amount: 10 });
      if (callback == "NEW_AVATAR_NSFW_NEKOS") return await nekosLifeApi({ endPoint: "nsfw_avatar", amount: 10 });
      if (callback == "NEW_AVATAR_GASM_NEKOS") return await nekosLifeApi({ endPoint: "gasm", amount: 10 });
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
      ctx.i18n.translate("bot.main.newPack.images", { pack: ctx.i18n.translate("bot.packs.avatars") }),
      keyboard,
    );
  }
}
