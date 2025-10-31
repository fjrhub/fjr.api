// lib/bot.js
const { Bot } = require("grammy");

const token = process.env.BOT_TOKEN;
if (!token) throw new Error("BOT_TOKEN is not defined");

let botInstance = global.__grammy_bot;

if (!botInstance) {
  const bot = new Bot(token);

  // Command sederhana
  bot.command("start", (ctx) => ctx.reply("Hello! Bot is running on Vercel 🚀"));
  bot.command("ping", (ctx) => ctx.reply("pong"));

  // Echo text
  bot.on("message:text", (ctx) => ctx.reply(`You said: ${ctx.message.text}`));

  bot.catch((err) => console.error("Bot error:", err));

  botInstance = bot;
  global.__grammy_bot = botInstance;
}

module.exports = botInstance;
