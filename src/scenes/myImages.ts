import { Context, Markup, Scenes } from "telegraf";
import { getRepository, Not } from "typeorm";
import { Collection } from "../entities/Collection";
import { Upload } from "../entities/Upload";

const getKeyboard = (ctx: Context, image: Upload) => {
    return Markup.inlineKeyboard([
        [
            { text: "Previous picture", callback_data: "BACK" },
            { text: "Next picture", callback_data: "NEXT" },
        ],
        [{ text: "Choose Collection", callback_data: `CHOOSE_COLLECTION_${image.id}_${image.collection?.id ?? 0}` }],
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

export const myImages = new Scenes.BaseScene<Scenes.SceneContext>("myImages")
    .action("BACK_TO_GALLERY", async (ctx) => {
        await ctx.answerCbQuery().catch((err: any) => console.log("[ERROR]: ", err));
        const image = await getImage(ctx.chat.id, (ctx.scene.session as any).skip);

        await ctx
            .editMessageReplyMarkup({ inline_keyboard: getKeyboard(ctx, image).reply_markup.inline_keyboard })
            .catch((err: any) => console.log("[ERROR]: ", err));
    })
    .enter(async (ctx) => {
        (ctx.scene.session as any).skip = 0;
        const image = await getImage(ctx.chat.id, (ctx.scene.session as any).skip);
        if (!image) {
            await ctx
                .reply(`You never upload here your images! Use /upload for loading your favorite image :)`)
                .catch((err: any) => console.log("[ERROR]: ", err));
            ctx.scene.leave().catch((err: any) => console.log("[ERROR]: ", err));

            return;
        }

        await ctx.replyWithPhoto(image.fileID, getKeyboard(ctx, image)).catch((err: any) => console.log("[ERROR]: ", err));
    })
    .action("BACK", async (ctx) => {
        await ctx.answerCbQuery().catch((err: any) => console.log("[ERROR]: ", err));
        if ((ctx.scene.session as any).skip > 0) {
            (ctx.scene.session as any).skip = (ctx.scene.session as any).skip - 1;
        } else {
            return;
        }

        const image = await getImage(ctx.chat.id, (ctx.scene.session as any).skip);

        if (!image) return;

        await ctx
            .editMessageMedia(
                {
                    media: image.fileID,
                    type: "photo",
                },
                getKeyboard(ctx, image)
            )
            .catch((err: any) => console.log("[ERROR]: ", err));
    })
    .action("NEXT", async (ctx) => {
        await ctx.answerCbQuery().catch((err: any) => console.log("[ERROR]: ", err));

        const image = await getImage(ctx.chat.id, (ctx.scene.session as any).skip + 1);

        if (!image) return;

        (ctx.scene.session as any).skip = (ctx.scene.session as any).skip + 1;
        await ctx
            .editMessageMedia(
                {
                    media: image.fileID,
                    type: "photo",
                },
                getKeyboard(ctx, image)
            )
            .catch((err: any) => console.log("[ERROR]: ", err));
    })
    .action("LEAVE", async (ctx) => {
        await ctx.answerCbQuery().catch((err: any) => console.log("[ERROR]: ", err));
        await ctx.scene.leave().catch((err: any) => console.log("[ERROR]: ", err));
    })
    .action(/CHOOSE_COLLECTION_.+_.+/, async (ctx) => {
        await ctx.answerCbQuery().catch((err: any) => console.log("[ERROR]: ", err));

        const match = ctx.match.input.replace("CHOOSE_COLLECTION_", "");
        const [imageId, collectionId] = match.split("_");

        const collections = await getRepository(Collection).find({
            where: {
                chatID: ctx.chat.id,
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
            .catch((err: any) => console.log("[ERROR]: ", err));
    })
    .action(/SWITCH_COLLECTION_\d+_\d+/, async (ctx) => {
        await ctx.answerCbQuery().catch((err: any) => console.log("[ERROR]: ", err));

        const match = ctx.match.input.replace("SWITCH_COLLECTION_", "");
        const [imageId, collectionId] = match.split("_");
        await getRepository(Upload).update({ id: Number(imageId) }, { collection: { id: Number(collectionId) } });
    });
