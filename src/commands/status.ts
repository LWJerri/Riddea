import { Context } from "telegraf";
import { createConnection, getConnection } from "typeorm";
import { startData } from "../app";
import { Settings } from "../entities/Settings";
import { Upload } from "../entities/Upload";
import humanize from "humanize-duration";

export async function statusCMD(message: Context) {
    if (getConnection().isConnected) return;

    const uptime = humanize(Date.now() - startData, {
        round: true,
        language: "en",
    });
    const connection = await createConnection();
    const settingTable = await connection.getRepository(Settings).findOne(1);
    const uploadTable = await connection.getRepository(Upload).find();
    await connection.close();

    await message.reply(
        `COMMANDS STATS:\n> /avatar command used ${settingTable.avatarUsed} times.\n> /bondage command used ${settingTable.bondageUsed} times.\n> /hentai command used ${settingTable.hentaiUsed} times.\n> /neko command used ${settingTable.nekoUsed} times.\n> /thighs command used ${settingTable.thighsUsed} times.\n> /trap command used ${settingTable.trapUsed} times.\n> /upload command used ${settingTable.uploadUsed} times.\n> /wallpaper command used ${settingTable.wallpaperUsed} times.`
    );
    await message.reply(
        `UPLOADS STATS:\nUploaded ${uploadTable.length} images!`
    );
    await message.reply(
        `BOT INFO:\nBot username: ${message.botInfo.username}\nBot ID: ${message.botInfo.id}\nUptime: ${uptime}`
    );

    return;
}
