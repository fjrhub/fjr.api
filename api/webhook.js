import { Bot } from "grammy";

// ENV
const BOT_TOKEN = process.env.BOT_TOKEN;
const SECRET_HEADER = process.env.TELEGRAM_SECRET || "";

if (!BOT_TOKEN) throw new Error("BOT_TOKEN missing");
if (!SECRET_HEADER) throw new Error("TELEGRAM_SECRET missing");

// BOT SINGLETON
const bot = global._botInstance ?? new Bot(BOT_TOKEN);
global._botInstance = bot;

// Handlers
bot.command("start", (ctx) => ctx.reply("Bot aktif via webhook!"));
bot.on("message", (ctx) => ctx.reply("Pesan diterima ✔️"));

// FIX: baca body manual (Vercel requires this)
async function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(data || "{}"));
      } catch (err) {
        reject(err);
      }
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).send("Webhook OK");
  }

  // Secret check
  const headerSecret = req.headers["x-telegram-bot-api-secret-token"];
  if (headerSecret !== SECRET_HEADER) {
    return res.status(401).send("Unauthorized");
  }

  try {
    // Wajib init sebelum handleUpdate
    if (!bot.botInfo) await bot.init();

    const update = await readBody(req); // FIX BODY

    await bot.handleUpdate(update);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[WEBHOOK ERROR]", err);
    return res.status(500).send("Internal Server Error");
  }
}
