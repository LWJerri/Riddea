import crypto from "crypto";

import { Context, Markup, Scenes } from "telegraf";
import { File, Message } from "typegram";
import { getRepository } from "typeorm";

import { Collection, Upload, User } from "../../entities";
import base64Data from "../helpers/base64Decoder";
import { botLogger } from "../helpers/logger";
import { uploadFile } from "../libs/s3";

async function getKeyboard(ctx: Context) {
  try {
    const collections = await getRepository(Collection).find({
      where: { userID: ctx.from.id },
      order: { createdAt: "DESC" },
    });

    const collectionsList = collections.map((c) =>
      Markup.button.callback(`${c.isPublic ? "🔓" : "🔒"} ${c.name}`, `IMAGE_ADD_COLLECTION_${c.id}`),
    );
    collectionsList.push({
      text: ctx.i18n.translate("bot.buttons.skip"),
      callback_data: "IMAGE_ADD_COLLECTION_SKIP",
      hide: false,
    });
    collectionsList.push({
      text: ctx.i18n.translate("bot.buttons.cancel"),
      callback_data: "IMAGE_ADD_COLLECTION_CANCEL",
      hide: false,
    });

    const keyboard = Markup.inlineKeyboard(collectionsList, { columns: 1 });

    return keyboard;
  } catch (err) {
    botLogger.error(`Scene upload error:`, err.stack);
  }
}

export const uploadScene = new Scenes.BaseScene<Scenes.SceneContext>("upload")
  .enter(async (ctx) => {
    try {
      const isBlocked = (await getRepository(User).findOne({ userID: ctx.from.id }))?.uploadBan;

      if (isBlocked) {
        await ctx.reply(ctx.i18n.translate("bot.main.scene.upload.blocked"));

        return await ctx.scene.leave();
      }

      ctx.reply(ctx.i18n.translate("bot.main.upload.send"));
    } catch (err) {
      botLogger.error(`Scene upload error:`, err.stack);
    }
  })
  .on("photo", async (ctx) => {
    try {
      await ctx.replyWithPhoto(ctx.message.photo.pop().file_id, await getKeyboard(ctx));
    } catch (err) {
      botLogger.error(`Scene upload error:`, err.stack);
    }
  })
  .action(/IMAGE_ADD_COLLECTION_\d+/, async (ctx) => {
    try {
      await ctx.answerCbQuery();
      const message = ctx.update.callback_query.message as Message & { photo: File[] };
      const photo = message.photo.pop() as File;
      const id = Number(ctx.match.input.replace("IMAGE_ADD_COLLECTION_", ""));
      const collectionName = (await getRepository(Collection).findOne({ id })).name;

      const image = await saveAndUploadPhoto({ collectionId: id, photo, userID: ctx.from.id });

      await ctx.reply(ctx.i18n.translate("bot.main.upload.hasCollection", { name: collectionName, id: image.id }));
      await ctx.deleteMessage(ctx.message);
    } catch (err) {
      botLogger.error(`Scene upload error:`, err.stack);
    }
  })
  .action("IMAGE_ADD_COLLECTION_SKIP", async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const message = ctx.update.callback_query.message as Message & { photo: File[] };
      const photo = message.photo.pop() as File;

      const collectionsRepository = getRepository(Collection);
      const data = { userID: ctx.from.id, name: "IWC" };
      const collection = (await collectionsRepository.findOne(data)) || (await collectionsRepository.save(data));

      const image = await saveAndUploadPhoto({ photo, userID: ctx.from.id, collectionId: collection.id });

      await ctx.reply(ctx.i18n.translate("bot.main.upload.noCollection", { id: image.id }));
      await ctx.deleteMessage(ctx.message);
    } catch (err) {
      botLogger.error(`Scene upload error:`, err.stack);
    }
  })
  .action("IMAGE_ADD_COLLECTION_CANCEL", async (ctx) => {
    try {
      await ctx.answerCbQuery();
      await ctx.deleteMessage(ctx.message);
    } catch (err) {
      console.error(`Scene upload error:`, err);
    }
  })
  .command("cancel", async (ctx) => {
    try {
      await ctx.scene.leave();
      await ctx.reply(ctx.i18n.translate("bot.main.scene.leave.image"));
    } catch (err) {
      botLogger.error(`Scene upload error:`, err.stack);
    }
  })
  .on("text", async (ctx) => {
    try {
      await ctx.reply(ctx.i18n.translate("bot.main.upload.noImage"));
    } catch (err) {
      botLogger.error(`Scene upload error:`, err.stack);
    }
  });

const saveAndUploadPhoto = async ({
  collectionId,
  userID,
  photo,
}: {
  collectionId?: number;
  userID: number;
  photo: File;
}) => {
  const base64 = await base64Data(photo);
  const fileName = crypto.randomUUID();

  await uploadFile({ buffer: base64, filePath: `${userID}/${fileName}` });

  return await getRepository(Upload).save({
    userID,
    fileID: photo.file_id,
    fileName,
    collection: collectionId ? { id: collectionId } : undefined,
  });
};
