import { Scenes } from "telegraf";
import { getRepository } from "typeorm";
import { Collection } from "../../entities";
import { botLogger } from "../helpers/logger";

interface ImageScene extends Scenes.SceneSessionData {
  state: { id: number };
}

export const renameCollection = new Scenes.BaseScene<Scenes.SceneContext<ImageScene>>("renameCollection")
  .enter(async (ctx) => {
    try {
      await ctx.reply(ctx.i18n.translate("bot.main.renameCollection.enter"), {
        reply_markup: { inline_keyboard: [[{ text: ctx.i18n.translate("bot.buttons.cancel"), callback_data: "CANCEL" }]] },
      });
    } catch (err) {
      botLogger.error(`Scene renameCollection error:`, err.stack);
    }
  })
  .on("text", async (ctx) => {
    try {
      const newName = ctx.message.text;

      if (newName.length > 15) {
        return ctx.reply(ctx.i18n.translate("bot.main.collection.nameLimit"));
      }

      const collectionRepo = getRepository(Collection);
      const duplicateName = await collectionRepo.findOne({ name: newName, userID: ctx.from.id });

      if (duplicateName && duplicateName.name.toLowerCase() == newName.toLowerCase())
        return await ctx.reply(ctx.i18n.translate("bot.main.collection.exist", { name: newName }));

      await collectionRepo.update({ id: ctx.scene.session.state.id }, { name: newName });

      await ctx.reply(ctx.i18n.translate("bot.main.renameCollection.rename", { name: newName }));
      await ctx.scene.leave();
    } catch (err) {
      botLogger.error(`Scene renameCollection error:`, err.stack);
    }
  })
  .action("CANCEL", async (ctx) => {
    try {
      await ctx.answerCbQuery();
      await ctx.deleteMessage(ctx.message);
      await ctx.scene.leave();
    } catch (err) {
      botLogger.error(`Scene renameCollection error:`, err.stack);
    }
  });
