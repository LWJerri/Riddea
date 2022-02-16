import { Scenes } from "telegraf";
import { getRepository } from "typeorm";

import { Collection } from "../../entities";
import { botLogger } from "../helpers/logger";

interface NewCollectionScene extends Scenes.SceneSessionData {
  collectionName: string;
}

export const newCollection = new Scenes.BaseScene<Scenes.SceneContext<NewCollectionScene>>("createCollection")
  .enter(async (ctx) => {
    try {
      const repository = getRepository(Collection);
      const collNumber = await repository.count({ userID: ctx.from.id });

      if (collNumber >= 50) {
        await ctx.reply(ctx.i18n.translate("bot.main.collection.countLimit"));
        await ctx.scene.leave();

        return;
      }

      ctx.reply(ctx.i18n.translate("bot.main.collection.name"));
    } catch (err) {
      botLogger.error(`Scene newCollection error:`, err.stack);
    }
  })
  .command("cancel", async (ctx) => {
    try {
      await ctx.scene.leave();
      await ctx.reply(ctx.i18n.translate("bot.main.scene.leave.collection"));
    } catch (err) {
      botLogger.error(`Scene upload error:`, err.stack);
    }
  })
  .on("text", async (ctx) => {
    try {
      const name = ctx.message.text;

      if (name.length > 15) {
        return ctx.reply(ctx.i18n.translate("bot.main.collection.nameLimit"));
      }

      const repository = getRepository(Collection);
      const isExists = await repository.findOne({
        userID: ctx.from.id,
        name,
      });

      if (isExists) return ctx.reply(ctx.i18n.translate("bot.main.collection.exist", { name: isExists.name }));

      await repository.save({
        name,
        userID: ctx.from.id,
        isPublic: false,
      });

      ctx.scene.session.collectionName = name;

      await ctx.scene.leave();
    } catch (err) {
      botLogger.error(`Scene newCollection error:`, err.stack);
    }
  })
  .leave(async (ctx) => {
    try {
      if (ctx.scene.session.collectionName)
        return await ctx.reply(
          ctx.i18n.translate("bot.main.collection.created", { name: ctx.scene.session.collectionName }),
        );
    } catch (err) {
      botLogger.error(`Scene newCollection error:`, err.stack);
    }
  });
