import { Context } from "telegraf";
import { getRepository } from "typeorm";
import { Settings } from "../entities/Settings";
import { Upload } from "../entities/Upload";
import humanize from "humanize-duration";
import { version } from "../../package.json";

export default async function statusCMD(message: Context) {
    const uptime = humanize(Date.now() - Math.floor(process.uptime()) * 1000, {
        round: true,
        language: "en",
    });

    const settingTable = await getRepository(Settings).findOne(1);
    const uploadTable = await getRepository(Upload).find();

    await message.reply(
        `COMMANDS STATS:\n> /avatar command used ${settingTable.avatarUsed} times.\n> /bondage command used ${settingTable.bondageUsed} times.\n> /hentai command used ${settingTable.hentaiUsed} times.\n> /neko command used ${settingTable.nekoUsed} times.\n> /thighs command used ${settingTable.thighsUsed} times.\n> /trap command used ${settingTable.trapUsed} times.\n> /upload command used ${settingTable.uploadUsed} times.\n> /wallpaper command used ${settingTable.wallpaperUsed} times.`
    );
    await message.reply(
        `UPLOADS STATS:\nUploaded ${uploadTable.length} images!`
    );
    await message.reply(
        `BOT INFO:\nBot username: ${message.botInfo.username}\nBot ID: ${message.botInfo.id}\nVersion: ${version}\nUptime: ${uptime}`
    );

    return;
}
