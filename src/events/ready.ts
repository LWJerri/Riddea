import { getRepository } from "typeorm";
import { bot } from "../app";
import { Settings } from "../entities/Settings";

export default async function readyEvent() {
    console.log(` > ${bot.botInfo.username} ready!`);

    const repository = getRepository(Settings);

    if (!(await repository.findOne(1))) {
        const setting = new Settings();
        await repository.save(setting);
    }
}
