import { Context } from "telegraf";
import { bot, fileType } from "../app";
import axios from "axios";
import { createConnection, getConnection } from "typeorm";
import { Settings } from "../entities/Settings";

export async function avatarCMD(message: Context) {
    const output = await (
        await axios.get("https://shiro.gg/api/images/avatars")
    ).data;

    if (!fileType.includes(output.fileType)) return;

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

    if (getConnection().isConnected) return;

    const connection = await createConnection();
    const dbRepo = connection.getRepository(Settings);
    const dbRepoUpdate = await dbRepo.findOne(1);
    dbRepoUpdate.avatarUsed = dbRepoUpdate.avatarUsed + 1;
    await dbRepo.save(dbRepoUpdate);
    await connection.close();

    return;
}
