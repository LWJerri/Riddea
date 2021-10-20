import { Context, Markup } from "telegraf";
import { getRepository } from "typeorm";
import { bot } from "..";
import { Collection, Upload } from "../../entities";
import { CommandInterface } from "./_interface";

export default class extends CommandInterface {
  private repository = getRepository(Collection);
  private uploads = getRepository(Upload);

  constructor() {
    super({
      name: "collections",
      description: "Display list of all your collections",
      collectUsage: false,
      cooldown: false,
      actions: [
        {
          callback: "COLLECTION_LIST",
        },
      ],
    });
    this.init();
  }

  private async getKeyboard(ctx: Context) {
    const collections = await this.repository.find({
      where: { userID: ctx.from.id },
      order: { createdAt: "DESC" },
    });

    const keyboard = Markup.inlineKeyboard(
      collections.map((c) => Markup.button.callback(`${c.isPublic ? "🔓" : "🔒"} ${c.name}`, `EDIT_COLLECTION_${c.id}`)),
      { columns: 1 },
    );

    return keyboard;
  }

  private async init() {
    bot.action(/SWITCH_COLLECTION_STATE_\d+/, async (ctx) => {
      await ctx.answerCbQuery();

      const id = Number(ctx.match.input.replace("SWITCH_COLLECTION_STATE_", ""));
      const collection = await this.repository.findOne({ id });
      collection.isPublic = !collection.isPublic;
      await this.repository.save(collection);
      await ctx.editMessageText(ctx.i18n.translate("bot.main.collection.list"), await this.getKeyboard(ctx));
    });

    bot.action(/EDIT_COLLECTION_\d+/, async (ctx) => {
      await ctx.answerCbQuery();

      const id = Number(ctx.match.input.replace("EDIT_COLLECTION_", ""));
      const collection = await this.repository.findOne({ id });
      await ctx.editMessageReplyMarkup({
        inline_keyboard: [
          [
            {
              text: ctx.i18n.translate("bot.buttons.changeType", {
                type: collection.isPublic
                  ? ctx.i18n.translate("bot.main.other.state.private")
                  : ctx.i18n.translate("bot.main.other.state.public"),
              }),
              callback_data: `SWITCH_COLLECTION_STATE_${collection.id}`,
            },
          ],
          [{ text: ctx.i18n.translate("bot.buttons.open"), url: `https://riddea.ml/collection/${collection.id}` }],
          [{ text: ctx.i18n.translate("bot.buttons.rename"), callback_data: `RENAME_COLLECTION_${collection.id}` }],
          [{ text: ctx.i18n.translate("bot.buttons.delete"), callback_data: `DELETE_COLLECTION_${collection.id}` }],
          [{ text: "«", callback_data: `COLLECTION_LIST` }],
        ],
      });
    });

    bot.action(/DELETE_COLLECTION_\d+/, async (ctx) => {
      await ctx.answerCbQuery();

      const iwcID = (await this.repository.findOne({ userID: ctx.from.id, name: "IWC" })).id;
      const id = Number(ctx.match.input.replace("DELETE_COLLECTION_", ""));

      if (id == iwcID) return ctx.reply(ctx.i18n.translate("bot.main.collection.defProtect"));

      await this.uploads.update({ userID: ctx.from.id, collection: { id } }, { collection: { id: iwcID } });
      await this.repository.delete({ id });
      await ctx.editMessageReplyMarkup((await this.getKeyboard(ctx)).reply_markup);
    });

    bot.action(/RENAME_COLLECTION_\d+/, async (ctx) => {
      await ctx.answerCbQuery();

      const iwcID = (await this.repository.findOne({ userID: ctx.from.id, name: "IWC" })).id;
      const id = Number(ctx.match.input.replace("RENAME_COLLECTION_", ""));

      if (id == iwcID) return ctx.reply(ctx.i18n.translate("bot.main.collection.defProtect"));

      await ctx.scene.enter("renameCollection", { id });
    });
  }

  async run(ctx: Context) {
    if (ctx.isAction) {
      await ctx.editMessageText(ctx.i18n.translate("bot.main.collection.list"), await this.getKeyboard(ctx));
    } else {
      await ctx.reply(ctx.i18n.translate("bot.main.collection.list"), await this.getKeyboard(ctx));
    }
  }
}
