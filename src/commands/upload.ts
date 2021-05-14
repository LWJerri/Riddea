import { Context } from "telegraf";

export default async function uploadCMD(message: Context) {
    await message.reply("Oops! Sorry, this command currently not available!");

    return;
}
