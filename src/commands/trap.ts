import { Context } from "telegraf";
import { bot } from "../app";
import axios from "axios";
import { createConnection, getConnection, getRepository } from "typeorm";
import { Settings } from "../entities/Settings";
import { fileTypes } from "../constants";

export default async function trapCMD(message: Context) {
    const output = await (
        await axios.get("https://shiro.gg/api/images/trap")
    ).data;

    if (!fileTypes.includes(output.fileType)) return;

    await bot.telegram.sendPhoto(message.message.chat.id, output.url, {
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
    });

    await getRepository(Settings).increment({ id: 1 }, "trapUsed", 1);
    return;
}
