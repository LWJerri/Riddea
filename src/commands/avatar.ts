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

        const output = url.data;

        if (!fileTypes.includes(output.fileType))
            return await ctx
                .reply("Oops! Sometimes I can't send you an image and now it's this moment. Please, repeat your command (~‾▿‾)~")
                .catch(() => {});

        await ctx
            .replyWithPhoto(output.url, {
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
