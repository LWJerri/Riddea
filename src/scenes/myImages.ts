import { Markup, Scenes } from "telegraf";
import { getRepository, Not } from "typeorm";
import { Collection } from "../entities/Collection";
import { Upload } from "../entities/Upload";

interface ImageScene extends Scenes.SceneSessionData {
    // will be available under `ctx.scene.session.mySceneSessionProp`
    skip: number;
}

const getKeyboard = (ctx: Scenes.SceneContext<ImageScene>, image: Upload) => {
    return Markup.inlineKeyboard([
        [
            ctx.scene.session.skip > 0 ? { text: "Previous picture", callback_data: "BACK" } : undefined,
            ctx.scene.session.skip + 1 !== (ctx.scene.session as any).images ? { text: "Next picture", callback_data: "NEXT" } : undefined,
        ].filter(Boolean),
        [
            { text: "Choose Collection", callback_data: `CHOOSE_COLLECTION_${image.id}_${image.collection?.id ?? 0}` },
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
        const image = await getImage(ctx.from.id, ctx.scene.session.skip);

        await ctx.editMessageReplyMarkup({ inline_keyboard: getKeyboard(ctx, image).reply_markup.inline_keyboard }).catch(() => {});
    })
    .enter(async (ctx) => {
        ctx.scene.session.skip = 0;
        (ctx.scene.session as any).images = await getRepository(Upload).count({ userID: ctx.from.id });
        const image = await getImage(ctx.from.id, ctx.scene.session.skip);
        if (!image) {
            await ctx.reply(`You never upload here your images! Use /upload for loading your favorite image :)`).catch(() => {});
            ctx.scene.leave().catch(() => {});

            return;
        }

        await ctx.replyWithPhoto(image.fileID, getKeyboard(ctx, image)).catch(() => {});
    })
    .action("BACK", async (ctx) => {
        await ctx.answerCbQuery().catch(() => {});
        if (ctx.scene.session.skip > 0) {
            ctx.scene.session.skip = ctx.scene.session.skip - 1;
        } else {
            return;
        }

        const image = await getImage(ctx.from.id, ctx.scene.session.skip);

        if (!image) return;

        await ctx
            .editMessageMedia(
                {
                    media: image.fileID,
                    type: "photo",
                },
                getKeyboard(ctx, image)
            )
            .catch(() => {});
    })
    .action("NEXT", async (ctx) => {
        await ctx.answerCbQuery().catch(() => {});

        const image = await getImage(ctx.from.id, ctx.scene.session.skip + 1);

        if (!image) return;
        ctx.scene.session.skip = ctx.scene.session.skip + 1;

        await ctx
            .editMessageMedia(
                {
                    media: image.fileID,
                    type: "photo",
                },
                getKeyboard(ctx, image)
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
        const pictureID = await getImage(ctx.from.id, ctx.scene.session.skip);
        if (!pictureID) return;

        const selectedImage = await getRepository(Upload).findByIds([pictureID.id]);
        await getRepository(Upload).remove(selectedImage);

        await ctx.scene.reenter().catch(() => {});
    })
    .action("DELETE_IMAGE_DECLINE", async (ctx) => {
        await ctx.scene.reenter().catch(() => {});
    })
    .action(/CHOOSE_COLLECTION_.+_.+/, async (ctx) => {
        await ctx.answerCbQuery().catch(() => {});

        const match = ctx.match.input.replace("CHOOSE_COLLECTION_", "");
        const [imageId, collectionId] = match.split("_");

        const collections = await getRepository(Collection).find({
            where: {
                userID: ctx.from.id,
                id: Not(Number(collectionId)),
            },
        });

        await ctx
            .editMessageReplyMarkup({
                inline_keyboard: [
                    collections.map((c) => Markup.button.callback(c.name, `SWITCH_COLLECTION_${imageId}_${c.id}`)),
                    [{ text: "«", callback_data: "BACK_TO_GALLERY" }],
                ],
            })
            .catch(() => {});
    })
    .action(/SWITCH_COLLECTION_\d+_\d+/, async (ctx) => {
        await ctx.answerCbQuery().catch(() => {});

        const match = ctx.match.input.replace("SWITCH_COLLECTION_", "");
        const [imageId, collectionId] = match.split("_");
        await getRepository(Upload).update({ id: Number(imageId) }, { collection: { id: Number(collectionId) } });
    });
