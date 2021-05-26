import { Scenes } from "telegraf";
import { CommandInterface } from "./_interface";

export default class extends CommandInterface {
    constructor() {
        super({
            name: "createcollection",
            description: "Create collections of images",
        });
    }

    async run(message: Scenes.SceneContext) {
        message.scene.enter("createCollection");
    }
}
