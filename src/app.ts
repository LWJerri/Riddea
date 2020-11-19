import Axios from "axios";
import Telegraf from "telegraf";
import Markup from "telegraf/markup";
import express from "express";

const setting = require("../settings.json");
const bot = new Telegraf(setting.token);
const app = express();
const port = setting.port;

app.get("/", (req, res) => { res.send("hello") });

bot.start((ctx) => ctx.reply(setting.welcomeMessage));
bot.command("image", ({ reply }) => reply("Братик, уверен?", Markup.keyboard(["Показать"]).resize().extra()));

bot.hears("Показать", async (ctx) => {
  await Axios.get("https://japi.ohori.me/nsfw")
  .then(output => {
    ctx.replyWithPhoto(output.data.image.proxyURL);
  }).catch(function(){
    ctx.reply("Ой, жмякни ещё раз :3");
  });
});

bot.launch();
app.listen(port, () => { console.log("[!]: WEB READY!") });