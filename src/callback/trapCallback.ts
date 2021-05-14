import axios from "axios";
import { getRepository } from "typeorm";
import { bot } from "../app";
import { Statistic } from "../entities/Statistic";
import { fileTypes } from "../constants";

export default async function trapCallback(callback: any) {
    const url = await axios
        .get("https://shiro.gg/api/images/trap")
        .catch(() => null);

    if (!url)
        return await bot.telegram.sendMessage(
            callback.update.callback_query.message.chat.id,
            "Oops! Can't get response from API :c"
        );

    const output = url.data;

    if (!fileTypes.includes(output.fileType))
        return await bot.telegram.sendMessage(
            callback.update.callback_query.message.chat.id,
            "Oops! Sometimes I can't send you an image and now it's this moment. Please, repeat your command (~‾▿‾)~"
        );

    await bot.telegram.sendPhoto(
        callback.update.callback_query.message.chat.id,
        output,
        {
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
        }
    );

    await bot.telegram
        .answerCbQuery(callback.update.callback_query.id)
        .catch(null);

    await getRepository(Statistic).increment({ id: 1 }, "trapUsed", 1);
    return;
}
