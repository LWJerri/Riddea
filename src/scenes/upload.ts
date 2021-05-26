import { Scenes, Markup, Context } from "telegraf";
import { getRepository } from "typeorm";
import { Upload } from "../entities/Upload";

const tempData = new Map();
export const uploadScene = new Scenes.BaseScene<Scenes.SceneContext>("upload")
    .enter((msg: Context) => msg.reply(`Okay, send me your image!`).catch(() => {}))
    .on("photo", async (msg) => {
        await msg
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

        tempData.set(msg.message.from.id, msg.message.photo.pop().file_id);
    })
    .on("message", async (msg) => {
        await msg.reply(`If you don't want upload image, type /cancel!`).catch(() => {});
    })
    .action("PUBLISH", async (msg) => {
        await msg.answerCbQuery().catch(() => {});

        const uploadTable = getRepository(Upload);
        const newUpload = new Upload();
        newUpload.userID = msg.from.id;
        newUpload.fileID = tempData.get(msg.from.id);
        await uploadTable.save(newUpload);
        await msg.reply(`Yay, your image loaded to bot database!`).catch(() => {});

        tempData.delete(msg.from.id);
        await msg.scene.leave();
    })
    .action("CANCEL", async (msg) => {
        await msg.answerCbQuery().catch(() => {});
        await msg.reply(`Woop, your image removed from the queue to loading in the database!`).catch(() => {});
        tempData.delete(msg.from.id);
        await msg.scene.leave();
    });
