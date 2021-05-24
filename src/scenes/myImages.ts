import { Markup, Scenes } from "telegraf";
import { getRepository } from "typeorm";
import { Upload } from "../entities/Upload";

const keyboard = Markup.inlineKeyboard([
    [
        { text: "Previous page", callback_data: "BACK" },
        { text: "Next page", callback_data: "NEXT" },
    ],
    [{ text: "Stop", callback_data: "LEAVE" }],
]);

const tempPage = new Map();
export const myImages = new Scenes.BaseScene<Scenes.SceneContext>("myImages")
    .enter(async (ctx) => {
        const userImages = await getRepository(Upload).find({
            userID: ctx.from.id,
        });

        if (!userImages.length) {
            await ctx
                .reply(
                    `You never upload here your images! Use /upload for loading your favorite image :)`
                )
                .catch(() => {});
            ctx.scene.leave();

            return;
        }

        tempPage.set(ctx.from.id, 0);

        await ctx
            .replyWithPhoto(
                userImages[tempPage.get(ctx.from.id)].fileID,
                keyboard
            )
            .catch(() => {});
    })
    .action("BACK", async (ctx) => {
        await ctx.answerCbQuery().catch(() => {});

        const userImages = await getRepository(Upload).find({
            userID: ctx.from.id,
        });

        tempPage.set(ctx.from.id, tempPage.get(ctx.from.id) - 1);
        tempPage.get(ctx.from.id) < 0 ? tempPage.set(ctx.from.id, 0) : 0;

        await ctx
            .replyWithPhoto(
                userImages[tempPage.get(ctx.from.id)].fileID,
                keyboard
            )
            .catch(() => {});
    })
    .action("NEXT", async (ctx) => {
        await ctx.answerCbQuery().catch(() => {});

        const userImages = await getRepository(Upload).find({
            userID: ctx.from.id,
        });

        tempPage.set(ctx.from.id, tempPage.get(ctx.from.id) + 1);
        tempPage.get(ctx.from.id) >= userImages.length
            ? tempPage.set(ctx.from.id, userImages.length - 1)
            : 0;

        await ctx
            .replyWithPhoto(
                userImages[tempPage.get(ctx.from.id)].fileID,
                keyboard
            )
            .catch(() => {});
    })
    .action("LEAVE", async (ctx) => {
        await ctx.answerCbQuery();
        await ctx.scene.leave();
    });
