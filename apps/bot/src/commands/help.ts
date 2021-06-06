import { Context } from "telegraf";
import { CommandInterface } from "./_interface";

export default class extends CommandInterface {
  constructor() {
    super({
      description: "Display bot help menu",
      collectUsage: false,
      name: "help",
      action: "SEND_HELPMENU",
    });
  }

  async run(ctx: Context) {
    await ctx
      .reply(`Yo! Type / for view list of all bot commands.`, {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Sponsors", callback_data: "SEND_SPONSORS" }],
            [
              {
                text: "GitHub",
                url: "https://github.com/LWJerri/Riddea",
              },
              {
                text: "Support me",
                url: "https://www.donationalerts.com/r/lwjerri",
              },
            ],
          ],
        },
      })
      .catch(() => {});

    return;
  }
}
