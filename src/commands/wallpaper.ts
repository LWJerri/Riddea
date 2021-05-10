import { Context } from "telegraf";
import { bot } from "../app";
import axios from "axios";
import { getRepository } from "typeorm";
import { Settings } from "../entities/Settings";
import { fileTypes } from "../constants";

export default async function wallpaperCMD(message: Context) {
    const output = await (
        await axios.get("https://shiro.gg/api/images/wallpapers")
    ).data;

    if (!fileTypes.includes(output.fileType)) return;

    await bot.telegram.sendPhoto(message.message.chat.id, output.url, {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "Show new wallpaper image",
                        callback_data: "NEW_WALLPAPER",
                    },
                ],
            ],
        },
    });

    const dbRepo = getRepository(Settings);
    const dbRepoUpdate = await dbRepo.findOne(1);
    dbRepoUpdate.wallpaperUsed = dbRepoUpdate.wallpaperUsed + 1;
    await dbRepo.save(dbRepoUpdate);

    return;
}
