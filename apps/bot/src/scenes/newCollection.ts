import { Scenes } from "telegraf";
import { getRepository } from "typeorm";
import { Collection } from "@riddea/typeorm";
import { botLogger } from "../helpers/logger";

interface NewCollectionScene extends Scenes.SceneSessionData {
  collectionName: string;
}

export const newCollection = new Scenes.BaseScene<Scenes.SceneContext<NewCollectionScene>>("createCollection")
  .enter((ctx) => {
    try {
      ctx.reply("Enter the name of new collection");
    } catch (err) {
      botLogger.error(`Scene newCollection error:`, err.stack);
    }
  })
  .command("cancel", async (ctx) => {
    try {
      await ctx.scene.leave();
      await ctx.reply("You leave from createCollection section!");
    } catch (err) {
      botLogger.error(`Scene upload error:`, err.stack);
    }
  })
  .on("text", async (ctx) => {
    try {
      if (ctx.message.text.length > 15) {
        return ctx.reply(`Oops! Collection name can be more than 15 symbols!`);
      }

      const repository = getRepository(Collection);
      const isExists = await repository.findOne({
        userID: ctx.from.id,
        name: ctx.message.text,
      });

      if (isExists) {
        return ctx.reply(`Collection with name ${isExists.name} already exists. Please, enter another name.`);
      }

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
  .leave((ctx) => {
    try {
      ctx.reply(`Collection with name ${ctx.scene.session.collectionName} created`);
    } catch (err) {
      botLogger.error(`Scene newCollection error:`, err.stack);
    }
  });
