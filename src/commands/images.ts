import { Scenes } from "telegraf";
import { CommandInterface } from "./_interface";

export default class extends CommandInterface {
    constructor() {
        super({
            name: "images",
            description: "View all your uploaded images",
        });
    }

    run(message: Scenes.SceneContext<Scenes.SceneSessionData>) {
        return message.scene.enter("myImages");
    }
}
