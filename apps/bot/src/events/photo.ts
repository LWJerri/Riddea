import { Context } from "telegraf";
import { getRepository } from "typeorm";
import { Upload } from "@riddea/typeorm";

export default async function photoEvent(ctx: Context) {
    await getRepository(Upload).save({
        userID: ctx.from.id,
        fileID: (ctx.message as any).photo.pop().file_id,
    });

    await ctx.reply(`Yay, your image loaded to bot database!`).catch(() => {});
    return;
}
