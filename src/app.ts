require("dotenv").config();

import "source-map-support";
import Axios from "axios";
import { Telegraf } from "telegraf";
import Markup from "telegraf/markup";
import express from "express";

const bot = new Telegraf(process.env.token);
const app = express();

app.get("/", (req, res) => {
  res.json({
    "statistic": 0
  });
});

bot.start(async (ctx) => await ctx.reply(process.env.welcomeMessage));

bot.help(async (ctx) => await ctx.reply(process.env.helpMessage));

bot.command("image", async ({ reply }) => {
  await reply("Oi, you ready?", Markup.keyboard(["Show"]).resize().extra());
});

bot.hears("Show", async (ctx) => {
  await Axios.get("https://japi.ohori.me/nsfw?as=api")
  .then(async output => {
    await ctx.replyWithPhoto(output.data.image.proxyURL);
  }).catch(async function(){
    await ctx.reply("Oops! I lost the photo, try again <3");
  });
});

bot.launch();

app.listen(process.env.port, () => {
  console.log(`[WEB]: Website ready! Port - ${process.env.port}`);
});