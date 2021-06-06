import { shiroApi } from "../helpers/shiroApi";
import { Context, Markup } from "telegraf";
import { CommandInterface } from "./_interface";

export default class extends CommandInterface {
    constructor() {
        super({
            description: "Send anime picture for avatar",
            collectUsage: true,
            name: "avatar",
            action: "NEW_AVATAR",
        });
    }

    async run(ctx: Context) {
        try {
            const images = await shiroApi({ endPoint: "avatars", amount: 10 });

            await ctx.replyWithMediaGroup(
                images.map((image) => {
                    return {
                        type: "photo",
                        media: image.url,
                    };
                })
            );

            await ctx.reply(
                "Do you like to see more avatars?",
                Markup.inlineKeyboard([Markup.button.callback("Give me more!", this.action)])
            );
        } catch (e) {
            console.error(e);
        }
    }
}
