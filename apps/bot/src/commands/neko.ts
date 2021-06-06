import { Context } from "telegraf";
import axios from "axios";
import { fileTypes } from "../constants";
import { CommandInterface } from "./_interface";

export default class extends CommandInterface {
  constructor() {
    super({
      name: "neko",
      description: "Send neko image",
      collectUsage: true,
      action: "NEW_NEKO",
    });
  }

  async run(ctx: Context) {
    const url = await axios.get("https://shiro.gg/api/images/neko").catch(() => null);

    if (!url) return await ctx.reply("Oops! Can't get response from API :c").catch(() => {});
    const output = fileTypes.includes(url.data.fileType) ? url.data.url : url.data.url.replace(url.data.fileType, "png");

    await ctx
      .replyWithPhoto(output, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Show new neko image",
                callback_data: "NEW_NEKO",
              },
            ],
          ],
        },
      })
      .catch(() => {});

    return;
  }
}
