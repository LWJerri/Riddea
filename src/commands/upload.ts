import { getRepository } from "typeorm";
import { Statistic } from "../entities/Statistic";

export const description = "Upload your picture to database";

export default async function uploadCMD(message: any) {
    await message.scene.enter("upload");

    await getRepository(Statistic).increment({ id: 1 }, "uploadUsed", 1);
    return;
}
