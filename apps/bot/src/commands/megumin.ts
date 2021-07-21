import { Markup } from "telegraf";
import { CommandInterface } from "./_interface";
import { waifuPicsApi } from "../helpers/waifuPicsApi";
import { ContextCallbackWithData } from "../typings/telegraf";
import i18n from "../helpers/localization";

export default class extends CommandInterface {
  constructor() {
    super({
      description: "Send megumin pictures",
      collectUsage: true,
      name: "megumin",
      actions: [
        {
          name: "WaifuPics Service",
          callback: "NEW_MEGUMIN_WAIFUPICS",
        },
      ],
    });
  }

  async run(ctx: ContextCallbackWithData) {
    const CBData = ctx.callbackQuery?.data;
    const keyboard = Markup.inlineKeyboard(
      this.actions.map((action) => Markup.button.callback(action.name, action.callback)),
      { columns: 1 },
    );

    if (!CBData || CBData == "NEW_MEGUMIN_WAIFUPICS") {
      const images = await waifuPicsApi({ endPoint: "sfw/megumin", amount: 10 });

      await ctx.replyWithMediaGroup(
        images.map((image) => {
          return {
            type: "photo",
            media: image,
          };
        }),
      );
    }

    await ctx.reply(i18n.translate("newPackMegumin"), keyboard);
  }
}
