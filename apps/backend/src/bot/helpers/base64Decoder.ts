import axios from "axios";
import { bot } from "..";
import { botLogger } from "./logger";
import { File } from "typegram";

export default async function base64Data(photo: File | { file_id: string }) {
  try {
    const buffer = await axios.get((await bot.telegram.getFileLink(photo.file_id)).href, {
      responseType: "arraybuffer",
    });

    return Buffer.from(buffer.data, "binary").toString("base64");
  } catch (err) {
    botLogger.error(`base64Decoder error:`, err.stack);
  }
}
