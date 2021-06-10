import { getRepository } from "typeorm";
import { Upload } from "@riddea/typeorm";
import base64Data from "../helpers/base64Decoder";

export default async function photoEvent(ctx: any) {
  const photo = ctx.message.photo.pop();
  const dataDB = await base64Data(photo);

  await getRepository(Upload).save({
    userID: ctx.from.id,
    fileID: (ctx.message as any).photo.pop().file_id,
    data: dataDB,
  });

  await ctx.reply(`Yay, your image loaded to bot database!`).catch(() => {});
  return;
}
