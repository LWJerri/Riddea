import { getRepository } from "typeorm";
import { bot } from "../app";
import { Statistic } from "../entities/Statistic";
import { commands } from "../helpers/loadCommands";

export default async function readyEvent() {
    console.log(` > ${bot.botInfo.username} ready!`);

    const repository = getRepository(Statistic);

    if (!(await repository.findOne(1))) {
        const statistic = new Statistic();
        await repository.save(statistic);
    }

    await bot.telegram
        .setMyCommands(commands)
        .catch((err) => console.log("[!]: Can't set bot commands!", err));
}
