import { Scenes } from "telegraf";

import { myImages } from "../scenes/myImages";
import { newCollection } from "../scenes/newCollection";
import { settingScene } from "../scenes/setting";
import { uploadScene } from "../scenes/upload";

export const stage = new Scenes.Stage<Scenes.SceneContext>([uploadScene, myImages, newCollection, settingScene]);
