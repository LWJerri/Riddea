import { Scenes } from "telegraf";
import { CommandInterface } from "./_interface";

export default class extends CommandInterface {
    constructor() {
        super({
            name: "createcollection",
            description: "Create collections of images",
        });
    }

    async run(ctx: Scenes.SceneContext) {
        await ctx.scene.enter("createCollection").catch((err: any) => console.log("[ERROR]: ", err));

        return;
    }
}
