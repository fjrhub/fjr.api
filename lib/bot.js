import { Bot } from "grammy";

const token = process.env.BOT_TOKEN;

const bot = global.bot ?? new Bot(token);
global.bot = bot;

if (!bot._ready) {
  bot.command("start", (ctx) => ctx.reply("🤖 Bot aktif di Vercel!"));
  bot.command("ping", (ctx) => ctx.reply("🏓 Pong!"));
  bot._ready = true;
}

export default bot;
