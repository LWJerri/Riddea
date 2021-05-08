import { Context } from "telegraf";
import { bot, connection, fileType } from "../app";
import axios from "axios";
import { getConnection } from "typeorm";
import { Settings } from "../entities/Settings";

export async function thighsCMD(message: Context) {
    const output = await (
        await axios.get("https://shiro.gg/api/images/nsfw/thighs")
    ).data;

    if (!fileType.includes(output.fileType)) return;

    await bot.telegram.sendPhoto(message.message.chat.id, output.url, {
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

    if (getConnection().isConnected) return;

    const dbRepo = (await connection()).getRepository(Settings);
    const dbRepoUpdate = await dbRepo.findOne(1);
    dbRepoUpdate.thighsUsed = dbRepoUpdate.thighsUsed + 1;
    await dbRepo.save(dbRepoUpdate);
    await (await connection()).close();

    return;
}
