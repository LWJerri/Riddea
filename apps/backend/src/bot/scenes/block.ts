import { Scenes } from "telegraf";
import { ChatFromGetChat } from "typegram";
import { getRepository } from "typeorm";
import { bot } from "..";
import { User } from "../../entities";
import { botLogger } from "../helpers/logger";

let USER_ID: string | number;
let getUser: ChatFromGetChat;

export const blockScene = new Scenes.BaseScene<Scenes.SceneContext>("block")
  .command("cancel", async (ctx) => {
    try {
      await ctx.scene.leave();
      await ctx.reply(ctx.i18n.translate("bot.main.scene.block.leave"));
    } catch (err) {
      botLogger.error(`Scene imageEdit error:`, err.stack);
    }
  })
  .enter(async (ctx) => {
    try {
      if (ctx.from.id != Number(process.env.ADMIN_ID)) return await ctx.scene.leave();

      await ctx.reply(ctx.i18n.translate("bot.main.scene.block.enter"));
    } catch (err) {
      botLogger.error(`Scene ban error:`, err.stack);
    }
  })
  .on("text", async (ctx) => {
    let isFound: boolean;

    try {
      USER_ID = ctx.message.text;
      getUser = await bot.telegram.getChat(USER_ID);

      isFound = true;
    } catch (err) {
      isFound = false;
    }

    if (!isFound) return await ctx.reply(ctx.i18n.translate("bot.main.scene.block.notFound"));

    try {
      const keyboard = {
        reply_markup: {
          inline_keyboard: [
            [
              { text: ctx.i18n.translate("bot.buttons.block.upload.deny"), callback_data: "UPLOAD_BAN" },
              { text: ctx.i18n.translate("bot.buttons.block.upload.allow"), callback_data: "UPLOAD_UNBAN" },
            ],
          ],
        },
      };

      await ctx.reply(ctx.i18n.translate("bot.main.scene.block.extend", { id: getUser.id }), keyboard);
    } catch (err) {
      botLogger.error(`Scene ban error:`, err.stuck);
    }
  })
  .action(/UPLOAD_\w+/, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const uploadType = ctx.match.input.replace("UPLOAD_", "");
      const banType = uploadType == "BAN" ? true : false;

      try {
        await getRepository(User).update({ userID: Number(USER_ID) }, { uploadBan: banType });
        await ctx.reply(ctx.i18n.translate("bot.main.scene.block.update", { id: getUser.id }));
      } catch (err) {
        botLogger.error(`Scene ban error:`, err.stack);
        await ctx.reply(ctx.i18n.translate("bot.main.errors.error"));
      }

      await ctx.scene.leave();
    } catch (err) {
      botLogger.error(`Scene ban error:`, err.stack);
    }
  });
