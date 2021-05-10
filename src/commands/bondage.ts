import { Context } from "telegraf";
import { bot } from "../app";
import axios from "axios";
import { getRepository } from "typeorm";
import { Settings } from "../entities/Settings";
import { fileTypes } from "../constants";

export default async function bondageCMD(message: Context) {
    const output = await (
        await axios.get("https://shiro.gg/api/images/nsfw/bondage")
    ).data;

    if (!fileTypes.includes(output.fileType)) return;

    await bot.telegram.sendPhoto(message.message.chat.id, output.url, {
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
    });

    await getRepository(Settings).increment({ id: 1 }, 'bondageUsed', 1);
    return;
}
