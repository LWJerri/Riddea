import axios from "axios";
import { createConnection, getConnection } from "typeorm";
import { bot } from "../app";
import { Settings } from "../entities/Settings";
import { fileTypes } from "../constants";

export default async function bondageCallback(callback: any) {
    const output = await (
        await axios.get("https://shiro.gg/api/images/nsfw/bondage")
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
                            text: "Show new bondage image",
                            callback_data: "NEW_BONDAGE",
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
    dbRepoUpdate.bondageUsed = dbRepoUpdate.bondageUsed + 1;
    await dbRepo.save(dbRepoUpdate);
    await connection.close();

    return;
}
