import Axios from "axios";
import Telegraf from "telegraf";
import Markup from "telegraf/markup";

const setting = require("../settings.json");
const bot = new Telegraf(setting.token);

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