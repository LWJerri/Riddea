import { Scenes, Markup, Context } from "telegraf";
import { getRepository } from "typeorm";
import { Upload } from "../entities/Upload";

export const uploadScene = new Scenes.BaseScene<Scenes.SceneContext>("upload")
    .enter((ctx: Context) => ctx.reply(`Okay, send me your image!`).catch((err: any) => console.log("[ERROR]: ", err)))
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
            .catch((err: any) => console.log("[ERROR]: ", err));

        (ctx.scene.session as any).fileID = ctx.message.photo.pop().file_id;
    })
    .command("cancel", async (ctx) => {
        await ctx.scene.leave().catch((err: any) => console.log("[ERROR]: ", err));
        await ctx.reply("You leave from upload image section!").catch((err: any) => console.log("[ERROR]: ", err));
    })
    .on("message", async (ctx) => {
        await ctx.reply(`If you don't want upload image, type /cancel!`).catch((err: any) => console.log("[ERROR]: ", err));
    })
    .action("PUBLISH", async (ctx) => {
        await ctx.answerCbQuery().catch((err: any) => console.log("[ERROR]: ", err));

        const uploadTable = getRepository(Upload);
        const newUpload = new Upload();
        newUpload.userID = ctx.from.id;
        newUpload.fileID = (ctx.scene.session as any).fileID;
        await uploadTable.save(newUpload);
        await ctx.reply(`Yay, your image loaded to bot database!`).catch((err: any) => console.log("[ERROR]: ", err));
        await ctx.scene.leave().catch((err: any) => console.log("[ERROR]: ", err));
    })
    .action("CANCEL", async (ctx) => {
        await ctx.answerCbQuery().catch((err: any) => console.log("[ERROR]: ", err));

        await ctx
            .reply(`Woop, your image removed from the queue to loading in the database!`)
            .catch((err: any) => console.log("[ERROR]: ", err));
        await ctx.scene.leave().catch((err: any) => console.log("[ERROR]: ", err));
    });
