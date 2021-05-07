import { Context } from "telegraf";

export async function startCMD(message: Context) {
    await message.replyWithMarkdown(
        `Wuup! Hello, ${message.message.from.first_name} ＼(°o°)／`
    );
    await message.replyWithMarkdown(
        `This bot provides a function for view random anime images and uploads your custom images. You can use command /help to view list of all commands or use the buttons to navigate on the bot.\nDeveloped by: @LWJerri\n\nNOTE: This bot have NSFW commands, check your room to stay in a safety ;)`,
        {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "Help menu",
                            callback_data: "SEND_HELPMENU",
                        },
                        {
                            text: "Statistics",
                            callback_data: "SEND_STATISTIC",
                        },
                        {
                            text: "GitHub",
                            url: "https://github.com/LWJerri/Riddea",
                        },
                    ],
                ],
            },
        }
    );
}
