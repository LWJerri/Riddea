import "source-map-support";
import Axios from "axios";
import Telegraf from "telegraf";
import Markup from "telegraf/markup";
import express from "express";
import setting from "../settings.json";

const bot = new Telegraf(setting.token);
const app = express();

app.get("/", (req, res) => {
  res.json({
    "statistic": 0
  });
});

bot.start((ctx) => ctx.reply(setting.welcomeMessage));
bot.help((ctx) => ctx.reply(setting.helpMessage));
bot.command("image", ({ reply }) => reply("Oi, you ready?", Markup.keyboard(["Show"]).resize().extra()));

bot.hears("Show", async (ctx) => {
  await Axios.get("https://japi.ohori.me/nsfw?as=api")
  .then(output => {
    ctx.replyWithPhoto(output.data.image.proxyURL);
  }).catch(function(){
    ctx.reply("Oops! I lost the photo, try again <3");
  });
});

bot.launch();

app.listen(setting.port, () => {
  console.log("[WEB]: Website ready! Port - " + setting.port);
});