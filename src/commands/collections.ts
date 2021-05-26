import { Context, Markup } from "telegraf";
import { getRepository } from "typeorm";
import { bot } from "../app";
import { Collection } from "../entities/Collection";
import { CommandInterface } from "./_interface";

export default class extends CommandInterface {
    private repository = getRepository(Collection);
    constructor() {
        super({
            name: "collections",
            description: "List of your collections",
            action: "COLLECTION_LIST",
        });
        this.init();
    }

    private async getKeyboard(ctx: Context) {
        const collections = await this.repository.find({
            where: { chatID: ctx.chat.id },
            order: { createdAt: "ASC" },
        });

        const keyboard = Markup.inlineKeyboard(
            collections.map((c) =>
                Markup.button.callback(c.name, `EDIT_COLLECTION_${c.id}`)
            ),
            { columns: 1 }
        );

        return keyboard;
    }

    private async init() {
        bot.action(/SWITCH_COLLECTION_STATE_\d+/, async (ctx) => {
            const id = Number(ctx.match.input.replace("SWITCH_COLLECTION_STATE_", ""));
            const collection = await this.repository.findOne({ id });
            collection.isPublic = !collection.isPublic;
            await this.repository.save(collection);
            await ctx.answerCbQuery();
            ctx.editMessageText("List of your collections", await this.getKeyboard(ctx));
        });
        bot.action(/EDIT_COLLECTION_\d+/, async (ctx) => {
            const id = Number(ctx.match.input.replace("EDIT_COLLECTION_", ""));
            const collection = await this.repository.findOne({ id });
            await ctx.editMessageReplyMarkup({ inline_keyboard: [
                [{ text: `Make ${collection.isPublic ? 'private' : 'public'}`, callback_data: `SWITCH_COLLECTION_STATE_${collection.id}`}],
                [{ text: `Delete`, callback_data: `DELETE_COLLECTION_${collection.id}`}]
            ] })
        });
        bot.action(/DELETE_COLLECTION_\d+/, async (ctx) => {
            const id = Number(ctx.match.input.replace("DELETE_COLLECTION_", ""));
            await this.repository.delete({ id })
            await ctx.answerCbQuery()
            ctx.editMessageReplyMarkup((await this.getKeyboard(ctx)).reply_markup);
        });
    }

    async run(message: Context) {
        if ((message as any).isAction) {
            message.editMessageText("List of your collections", await this.getKeyboard(message));
        } else {
            message.reply("List of your collections", await this.getKeyboard(message));
        }
    }
}
