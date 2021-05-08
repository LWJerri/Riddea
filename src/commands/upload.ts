import { createConnection } from "typeorm";
import { Context } from "telegraf";
import { getConnection } from "typeorm";
import { Upload } from "../entities/Upload";

export async function uploadCMD(message: Context) {
    await message.reply("Oops! Sorry, this command currently not available!");

    return;
    /*if (getConnection().isConnected) return;

    const connection = await createConnection();
    const user = connection.manager.getRepository(Upload);

    if (!(await user.find({ userID: message.from.id })).length) {
        const upload = new Upload();
        upload.userID = message.from.id;
        upload.storage = [];
        await connection.manager.save(upload);
        await connection.close();
    }*/
}
