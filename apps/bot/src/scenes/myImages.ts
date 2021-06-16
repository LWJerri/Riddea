import { Markup, Scenes } from "telegraf";
import { getRepository, Not } from "typeorm";
import { Collection } from "@riddea/typeorm";
import { Upload } from "@riddea/typeorm";
import { botLogger } from "../helpers/logger";

interface ImageScene extends Scenes.SceneSessionData {
  skip: number;
  currentImage: Upload;
  totalImages: number;
}

const getKeyboard = (ctx: Scenes.SceneContext<ImageScene>) => {
  return Markup.inlineKeyboard([
    [
      ctx.scene.session.skip > 0 ? { text: "Previous picture", callback_data: "BACK" } : undefined,
      ctx.scene.session.skip + 1 !== ctx.scene.session.totalImages ? { text: "Next picture", callback_data: "NEXT" } : undefined,
    ].filter(Boolean),
    [
      { text: "Choose Collection", callback_data: `CHOOSE_COLLECTION` },
      { text: "Delete", callback_data: "DELETE_IMAGE" },
    ],
    [{ text: "Stop", callback_data: "LEAVE" }],
  ]);
};

const getImage = async (userID: number, skip: number) => {
  try {
    return (
      await getRepository(Upload).find({
        where: {
          userID,
        },
        skip,
        take: 1,
        relations: ["collection"],
        order: {
          createdAt: "DESC",
        },
      })
    )[0];
  } catch (err) {
    botLogger.error(`Scene myImages error:`, err.stack);
  }
};

export const myImages = new Scenes.BaseScene<Scenes.SceneContext<ImageScene>>("myImages")
  .action("BACK_TO_GALLERY", async (ctx) => {
    try {
      await ctx.answerCbQuery();
      await ctx.editMessageReplyMarkup({ inline_keyboard: getKeyboard(ctx).reply_markup.inline_keyboard });
    } catch (err) {
      botLogger.error(`Scene myImages error:`, err.stack);
    }
  })
  .enter(async (ctx) => {
    try {
      ctx.scene.session.skip = 0;
      ctx.scene.session.totalImages = await getRepository(Upload).count({ userID: ctx.from.id });
      ctx.scene.session.currentImage = await getImage(ctx.from.id, ctx.scene.session.skip);
      if (!ctx.scene.session.currentImage) {
        await ctx.reply(`You never upload here your images! Use /upload for uploading your favorite image :)`);
        await ctx.scene.leave();

        return;
      }

      await ctx.replyWithPhoto(ctx.scene.session.currentImage.fileID, getKeyboard(ctx));
    } catch (err) {
      botLogger.error(`Scene myImages error:`, err.stack);
    }
  })
  .action("BACK", async (ctx) => {
    try {
      await ctx.answerCbQuery();
      if (ctx.scene.session.skip > 0) {
        ctx.scene.session.skip--;
      } else {
        return;
      }

      ctx.scene.session.currentImage = await getImage(ctx.from.id, ctx.scene.session.skip);

      if (!ctx.scene.session.currentImage) return;

      await ctx.editMessageMedia(
        {
          media: ctx.scene.session.currentImage.fileID,
          caption: `Image ${ctx.scene.session.skip} of ${ctx.scene.session.totalImages - 1}\nCollection: ${
            ctx.scene.session.currentImage.collection?.name ?? "No."
          }\nUploaded: ${ctx.scene.session.currentImage.createdAt.toLocaleString()}`,
          type: "photo",
        },
        getKeyboard(ctx),
      );
    } catch (err) {
      botLogger.error(`Scene myImages error:`, err.stack);
    }
  })
  .action("NEXT", async (ctx) => {
    try {
      await ctx.answerCbQuery();

      ctx.scene.session.currentImage = await getImage(ctx.from.id, ctx.scene.session.skip + 1);

      if (!ctx.scene.session.currentImage) return;
      ctx.scene.session.skip++;

      await ctx.editMessageMedia(
        {
          media: ctx.scene.session.currentImage.fileID,
          caption: `Image ${ctx.scene.session.skip} of ${ctx.scene.session.totalImages - 1}\nCollection: ${
            ctx.scene.session.currentImage.collection?.name ?? "No."
          }\nUploaded: ${ctx.scene.session.currentImage.createdAt.toLocaleString()}`,
          type: "photo",
        },
        getKeyboard(ctx),
      );
    } catch (err) {
      botLogger.error(`Scene myImages error:`, err.stack);
    }
  })
  .action("LEAVE", async (ctx) => {
    try {
      await ctx.answerCbQuery();
      await ctx.scene.leave();
      await ctx.deleteMessage(ctx.message);
    } catch (err) {
      botLogger.error(`Scene myImages error:`, err.stack);
    }
  })
  .action("DELETE_IMAGE", async (ctx) => {
    try {
      await ctx.answerCbQuery();

      await ctx.editMessageReplyMarkup({
        inline_keyboard: [
          [
            { text: "Yes, delete it!", callback_data: "DELETE_IMAGE_APPROVE" },
            { text: "Cancel", callback_data: "DELETE_IMAGE_DECLINE" },
          ],
        ],
      });
    } catch (err) {
      botLogger.error(`Scene myImages error:`, err.stack);
    }
  })
  .action("DELETE_IMAGE_APPROVE", async (ctx) => {
    try {
      await ctx.answerCbQuery();

      await getRepository(Upload).remove(ctx.scene.session.currentImage);
      ctx.scene.session.currentImage = await getImage(ctx.from.id, ctx.scene.session.skip);

      if (!ctx.scene.session.currentImage) return ctx.scene.reenter();

      await ctx.editMessageMedia(
        {
          media: ctx.scene.session.currentImage.fileID,
          type: "photo",
        },
        getKeyboard(ctx),
      );
    } catch (err) {
      botLogger.error(`Scene myImages error:`, err.stack);
    }
  })
  .action("DELETE_IMAGE_DECLINE", async (ctx) => {
    try {
      await ctx.answerCbQuery();
      await ctx.editMessageReplyMarkup({ inline_keyboard: getKeyboard(ctx).reply_markup.inline_keyboard });
    } catch (err) {
      botLogger.error(`Scene myImages error:`, err.stack);
    }
  })
  .action("CHOOSE_COLLECTION", async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const currentImage = ctx.scene.session.currentImage;
      const collectionId = currentImage.collection?.id ?? 0;

      const collections = await getRepository(Collection).find({
        where: {
          userID: ctx.from.id,
          id: Not(collectionId),
        },
      });

      const collectionsList = collections.map((c) => [Markup.button.callback(c.name, `SWITCH_COLLECTION-${c.id}`)]);
      collectionsList.push([{ text: "«", callback_data: "BACK_TO_GALLERY", hide: false }]);

      await ctx.editMessageReplyMarkup({
        inline_keyboard: collectionsList,
      });
    } catch (err) {
      botLogger.error(`Scene myImages error:`, err.stack);
    }
  })
  .action(/SWITCH_COLLECTION-\d+/, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const collectionId = Number(ctx.match.input.replace("SWITCH_COLLECTION-", ""));
      ctx.scene.session.currentImage.collection = await getRepository(Collection).findOne(collectionId);
      await getRepository(Upload).save(ctx.scene.session.currentImage);
      await ctx.editMessageReplyMarkup({ inline_keyboard: getKeyboard(ctx).reply_markup.inline_keyboard });
    } catch (err) {
      botLogger.error(`Scene myImages error:`, err.stack);
    }
  });
