import { Bot } from "grammy";

const token = process.env.BOT_TOKEN;
const bot = global.bot ?? new Bot(token);
global.bot = bot;

// Jalankan hanya sekali
if (!bot._ready) {
  bot.command("start", (ctx) => ctx.reply("🤖 Bot aktif di Vercel!"));
  bot.command("ping", (ctx) => ctx.reply("🏓 Pong!"));

  // Init sekali biar tidak error Bot not initialized
  bot.init()
    .then(() => console.log("✅ Bot initialized"))
    .catch((err) => console.error("❌ Failed to init bot:", err));

  bot._ready = true;
}

export default bot;
