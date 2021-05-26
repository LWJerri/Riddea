import { Context } from "telegraf";
import axios from "axios";
import { fileTypes } from "../constants";
import { CommandInterface } from "./_interface";

export default class extends CommandInterface {
    constructor() {
        super({
            description: "[NSFW]: Send bondage image",
            collectUsage: true,
            name: "bondage",
            action: "NEW_BONDAGE",
        });
    }

    async run(ctx: Context) {
        const url = await axios.get("https://shiro.gg/api/images/nsfw/bondage").catch(() => null);

        if (!url) return await ctx.reply("Oops! Can't get response from API :c").catch((err: any) => console.log("[ERROR]: ", err));

        const output = url.data;

        if (!fileTypes.includes(output.fileType))
            return await ctx
                .reply("Oops! Sometimes I can't send you an image and now it's this moment. Please, repeat your command (~‾▿‾)~")
                .catch((err: any) => console.log("[ERROR]: ", err));

        await ctx
            .replyWithPhoto(output.url, {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "Show new bondage image",
                                callback_data: "NEW_BONDAGE",
                            },
                        ],
                    ],
                },
            })
            .catch((err: any) => console.log("[ERROR]: ", err));
    }
}
