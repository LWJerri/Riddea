import { Context } from "telegraf";
import { bot } from "../app";
import axios from "axios";
import { getRepository } from "typeorm";
import { Settings } from "../entities/Settings";
import { fileTypes } from "../constants";

export default async function avatarCMD(message: Context) {
    const output = await (
        await axios.get("https://shiro.gg/api/images/avatars")
    ).data;

    if (!fileTypes.includes(output.fileType)) return;

    await bot.telegram.sendPhoto(message.message.chat.id, output.url, {
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
    });

    await getRepository(Settings).increment({ id: 1 }, 'avatarUsed', 1);
    return;
}
