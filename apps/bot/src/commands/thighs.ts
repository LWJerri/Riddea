import { Context } from "telegraf";
import axios from "axios";
import { fileTypes } from "../constants";
import { CommandInterface } from "./_interface";

export default class extends CommandInterface {
    constructor() {
        super({
            name: "thighs",
            description: "[NSFW]: Send thighs image",
            collectUsage: true,
            action: "NEW_THIGHS",
        });
    }

    async run(ctx: Context) {
        const url = await axios.get("https://shiro.gg/api/images/nsfw/thighs").catch(() => null);

        if (!url) return await ctx.reply("Oops! Can't get response from API :c").catch(() => {});
        const output = fileTypes.includes(url.data.fileType) ? url.data.url : url.data.url.replace(url.data.fileType, "png");

        await ctx
            .replyWithPhoto(output, {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "Show new thighs image",
                                callback_data: "NEW_THIGHS",
                            },
                        ],
                    ],
                },
            })
            .catch(() => {});

        return;
    }
}
