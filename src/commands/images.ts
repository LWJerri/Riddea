import { Scenes } from "telegraf";
import { CommandInterface } from "./_interface";

export default class extends CommandInterface {
    constructor() {
        super({
            name: "images",
            description: "View all your uploaded images",
        });
    }

    run(ctx: Scenes.SceneContext<Scenes.SceneSessionData>) {
        return ctx.scene.enter("myImages").catch((err: any) => console.log("[ERROR]: ", err));
    }
}
