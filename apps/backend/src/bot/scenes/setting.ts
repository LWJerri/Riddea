import { Scenes } from "telegraf";
import { getRepository } from "typeorm";
import { Collection, Statistic, Upload, User } from "../../entities";
import { botLogger } from "../helpers/logger";

export const settingScene = new Scenes.BaseScene<Scenes.SceneContext>("mySetting")
  .action("BACK", async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.deleteMessage(ctx.message);
    await ctx.scene.reenter();
  })
  .enter(async (ctx) => {
    try {
      const findOptions = { userID: ctx.from.id };

      const [collections, commands, images, userData] = await Promise.all([
        getRepository(Collection).count(findOptions),
        getRepository(Statistic).count(findOptions),
        getRepository(Upload).count(findOptions),
        getRepository(User).findOne(findOptions),
      ]);

      const userLang = ctx.i18n.translate(`bot.main.${userData.lang}`);

      const message = ctx.i18n.translate("bot.main.settings.profile.info", {
        lang: userLang,
        position: userData.id,
        date: userData.startedAt.toLocaleDateString(),
        commands,
        collections,
        images,
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

      keyboard.reply_markup.inline_keyboard.push([{ text: "«", callback_data: "BACK" }]);

      ctx.editMessageText(ctx.i18n.translate("bot.main.settings.lang.newLang"), keyboard);
    } catch (err) {
      botLogger.error(`Scene settings error:`, err.stack);
    }
  })
  .action(/LANGUAGE-\w+/, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const userRepo = getRepository(User);
      const newLang = ctx.match.input.replace("LANGUAGE-", "").toLowerCase();
      const keyboard = {
        reply_markup: {
          inline_keyboard: [[{ text: ctx.i18n.translate("bot.buttons.back"), callback_data: "BACK" }]],
        },
      };

      await userRepo.update({ userID: ctx.from.id }, { lang: newLang });

      await ctx.editMessageText(ctx.i18n.translate("bot.main.settings.lang.updLang"), keyboard);
    } catch (err) {
      botLogger.error(`Scene settings error:`, err.stack);
    }
  });
