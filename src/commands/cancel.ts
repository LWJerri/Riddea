import { Context, Scenes } from "telegraf";
import { CommandInterface } from "./_interface";

export const description = "Display bot help menu";

export default class extends CommandInterface {
    constructor() {
        super({
            description: "Cancel any stage you entered",
            name: "cancel",
        });
    }

    async run(message: Scenes.SceneContext) {
        message.scene.current?.leave();
        await message.reply("Okay, happy nice day!");
    }
}
