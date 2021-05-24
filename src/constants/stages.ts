import { Scenes } from "telegraf";
import { myImages } from "../scenes/myImages";
import { uploadScene } from "../scenes/upload";

export const stage = new Scenes.Stage<Scenes.SceneContext>([
    uploadScene,
    myImages,
]);
