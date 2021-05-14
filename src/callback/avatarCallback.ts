import axios from "axios";
import { getRepository } from "typeorm";
import { bot } from "../app";
import { fileTypes } from "../constants";
import { Statistic } from "../entities/Statistic";

export default async function avatarCallback(callback: any) {
    const url = await axios
        .get("https://shiro.gg/api/images/avatars")
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

    await bot.telegram
        .sendPhoto(callback.update.callback_query.message.chat.id, output, {
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
        })
        .catch(() => {});

    await bot.telegram
        .answerCbQuery(callback.update.callback_query.id)
        .catch(null);

    await getRepository(Statistic).increment({ id: 1 }, "avatarUsed", 1);
    return;
}
