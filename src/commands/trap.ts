import { Context } from "telegraf";
import axios from "axios";
import { fileTypes } from "../constants";
import { CommandInterface } from "./_interface";

export default class extends CommandInterface {
    constructor() {
        super({
            name: "trap",
            description: "Send trap image",
            collectUsage: true,
            action: "NEW_TRAP",
        });
    }

    async run(ctx: Context) {
        const url = await axios.get("https://shiro.gg/api/images/trap").catch(() => null);

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
                                text: "Show new trap image",
                                callback_data: "NEW_TRAP",
                            },
                        ],
                    ],
                },
            })
            .catch((err: any) => console.log("[ERROR]: ", err));

        return;
    }
}
