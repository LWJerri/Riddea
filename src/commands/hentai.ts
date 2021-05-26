import { Context } from "telegraf";
import axios from "axios";
import { getRepository } from "typeorm";
import { Statistic } from "../entities/Statistic";
import { fileTypes } from "../constants";
import { CommandInterface } from "./_interface";

export default class extends CommandInterface {
    constructor() {
        super({
            name: "hentai",
            description: "[NSFW]: Send hentai image",
            collectUsage: true,
            action: "NEW_HENTAI",
        });
    }

    async run(message: Context) {
        const url = await axios
            .get("https://shiro.gg/api/images/nsfw/hentai")
            .catch(() => null);

        if (!url)
            return await message.reply("Oops! Can't get response from API :c");

        const output = url.data;

        if (!fileTypes.includes(output.fileType))
            return await message.reply(
                "Oops! Sometimes I can't send you an image and now it's this moment. Please, repeat your command (~‾▿‾)~"
            );

        await message
            .replyWithPhoto(output.url, {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "Show new hentai image",
                                callback_data: "NEW_HENTAI",
                            },
                        ],
                    ],
                },
            })
            .catch(() => {});
    }
}
