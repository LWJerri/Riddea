import { Scenes } from "telegraf";
import { getRepository } from "typeorm";
import { Collection } from "@riddea/typeorm";
import { botLogger } from "../helpers/logger";
import i18n from "../helpers/localization";

interface NewCollectionScene extends Scenes.SceneSessionData {
  collectionName: string;
}

export const newCollection = new Scenes.BaseScene<Scenes.SceneContext<NewCollectionScene>>("createCollection")
  .enter(async (ctx) => {
    try {
      const repository = getRepository(Collection);
      const collNumber = await repository.count({ userID: ctx.from.id });

      if (collNumber >= 50) {
        await ctx.reply(i18n.translate("collectionLimit"));
        await ctx.scene.leave();

        return;
      }

      ctx.reply(i18n.translate("collectionName"));
    } catch (err) {
      botLogger.error(`Scene newCollection error:`, err.stack);
    }
  })
  .command("cancel", async (ctx) => {
    try {
      await ctx.scene.leave();
      await ctx.reply(i18n.translate("collectionLeave"));
    } catch (err) {
      botLogger.error(`Scene upload error:`, err.stack);
    }
  })
  .on("text", async (ctx) => {
    try {
      if (ctx.message.text.length > 15) {
        return ctx.reply(i18n.translate("collectionNameLimit"));
      }

      const repository = getRepository(Collection);
      const isExists = await repository.findOne({
        userID: ctx.from.id,
        name: ctx.message.text,
      });

      if (isExists) return ctx.reply(i18n.translate("collectionFound", { name: isExists.name }));

      await repository.save({
        name: ctx.message.text,
        userID: ctx.from.id,
        isPublic: false,
      });

      ctx.scene.session.collectionName = ctx.message.text;

      await ctx.scene.leave();
    } catch (err) {
      botLogger.error(`Scene newCollection error:`, err.stack);
    }
  })
  .leave(async (ctx) => {
    try {
      if (ctx.scene.session.collectionName)
        return await ctx.reply(i18n.translate("collectionCreated", { name: ctx.scene.session.collectionName }));
    } catch (err) {
      botLogger.error(`Scene newCollection error:`, err.stack);
    }
  });
