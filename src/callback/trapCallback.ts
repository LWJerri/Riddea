import axios from "axios";
import { createConnection, getConnection } from "typeorm";
import { bot, fileType } from "../app";
import { Settings } from "../entities/Settings";

export default async function trapCallback(callback: any) {
    const output = await (await axios.get("https://shiro.gg/api/images/trap"))
        .data;

    if (!fileType.includes(output.fileType)) return;

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

    if (getConnection().isConnected) return;

    const connection = await createConnection();
    const dbRepo = connection.getRepository(Settings);
    const dbRepoUpdate = await dbRepo.findOne(1);
    dbRepoUpdate.trapUsed = dbRepoUpdate.trapUsed + 1;
    await dbRepo.save(dbRepoUpdate);
    await connection.close();

    return;
}
