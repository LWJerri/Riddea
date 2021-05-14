import { Context } from "telegraf";

export const description = "Display bot help menu";

export default async function helpCMD(message: Context) {
    await message
        .reply(`Yo! Type \`/\` for view list of all bot commands.`, {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "GitHub",
                            url: "https://github.com/LWJerri/Riddea",
                        },
                        {
                            text: "Support me",
                            url: "https://www.donationalerts.com/r/lwjerri",
                        },
                    ],
                ],
            },
        })
        .catch(() => {});

    return;
}
