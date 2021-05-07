import { Context } from "telegraf";

export async function helpCMD(message: Context) {
    const cmdList = [
        { name: "/help", desc: "Display this help menu" },
        { name: "/avatar", desc: "Send anime picture for avatar" },
        { name: "/neko", desc: "Send neko anime image" },
        { name: "/trap", desc: "Send trap image" },
        { name: "/wallpaper", desc: "Send wallpaper image" },
        { name: "/hentai", desc: "[NSFW] Send hentai image" },
        { name: "/thighs", desc: "[NSFW] Send thighs image" },
        { name: "/bondage", desc: "[NSFW] Send bondage image" },
        { name: "/upload", desc: "Upload your image to database" },
        { name: "/status", desc: "Show bot statistic" },
        { name: "/start", desc: "Send start menu" },
    ];
    await message.reply(
        `Yo, bro! This is a help menu. Here you can find a list of all commands and a description of how to use this command.`
    );

    cmdList.forEach(async (data) => {
        await message.reply(`> ${data.name}: ${data.desc}`);
    });

    return;
}
