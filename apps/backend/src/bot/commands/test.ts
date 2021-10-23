import { Markup } from "telegraf";
import { yiffyPicsApi } from "../helpers/yiffyApi";
import { ContextCallbackWithData } from "../typings/telegraf";
import { CommandInterface } from "./_interface";

export default class extends CommandInterface {
  constructor() {
    super({
      description: "test command",
      collectUsage: true,
      cooldown: true,
      name: "test",
      actions: [
        {
          name: "test",
          callback: "TTT",
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
      if (!callback || callback == "TTT") return await yiffyPicsApi({ endPoint: "furry/hug", amount: 2 });
    }

    const images = await API(сallback);

    ctx.replyWithPhoto("https://yiff.media/V2/furry/hug/4ef97a560cb932b4a181a86fdf16aa95.jpg");

    /*await ctx.replyWithMediaGroup(
      images.map((image) => {
        return {
          type: "photo",
          media: image,
        };
      }),
    );*/

    await ctx.reply(ctx.i18n.translate("bot.main.newPack.images", { pack: ctx.i18n.translate("bot.packs.avatars") }), keyboard);
  }
}
