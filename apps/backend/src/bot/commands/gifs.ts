import { Markup } from "telegraf";
import { nekosLifeApi } from "../helpers/nekosLifeApi";
import { ContextCallbackWithData } from "../typings/telegraf";
import { CommandInterface } from "./_interface";

export default class extends CommandInterface {
  constructor() {
    super({
      description: "[NSFW]: Send random hentai GIFs",
      collectUsage: true,
      cooldown: true,
      name: "gifs",
      actions: [
        {
          name: "NekosLife Service #1 [NSFW]",
          callback: "NEW_CLASSIC_NEKOS",
        },
        {
          name: "NekosLife Service #2 [NSFW]",
          callback: "NEW_RANDOM_NEKOS",
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
      if (!callback || callback == "NEW_CLASSIC_NEKOS") return await nekosLifeApi({ endPoint: "classic", amount: 1 });
      if (callback == "NEW_RANDOM_NEKOS") {
        const endpoints = [
          "Random_hentai_gif",
          "boobs",
          "kuni",
          "tickle",
          "feetg",
          "nsfw_neko_gif",
          "pwankg",
          "bj",
          "cum",
          "ngif",
          "anal",
          "les",
        ];

        return await nekosLifeApi({ endPoint: endpoints[Math.floor(Math.random() * endpoints.length)], amount: 1 });
      }
    }

    const images = await API(callback);
    await ctx.replyWithAnimation({ url: images[0] });

    await ctx.reply(ctx.i18n.translate("bot.main.newPack.videos", { pack: ctx.i18n.translate("bot.packs.gifs") }), keyboard);
  }
}
