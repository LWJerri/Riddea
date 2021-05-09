import { createConnection } from "typeorm";
import { bot } from "../app";
import { Settings } from "../entities/Settings";

export default async function readyEvent() {
    console.log(` > ${bot.botInfo.username} ready!`);

    const connection = await createConnection();
    connection.getRepository(Settings).create();

    if (!(await connection.getRepository(Settings).findOne(1))) {
        const setting = new Settings();
        await connection.manager.save(setting);
    }

    await connection.close();
}
