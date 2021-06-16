import axios from "axios";
import { bot } from "../app";
import { botLogger } from "./logger";

export default async function base64Data(photo: string | any) {
  try {
    const buffer = await axios.get((await bot.telegram.getFileLink(photo.file_id)).href, {
      responseType: "arraybuffer",
    });

    return `data:image/jpeg;base64,${Buffer.from(buffer.data, "binary").toString("base64")}`;
  } catch (err) {
    botLogger.error(`base64Decoder error:`, err.stack);
  }
}
