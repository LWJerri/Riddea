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
            where: { userID: ctx.from.id },
            order: { createdAt: "ASC" },
        });

        const keyboard = Markup.inlineKeyboard(
            collections.map((c) => Markup.button.callback(c.name, `EDIT_COLLECTION_${c.id}`)),
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
            await ctx.answerCbQuery().catch(() => {});
            await ctx.editMessageText("List of your collections:", await this.getKeyboard(ctx)).catch(() => {});
        });
        bot.action(/EDIT_COLLECTION_\d+/, async (ctx) => {
            const id = Number(ctx.match.input.replace("EDIT_COLLECTION_", ""));
            const collection = await this.repository.findOne({ id });
            await ctx
                .editMessageReplyMarkup({
                    inline_keyboard: [
                        [
                            {
                                text: `Make ${collection.isPublic ? "private" : "public"}`,
                                callback_data: `SWITCH_COLLECTION_STATE_${collection.id}`,
                            },
                        ],
                        [{ text: `Delete`, callback_data: `DELETE_COLLECTION_${collection.id}` }],
                    ],
                })
                .catch(() => {});
        });
        bot.action(/DELETE_COLLECTION_\d+/, async (ctx) => {
            const id = Number(ctx.match.input.replace("DELETE_COLLECTION_", ""));
            await this.repository.delete({ id });
            await ctx.answerCbQuery().catch(() => {});
            await ctx.editMessageReplyMarkup((await this.getKeyboard(ctx)).reply_markup).catch(() => {});
        });
    }

    async run(ctx: Context) {
        if ((ctx as any).isAction) {
            await ctx.editMessageText("List of your collections", await this.getKeyboard(ctx)).catch(() => {});
        } else {
            await ctx.reply("List of your collections:", await this.getKeyboard(ctx)).catch(() => {});
        }

        return;
    }
}
