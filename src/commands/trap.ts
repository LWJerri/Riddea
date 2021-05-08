import { Context } from "telegraf";
import { bot, connection, fileType } from "../app";
import axios from "axios";
import { getConnection } from "typeorm";
import { Settings } from "../entities/Settings";

export async function trapCMD(message: Context) {
    const output = await (await axios.get("https://shiro.gg/api/images/trap"))
        .data;

    if (!fileType.includes(output.fileType)) return;

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

    if (getConnection().isConnected) return;

    const dbRepo = (await connection()).getRepository(Settings);
    const dbRepoUpdate = await dbRepo.findOne(1);
    dbRepoUpdate.trapUsed = dbRepoUpdate.trapUsed + 1;
    await dbRepo.save(dbRepoUpdate);
    await (await connection()).close();

    return;
}
