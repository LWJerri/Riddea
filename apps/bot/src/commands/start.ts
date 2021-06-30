import { Context } from "telegraf";
import { CommandInterface } from "./_interface";

export default class extends CommandInterface {
  constructor() {
    super({
      name: "start",
      collectUsage: true,
      description: "Display start menu",
      actions: ["LANG_RUSSIAN", "LANG_ENGLISH"],
    });
  }

  async run(ctx: Context) {
    const keyboard = {
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Help menu",
              callback_data: "SEND_HELPMENU",
            },
            {
              text: "Statistics",
              callback_data: "SEND_STATISTIC",
            },
            {
              text: "GitHub",
              url: "https://github.com/Riddea",
            },
          ],
        ],
      },
    };

    await ctx.reply(`Wuup! Hello, ${ctx.message.from.first_name} ＼(°o°)／`);

    await ctx.replyWithMarkdown(
      `This bot provides a function for view random anime images and uploads your custom images. You can use command /help to view list of all commands or use the buttons to navigate on the bot.\nDeveloped by [LWJerri](https://github.com/LWJerri)\nBig thanks to [Satont](https://github.com/Satont)\n\nNOTE: This bot have NSFW commands, check your room to stay in a safety ;)`,
      keyboard,
    );
  }
}
