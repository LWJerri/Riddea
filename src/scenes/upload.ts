import { Scenes, Markup, Context } from "telegraf";
import { getRepository } from "typeorm";
import { Upload } from "../entities/Upload";

interface UploadScene extends Scenes.SceneSessionData {
    fileID: string;
}

export const uploadScene = new Scenes.BaseScene<Scenes.SceneContext<UploadScene>>("upload")
    .enter((ctx: Context) => ctx.reply(`Okay, send me your image!`).catch(() => {}))
    .on("photo", async (ctx) => {
        await ctx
            .reply(
                "Do you wanna upload this photo?",
                Markup.inlineKeyboard([
                    [
                        {
                            text: "Yes",
                            callback_data: "PUBLISH",
                        },
                        {
                            text: "No",
                            callback_data: "CANCEL",
                        },
                    ],
                ])
            )
            .catch(() => {});

        ctx.scene.session.fileID = ctx.message.photo.pop().file_id;
    })
    .command("cancel", async (ctx) => {
        await ctx.scene.leave().catch(() => {});
        await ctx.reply("You leave from upload image section!").catch(() => {});
    })
    .on("message", async (ctx) => {
        await ctx.reply(`If you don't want upload image, type /cancel!`).catch(() => {});
    })
    .action("PUBLISH", async (ctx) => {
        await ctx.answerCbQuery().catch(() => {});

        await getRepository(Upload).save({
            userID: ctx.from.id,
            fileID: ctx.scene.session.fileID,
        });

        await ctx.reply(`Yay, your image loaded to bot database!`).catch(() => {});
        await ctx.scene.leave().catch(() => {});
    })
    .action("CANCEL", async (ctx) => {
        await ctx.answerCbQuery().catch(() => {});

        await ctx.reply(`Woop, your image removed from the queue to loading in the database!`).catch(() => {});
        await ctx.scene.leave().catch(() => {});
    });
