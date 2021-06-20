import { Context, Markup, Scenes } from "telegraf";
import base64Data from "../helpers/base64Decoder";
import { botLogger } from "../helpers/logger";
import { prisma } from "../libs/prisma";

async function getKeyboard(ctx: Context) {
  try {
    const collections = await prisma.collection.findMany({
      where: {
        userID: ctx.from.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const collectionsList = collections.map((c) =>
      Markup.button.callback(`${c.isPublic ? "🔓" : "🔒"} ${c.name}`, `IMAGE_ADD_COLLECTION_${c.id}`),
    );
    collectionsList.push({ text: "SKIP", callback_data: "IMAGE_ADD_COLLECTION_SKIP", hide: false });

    const keyboard = Markup.inlineKeyboard(collectionsList, { columns: 1 });

    return keyboard;
  } catch (err) {
    botLogger.error(`Scene upload error:`, err.stack);
  }
}

export const uploadScene = new Scenes.BaseScene<Scenes.SceneContext>("upload")
  .enter((ctx) => {
    try {
      ctx.reply(`Nya, send me your image!`);
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

      const photo = (ctx.update.callback_query.message as any).photo.pop();
      const dataDB = await base64Data(photo);
      const id = Number(ctx.match.input.replace("IMAGE_ADD_COLLECTION_", ""));
      const collectionName = (await prisma.collection.findFirst({ where: { id } })).name;

      await prisma.upload.create({
        data: {
          userID: ctx.from.id,
          fileID: photo.file_id,
          data: dataDB,
          collectionId: id,
        },
      });

      await ctx.reply(
        `Your image loaded to database in ${collectionName} collection! Type /cancel if you don't want upload pictures anymore.`,
      );
      await ctx.deleteMessage(ctx.message);
    } catch (err) {
      botLogger.error(`Scene upload error:`, err.stack);
    }
  })
  .action("IMAGE_ADD_COLLECTION_SKIP", async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const photo = (ctx.update.callback_query.message as any).photo.pop();
      const dataDB = await base64Data(photo);

      await prisma.upload.create({
        data: {
          userID: ctx.from.id,
          fileID: photo.file_id,
          data: dataDB,
        },
      });

      await ctx.reply(`Your image loaded to database but not added to collection! Type /cancel if you don't want upload pictures anymore.`);
      await ctx.deleteMessage(ctx.message);
    } catch (err) {
      botLogger.error(`Scene upload error:`, err.stack);
    }
  })
  .command("cancel", async (ctx) => {
    try {
      await ctx.scene.leave();
      await ctx.reply("You leave from upload image section!");
    } catch (err) {
      botLogger.error(`Scene upload error:`, err.stack);
    }
  })
  .on("message", async (ctx) => {
    try {
      await ctx.reply(`If you don't want upload image, type /cancel!`);
    } catch (err) {
      botLogger.error(`Scene upload error:`, err.stack);
    }
  });
