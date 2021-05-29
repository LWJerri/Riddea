import { Markup, Scenes } from "telegraf";
import { getRepository, Not } from "typeorm";
import { Collection } from "../entities/Collection";
import { Upload } from "../entities/Upload";

interface ImageScene extends Scenes.SceneSessionData {
    skip: number;
    currentImage: Upload;
    totalImages: number;
}

const getKeyboard = (ctx: Scenes.SceneContext<ImageScene>) => {
    return Markup.inlineKeyboard([
        [
            ctx.scene.session.skip > 0 ? { text: "Previous picture", callback_data: "BACK" } : undefined,
            ctx.scene.session.skip + 1 !== ctx.scene.session.totalImages ? { text: "Next picture", callback_data: "NEXT" } : undefined,
        ].filter(Boolean),
        [
            { text: "Choose Collection", callback_data: `CHOOSE_COLLECTION` },
            { text: "Delete", callback_data: "DELETE_IMAGE" },
        ],
        [{ text: "Stop", callback_data: "LEAVE" }],
    ]);
};

const getImage = async (userID: number, skip: number) => {
    return (
        await getRepository(Upload).find({
            where: {
                userID,
            },
            skip,
            take: 1,
            relations: ["collection"],
        })
    )[0];
};

export const myImages = new Scenes.BaseScene<Scenes.SceneContext<ImageScene>>("myImages")
    .action("BACK_TO_GALLERY", async (ctx) => {
        await ctx.answerCbQuery().catch(() => {});
        await ctx.editMessageReplyMarkup({ inline_keyboard: getKeyboard(ctx).reply_markup.inline_keyboard }).catch(() => {});
    })
    .enter(async (ctx) => {
        ctx.scene.session.skip = 0;
        ctx.scene.session.totalImages = await getRepository(Upload).count({ userID: ctx.from.id });
        ctx.scene.session.currentImage = await getImage(ctx.from.id, ctx.scene.session.skip);
        if (!ctx.scene.session.currentImage) {
            await ctx.reply(`You never upload here your images! Use /upload for loading your favorite image :)`).catch(() => {});
            ctx.scene.leave().catch(() => {});

            return;
        }

        await ctx.replyWithPhoto(ctx.scene.session.currentImage.fileID, getKeyboard(ctx)).catch(() => {});
    })
    .action("BACK", async (ctx) => {
        await ctx.answerCbQuery().catch(() => {});
        if (ctx.scene.session.skip > 0) {
            ctx.scene.session.skip--;
        } else {
            return;
        }

        ctx.scene.session.currentImage = await getImage(ctx.from.id, ctx.scene.session.skip);

        if (!ctx.scene.session.currentImage) return;

        await ctx
            .editMessageMedia(
                {
                    media: ctx.scene.session.currentImage.fileID,
                    caption: `Image ${ctx.scene.session.skip} of ${ctx.scene.session.totalImages}`,
                    type: "photo",
                },
                getKeyboard(ctx)
            )
            .catch(() => {});
    })
    .action("NEXT", async (ctx) => {
        await ctx.answerCbQuery().catch(() => {});

        ctx.scene.session.currentImage = await getImage(ctx.from.id, ctx.scene.session.skip + 1);

        if (!ctx.scene.session.currentImage) return;
        ctx.scene.session.skip++;

        await ctx
            .editMessageMedia(
                {
                    media: ctx.scene.session.currentImage.fileID,
                    caption: `Image ${ctx.scene.session.skip} of ${ctx.scene.session.totalImages}`,
                    type: "photo",
                },
                getKeyboard(ctx)
            )
            .catch(() => {});
    })
    .action("LEAVE", async (ctx) => {
        await ctx.answerCbQuery().catch(() => {});
        await ctx.scene.leave().catch(() => {});
        await ctx.deleteMessage(ctx.message).catch(() => {});
    })
    .action("DELETE_IMAGE", async (ctx) => {
        await ctx.answerCbQuery().catch(() => {});

        await ctx
            .editMessageReplyMarkup({
                inline_keyboard: [
                    [
                        { text: "Yes, delete it!", callback_data: "DELETE_IMAGE_APPROVE" },
                        { text: "Cancel", callback_data: "DELETE_IMAGE_DECLINE" },
                    ],
                ],
            })
            .catch(() => {});
    })
    .action("DELETE_IMAGE_APPROVE", async (ctx) => {
        await ctx.answerCbQuery().catch(() => {});

        await getRepository(Upload).remove(ctx.scene.session.currentImage);
        ctx.scene.session.currentImage = await getImage(ctx.from.id, ctx.scene.session.skip);

        if (!ctx.scene.session.currentImage) return ctx.scene.reenter();

        await ctx
            .editMessageMedia(
                {
                    media: ctx.scene.session.currentImage.fileID,
                    type: "photo",
                },
                getKeyboard(ctx)
            )
            .catch(() => {});
    })
    .action("DELETE_IMAGE_DECLINE", async (ctx) => {
        await ctx.answerCbQuery().catch(() => {});
        await ctx.editMessageReplyMarkup({ inline_keyboard: getKeyboard(ctx).reply_markup.inline_keyboard }).catch(() => {});
    })
    .action("CHOOSE_COLLECTION", async (ctx) => {
        await ctx.answerCbQuery().catch(() => {});

        const currentImage = ctx.scene.session.currentImage;
        const collectionId = currentImage.collection?.id ?? 0;

        const collections = await getRepository(Collection).find({
            where: {
                userID: ctx.from.id,
                id: Not(collectionId),
            },
        });

        await ctx
            .editMessageReplyMarkup({
                inline_keyboard: [
                    collections.map((c) => Markup.button.callback(c.name, `SWITCH_COLLECTION-${c.id}`)),
                    [{ text: "«", callback_data: "BACK_TO_GALLERY" }],
                ],
            })
            .catch(() => {});
    })
    .action(/SWITCH_COLLECTION-\d+/, async (ctx) => {
        await ctx.answerCbQuery().catch(() => {});

        const collectionId = Number(ctx.match.input.replace("SWITCH_COLLECTION-", ""));
        ctx.scene.session.currentImage.collection = await getRepository(Collection).findOne(collectionId);
        await getRepository(Upload).save(ctx.scene.session.currentImage);
        await ctx.editMessageReplyMarkup({ inline_keyboard: getKeyboard(ctx).reply_markup.inline_keyboard }).catch(() => {});
    });
