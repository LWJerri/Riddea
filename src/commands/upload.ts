import { Context } from "telegraf";
import { getConnection } from "typeorm";
import { Upload } from "../entities/Upload";
import { connection } from "../app";

export async function uploadCMD(message: Context) {
    await message.reply("Oops! Sorry, this command currently not available!");

    return;
    /*if (getConnection().isConnected) return;

    const user = (await connection()).manager.getRepository(Upload);

    if (!(await user.find({ userID: message.from.id })).length) {
        const upload = new Upload();
        upload.userID = message.from.id;
        upload.storage = [];
        await (await connection()).manager.save(upload);
        await (await connection()).close();
    }*/
}
