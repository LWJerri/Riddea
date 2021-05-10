import axios from "axios";
import { createConnection, getConnection } from "typeorm";
import { bot } from "../app";
import { fileTypes } from "../constants";
import { Settings } from "../entities/Settings";

export default async function avatarCallback(callback: any) {
    const output = await (
        await axios.get("https://shiro.gg/api/images/avatars")
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
                            text: "Show new avatar image",
                            callback_data: "NEW_AVATAR",
                        },
                    ],
                ],
            },
        }
    );

    if (getConnection().isConnected) return;

    const connection = await createConnection();
    const dbRepo = connection.getRepository(Settings);
    const dbRepoUpdate = await dbRepo.findOne(1);
    dbRepoUpdate.avatarUsed = dbRepoUpdate.avatarUsed + 1;
    await dbRepo.save(dbRepoUpdate);
    await connection.close();

    return;
}
