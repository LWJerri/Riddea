import { Context, Markup, Scenes } from "telegraf";
import { getRepository } from "typeorm";
import { Collection, Upload } from "@riddea/typeorm";
import base64Data from "../helpers/base64Decoder";

async function getKeyboard(ctx: Context) {
  const collections = await getRepository(Collection).find({
    where: { userID: ctx.from.id },
    order: { createdAt: "ASC" },
  });

  const collectionsList = collections.map((c) =>
    Markup.button.callback(`${c.isPublic ? "🔓" : "🔒"} ${c.name}`, `IMAGE_ADD_COLLECTION_${c.id}`),
  );
  collectionsList.push({ text: "SKIP", callback_data: "IMAGE_ADD_COLLECTION_SKIP", hide: false });

  const keyboard = Markup.inlineKeyboard(collectionsList, { columns: 1 });

  return keyboard;
}

export const uploadScene = new Scenes.BaseScene<Scenes.SceneContext>("upload")
  .enter((ctx) => {
    ctx.reply(`Boop-beep, send me your image!`).catch(() => {});
  })
  .on("photo", async (ctx) => {
    await ctx.replyWithPhoto(ctx.message.photo.pop().file_id, await getKeyboard(ctx));
  })
  .action(/IMAGE_ADD_COLLECTION_\d+/, async (ctx) => {
    await ctx.answerCbQuery();

    const photo = (ctx.update.callback_query.message as any).photo.pop();
    const dataDB = await base64Data(photo);
    const id = Number(ctx.match.input.replace("IMAGE_ADD_COLLECTION_", ""));
    const collectionName = (await getRepository(Collection).findOne({ id: id })).name;

    await getRepository(Upload).save({
      userID: ctx.from.id,
      fileID: photo.file_id,
      data: dataDB,
      collection: { id },
    });

    await ctx
      .reply(`Your image loaded to database in ${collectionName} collection! Type /cancel if you don't want upload pictures anymore.`)
      .catch(() => {});
    await ctx.deleteMessage(ctx.message).catch(() => {});
  })
  .action("IMAGE_ADD_COLLECTION_SKIP", async (ctx) => {
    await ctx.answerCbQuery();

    const photo = (ctx.update.callback_query.message as any).photo.pop();
    const dataDB = await base64Data(photo);

    await getRepository(Upload).save({
      userID: ctx.from.id,
      fileID: photo.file_id,
      data: dataDB,
    });

    await ctx
      .reply(`Your image loaded to database but not added to collection! Type /cancel if you don't want upload pictures anymore.`)
      .catch(() => {});
    await ctx.deleteMessage(ctx.message).catch(() => {});
  })
  .command("cancel", async (ctx) => {
    await ctx.scene.leave().catch(() => {});
    await ctx.reply("You leave from upload image section!").catch(() => {});
  })
  .on("message", async (ctx) => {
    await ctx.reply(`If you don't want upload image, type /cancel!`).catch(() => {});
  });
