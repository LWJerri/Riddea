import { Context } from "telegraf";
import axios from "axios";
import { fileTypes } from "../constants";
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
        const url = await axios.get("https://shiro.gg/api/images/avatars").catch(() => null);

        if (!url) return await ctx.reply("Oops! Can't get response from API :c").catch(() => {});
        const output = fileTypes.includes(url.data.fileType) ? url.data.url : url.data.url.replace(url.data.fileType, "png");

        await ctx
            .replyWithPhoto(output, {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "Show new avatar image",
                                callback_data: "NEW_AVATAR",
                            },
                        ],
                    ],
                },
            })
            .catch(() => {});

        return;
    }
}
