import { Context } from "telegraf";
import { getRepository } from "typeorm";
import { Statistic } from "../entities/Statistic";
import { Upload } from "../entities/Upload";
import humanize from "humanize-duration";
import { resolve } from "path";

const pkg = require(resolve(process.cwd(), "package.json"));

export const description = "Send bot statistic";

export default async function statusCMD(message: Context) {
    const uptime = humanize(Math.floor(process.uptime()) * 1000, {
        round: true,
        language: "en",
    });

    const statisticRepository = getRepository(Statistic);
    const uploadTable = await getRepository(Upload).find();

    const commands = [
        "neko",
        "hentai",
        "avatar",
        "bondage",
        "thighs",
        "wallpaper",
        "trap",
        "uploaded",
    ];
    const stats = await Promise.all(
        commands.map((c) =>
            statisticRepository.count({
                where: {
                    name: c,
                },
            })
        )
    );
    const commandsStats: Array<[string, number]> = commands.reduce(
        (prev, current, index) => {
            return [...prev, [[current], stats[index]]];
        },
        []
    );

    const msg = `COMMANDS STATS:\n ${commandsStats
        .map((command) => `> /${command[0]} used ${command[1]}`)
        .join("\n")}`;

    await message.reply(msg).catch(() => {});

    await message
        .reply(`UPLOADS STATS:\nUploaded ${uploadTable.length} images!`)
        .catch(() => {});

    await message
        .reply(
            `BOT INFO:\nBot username: ${message.botInfo.username}\nBot ID: ${message.botInfo.id}\nVersion: ${pkg.version}\nUptime: ${uptime}`
        )
        .catch(() => {});

    return;
}
