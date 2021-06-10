import axios from "axios";
import { bot } from "../app";

export default async function base64Data(photo: string | any) {
  const buffer = await axios.get((await bot.telegram.getFileLink(photo.file_id)).href, {
    responseType: "arraybuffer",
  });

  return `data:image/jpeg;base64,${Buffer.from(buffer.data, "binary").toString("base64")}`;
}
