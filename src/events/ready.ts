import { bot, connection } from "../app";
import { Settings } from "../entities/Settings";

export async function readyEvent() {
    console.log(` > ${bot.botInfo.username} ready!`);

    (await connection()).getRepository(Settings).create();

    if (!(await (await connection()).getRepository(Settings).findOne(1))) {
        const setting = new Settings();
        await (await connection()).manager.save(setting);
    }

    await (await connection()).close();
}
