import Axios from "axios";
import Telegraf from "telegraf";
import Markup from "telegraf/markup";
import express from "express";

const setting = require("../settings.json");
const bot = new Telegraf(setting.token);
const application = express();

application.use(express.static("public"));

application.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

bot.start((ctx) => ctx.reply(setting.welcomeMessage));
bot.help((ctx) => ctx.reply(setting.helpMessage));
bot.command("image", ({ reply }) => reply("Oi, you ready?", Markup.keyboard(["Show"]).resize().extra()));

bot.hears("Show", async (ctx) => {
  await Axios.get("https://japi.ohori.me/nsfw")
  .then(output => {
    ctx.replyWithPhoto(output.data.image.proxyURL);
  }).catch(function(){
    ctx.reply("Oops! I lost the photo, try again <3");
  });
});

bot.launch();

application.listen(setting.port, () => {
  console.log("[WEB]: Website ready and run on port " + setting.port);
});