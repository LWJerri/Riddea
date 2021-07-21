import { Scenes } from "telegraf";
import { myImages } from "../scenes/myImages";
import { newCollection } from "../scenes/newCollection";
import { uploadScene } from "../scenes/upload";
import { settingScene } from "../scenes/setting";

export const stage = new Scenes.Stage<Scenes.SceneContext>([uploadScene, myImages, newCollection, settingScene]);
