import { Context } from "telegraf";
import axios from "axios";
import { getRepository } from "typeorm";
import { Statistic } from "../entities/Statistic";
import { fileTypes } from "../constants";

export const description = "[NSFW]: Send thighs image";

export default async function thighsCMD(message: Context) {
    const url = await axios
        .get("https://shiro.gg/api/images/nsfw/thighs")
        .catch(() => null);

    if (!url)
        return await message.reply("Oops! Can't get response from API :c");

    const output = url.data;

    if (!fileTypes.includes(output.fileType))
        return await message.reply(
            "Oops! Sometimes I can't send you an image and now it's this moment. Please, repeat your command (~‾▿‾)~"
        );

    await message.replyWithPhoto(output.url, {
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
    });

    await getRepository(Statistic).increment({ id: 1 }, "thighsUsed", 1);
    return;
}
