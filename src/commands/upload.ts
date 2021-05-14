import { Context } from "telegraf";

export const description = "Upload you image to bot database";

export default async function uploadCMD(message: Context) {
    await message.reply("Oops! Sorry, this command currently not available!");

    return;
}
