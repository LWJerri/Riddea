import { Scenes } from "telegraf";
import { blockScene } from "../scenes/block";
import { imageEdit } from "../scenes/imageEdit";
import { myImages } from "../scenes/myImages";
import { newCollection } from "../scenes/newCollection";
import { renameCollection } from "../scenes/renameCollection";
import { settingScene } from "../scenes/setting";
import { uploadScene } from "../scenes/upload";

export const stage = new Scenes.Stage<Scenes.SceneContext>([
  uploadScene,
  myImages,
  newCollection,
  settingScene,
  imageEdit,
  renameCollection,
  blockScene,
]);
