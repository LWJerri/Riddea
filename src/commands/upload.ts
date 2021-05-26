import { Scenes } from "telegraf";
import { CommandInterface } from "./_interface";

export default class extends CommandInterface {
    constructor() {
        super({
            name: "upload",
            description: "Upload your picture to database",
            collectUsage: true,
        });
    }

    async run(message: Scenes.SceneContext<Scenes.SceneSessionData>) {
        message.scene.enter("upload");
    }
}
