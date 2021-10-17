import { Scenes } from "telegraf";
import { getRepository } from "typeorm";

import { User } from "../../entities";
import { botLogger } from "../helpers/logger";

export const settingScene = new Scenes.BaseScene<Scenes.SceneContext>("mySetting")
  .action("BACK", async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.deleteMessage(ctx.message);
    await ctx.scene.reenter();
  })
  .enter(async (ctx) => {
    try {
      const userData = await getRepository(User).findOne({ userID: ctx.from.id });
      const userLang = userData.lang.toUpperCase();

      const message = ctx.i18n.translate("bot.main.settings.profile.info", {
        lang: userLang,
        position: userData.id,
        date: userData.startedAt.toLocaleDateString(),
      });
      const keyboard = {
        reply_markup: { inline_keyboard: [[{ text: ctx.i18n.translate("bot.buttons.lang"), callback_data: "LANGUAGE" }]] },
      };

      await ctx.reply(message, keyboard);
    } catch (err) {
      botLogger.error(`Scene settings error:`, err.stack);
    }
  })
  .action("LANGUAGE", async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const keyboard = {
        reply_markup: {
          inline_keyboard: [
            [{ text: "🇷🇺 Русский", callback_data: "LANGUAGE-RU" }],
            [{ text: "🇺🇸 English", callback_data: "LANGUAGE-EN" }],
            [{ text: "🇺🇦 Українська", callback_data: "LANGUAGE-UK" }],
          ],
        },
      };

      ctx.editMessageText(ctx.i18n.translate("bot.main.settings.lang.newLang"), keyboard);
    } catch (err) {
      botLogger.error(`Scene settings error:`, err.stack);
    }
  })
  .action("LANGUAGE-RU", async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const keyboard = {
        reply_markup: {
          inline_keyboard: [[{ text: ctx.i18n.translate("bot.buttons.back"), callback_data: "BACK" }]],
        },
      };

      const userRepo = getRepository(User);
      const newData = await userRepo.findOne({ userID: ctx.from.id });
      newData.lang = "ru";
      await userRepo.save(newData);

      await ctx.editMessageText(ctx.i18n.translate("bot.main.settings.lang.updLang"), keyboard);
    } catch (err) {
      botLogger.error(`Scene settings error:`, err.stack);
    }
  })
  .action("LANGUAGE-EN", async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const keyboard = {
        reply_markup: {
          inline_keyboard: [[{ text: ctx.i18n.translate("bot.buttons.back"), callback_data: "BACK" }]],
        },
      };

      const userRepo = getRepository(User);
      const newData = await userRepo.findOne({ userID: ctx.from.id });
      newData.lang = "en";
      await userRepo.save(newData);

      await ctx.editMessageText(ctx.i18n.translate("bot.main.settings.lang.updLang"), keyboard);
    } catch (err) {
      botLogger.error(`Scene settings error:`, err.stack);
    }
  })
  .action("LANGUAGE-UK", async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const keyboard = {
        reply_markup: {
          inline_keyboard: [[{ text: ctx.i18n.translate("bot.buttons.back"), callback_data: "BACK" }]],
        },
      };

      const userRepo = getRepository(User);
      const newData = await userRepo.findOne({ userID: ctx.from.id });
      newData.lang = "uk";
      await userRepo.save(newData);

      await ctx.editMessageText(ctx.i18n.translate("bot.main.settings.lang.updLang"), keyboard);
    } catch (err) {
      botLogger.error(`Scene settings error:`, err.stack);
    }
  });
