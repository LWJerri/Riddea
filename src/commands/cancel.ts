import { Scenes } from "telegraf";
import { CommandInterface } from "./_interface";

export default class extends CommandInterface {
    constructor() {
        super({
            description: "Cancel any stage you entered",
            name: "cancel",
        });
    }

    async run(ctx: Scenes.SceneContext) {
        ctx.scene.current?.leave();
        await ctx.reply("Okay, happy nice day!").catch((err: any) => console.log("[ERROR]: ", err));
    }
}
