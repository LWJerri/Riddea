import { Markup, Scenes } from "telegraf";
import { getRepository, Not } from "typeorm";
import { Collection, Upload } from "../../entities";
import { botLogger } from "../helpers/logger";
import { deleteFile } from "../libs/s3";

interface ImageScene extends Scenes.SceneSessionData {
  imageID: number;
}

const getKeyboard = (ctx: Scenes.SceneContext<ImageScene>) => {
  return Markup.inlineKeyboard([
    [
      { text: ctx.i18n.translate("bot.buttons.collection"), callback_data: "CHOOSE_COLLECTION" },
      { text: ctx.i18n.translate("bot.buttons.delete"), callback_data: "DELETE_IMAGE" },
    ],
    [{ text: ctx.i18n.translate("bot.buttons.cancel"), callback_data: "CANCEL" }],
  ]);
};

export const imageEdit = new Scenes.BaseScene<Scenes.SceneContext<ImageScene>>("imageEdit")
  .enter(async (ctx) => {
    try {
      await ctx.reply(ctx.i18n.translate("bot.main.imageEdit.enter"));
    } catch (err) {
      botLogger.error(`Scene imageEdit error:`, err.stack);
    }
  })
  .command("cancel", async (ctx) => {
    try {
      await ctx.scene.leave();
      await ctx.reply(ctx.i18n.translate("bot.main.scene.leave.edit"));
    } catch (err) {
      botLogger.error(`Scene imageEdit error:`, err.stack);
    }
  })
  .on("text", async (ctx) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const id = ctx.message.text as any;

      if (isNaN(id)) return await ctx.reply(ctx.i18n.translate("bot.main.errors.notID"));
      ctx.scene.session.imageID = id;

      const uploadRepository = getRepository(Upload);
      const imageData = await uploadRepository.findOne({ where: { id, userID: ctx.from.id }, relations: ["collection"] });

      if (!imageData) return await ctx.reply(ctx.i18n.translate("bot.main.imageEdit.notExist", { id: ctx.scene.session.imageID }));
      if (imageData.userID != ctx.from.id) return await ctx.reply(ctx.i18n.translate("bot.main.imageEdit.notOwner"));

      const buttons = getKeyboard(ctx).reply_markup;

      await ctx.replyWithPhoto(imageData.fileID, {
        caption: `${ctx.i18n.translate("bot.main.images.caption.second", {
          name: imageData?.collection?.name ?? "-",
        })}\n${ctx.i18n.translate("bot.main.images.caption.three", {
          time: imageData.createdAt.toLocaleString(),
        })}\n${ctx.i18n.translate("bot.main.images.caption.four", { id: imageData.id })}`,
        reply_markup: buttons,
      });
    } catch (err) {
      botLogger.error(`Scene imageEdit error:`, err.stack);
    }
  })
  .action("DELETE_IMAGE", async (ctx) => {
    try {
      await ctx.answerCbQuery();

      await ctx.editMessageReplyMarkup({
        inline_keyboard: [
          [
            { text: ctx.i18n.translate("bot.buttons.confirm"), callback_data: "DELETE_IMAGE_APPROVE" },
            { text: ctx.i18n.translate("bot.buttons.cancel"), callback_data: "BACK" },
          ],
        ],
      });
    } catch (err) {
      botLogger.error(`Scene imageEdit error:`, err.stack);
    }
  })
  .action("DELETE_IMAGE_APPROVE", async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const uploadRepository = getRepository(Upload);
      const image = await uploadRepository.findOne({ id: ctx.scene.session.imageID });

      await deleteFile({ filePath: image.filePath });
      await getRepository(Upload).delete({ id: ctx.scene.session.imageID });

      await ctx.deleteMessage(ctx.message);
      await ctx.reply(ctx.i18n.translate("bot.main.imageEdit.deleted", { id: ctx.scene.session.imageID }));
    } catch (err) {
      botLogger.error(`Scene imageEdit error:`, err.stack);
    }
  })
  .action("BACK", async (ctx) => {
    try {
      await ctx.answerCbQuery();

      await ctx.editMessageReplyMarkup({ inline_keyboard: getKeyboard(ctx).reply_markup.inline_keyboard });
    } catch (err) {
      botLogger.error(`Scene imageEdit error:`, err.stack);
    }
  })
  .action("CANCEL", async (ctx) => {
    try {
      await ctx.answerCbQuery();

      await ctx.deleteMessage(ctx.message);
      await ctx.scene.reenter();
    } catch (err) {
      botLogger.error(`Scene imageEdit error:`, err.stack);
    }
  })
  .action("CHOOSE_COLLECTION", async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const { collection } = await getRepository(Upload).findOne({
        where: { id: ctx.scene.session.imageID },
        relations: ["collection"],
      });

      const collections = await getRepository(Collection).find({
        where: {
          userID: ctx.from.id,
          id: Not(collection.id),
        },
        order: { createdAt: "DESC" },
      });

      const collectionsList = collections.map((c) => [Markup.button.callback(c.name, `SWITCH_COLLECTION-${c.id}`)]);
      collectionsList.push([{ text: "«", callback_data: "BACK", hide: false }]);

      await ctx.editMessageReplyMarkup({
        inline_keyboard: collectionsList,
      });
    } catch (err) {
      botLogger.error(`Scene imageEdit error:`, err.stack);
    }
  })
  .action(/SWITCH_COLLECTION-\d+/, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const collectionID = Number(ctx.match.input.replace("SWITCH_COLLECTION-", "")) as any;

      await getRepository(Upload).update({ id: ctx.scene.session.imageID }, { collection: collectionID });
      const newData = await getRepository(Upload).findOne({ where: { id: ctx.scene.session.imageID }, relations: ["collection"] });
      const buttons = getKeyboard(ctx);

      await ctx.editMessageCaption(
        `${ctx.i18n.translate("bot.main.images.caption.second", {
          name: newData?.collection?.name ?? "-",
        })}\n${ctx.i18n.translate("bot.main.images.caption.three", {
          time: newData.createdAt.toLocaleString(),
        })}\n${ctx.i18n.translate("bot.main.images.caption.four", { id: newData.id })}`,
        buttons,
      );
    } catch (err) {
      botLogger.error(`Scene myImages error:`, err.stack);
    }
  });
