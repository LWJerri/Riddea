import { Context } from "telegraf";
import { getRepository } from "typeorm";
import { Statistic } from "../entities/Statistic";
import { Upload } from "../entities/Upload";
import humanize from "humanize-duration";
import { resolve } from "path";

const pkg = require(resolve(process.cwd(), "package.json"));

export default async function statusCMD(message: Context) {
    const uptime = humanize(Math.floor(process.uptime()) * 1000, {
        round: true,
        language: "en",
    });

    const statisticTable = await getRepository(Statistic).findOne(1);
    const uploadTable = await getRepository(Upload).find();

    await message.reply(
        `COMMANDS STATS:\n> /avatar command used ${statisticTable.avatarUsed} times.\n> /bondage command used ${statisticTable.bondageUsed} times.\n> /hentai command used ${statisticTable.hentaiUsed} times.\n> /neko command used ${statisticTable.nekoUsed} times.\n> /thighs command used ${statisticTable.thighsUsed} times.\n> /trap command used ${statisticTable.trapUsed} times.\n> /upload command used ${statisticTable.uploadUsed} times.\n> /wallpaper command used ${statisticTable.wallpaperUsed} times.`
    );
    await message.reply(
        `UPLOADS STATS:\nUploaded ${uploadTable.length} images!`
    );
    await message.reply(
        `BOT INFO:\nBot username: ${message.botInfo.username}\nBot ID: ${message.botInfo.id}\nVersion: ${pkg.version}\nUptime: ${uptime}`
    );

    return;
}
