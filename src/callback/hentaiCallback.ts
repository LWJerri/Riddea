import axios from "axios";
import { getRepository } from "typeorm";
import { bot } from "../app";
import { Settings } from "../entities/Settings";
import { fileTypes } from "../constants";

export default async function hentaiCallback(callback: any) {
    const output = await (
        await axios.get("https://shiro.gg/api/images/nsfw/hentai")
    ).data;

    if (!fileTypes.includes(output.fileType)) return;

    await bot.telegram.sendPhoto(
        callback.update.callback_query.message.chat.id,
        output,
        {
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
        }
    );

    await getRepository(Settings).increment({ id: 1 }, 'hentaiUsed', 1);
    return;
}
