import { Context, Scenes } from "telegraf";
import { getRepository } from "typeorm";
import { Upload } from "@riddea/typeorm";
import axios from "axios";

export default async function photoEvent(ctx: any) {
  const photo = ctx.message.photo.pop()
  const photoRequest = await axios.get((await ctx.telegram.getFileLink(photo.file_id)).href, {
    responseType: 'arraybuffer'
  })

  await getRepository(Upload).save({
    userID: ctx.from.id,
    fileID: (ctx.message as any).photo.pop().file_id,
    data: `data:image/jpeg;base64,${Buffer.from(photoRequest.data, 'binary').toString('base64')}`,
  });

  await ctx.reply(`Yay, your image loaded to bot database!`).catch(() => {});
  return;
}
