import { Context } from "telegraf";
import { bot, connection, fileType } from "../app";
import axios from "axios";
import { getConnection } from "typeorm";
import { Settings } from "../entities/Settings";

export async function bondageCMD(message: Context) {
    const output = await (
        await axios.get("https://shiro.gg/api/images/nsfw/bondage")
    ).data;

    if (!fileType.includes(output.fileType)) return;

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

    if (getConnection().isConnected) return;

    const dbRepo = (await connection()).getRepository(Settings);
    const dbRepoUpdate = await dbRepo.findOne(1);
    dbRepoUpdate.bondageUsed = dbRepoUpdate.bondageUsed + 1;
    await dbRepo.save(dbRepoUpdate);
    await (await connection()).close();

    return;
}
