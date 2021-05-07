import axios from "axios";
import { bot, fileType } from "../app";

export async function hentaiCallback(callback: any) {
    const output = await (
        await axios.get("https://shiro.gg/api/images/nsfw/hentai")
    ).data;

    if (!fileType.includes(output.fileType)) return;

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
}
