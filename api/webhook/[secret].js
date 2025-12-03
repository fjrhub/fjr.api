import { Bot } from "grammy";
import dotenv from "dotenv";
import { setupBot } from "../../../handler.js";

dotenv.config({ path: ".env.local" });

const BOT_TOKEN = process.env.BOT_TOKEN;
const SECRET = process.env.TELEGRAM_SECRET;
const MODE = process.env.TELEGRAM_MODE || "webhook";

if (!BOT_TOKEN || !SECRET) throw new Error("BOT_TOKEN atau TELEGRAM_SECRET wajib!");

const bot = global._botInstance ?? new Bot(BOT_TOKEN);
global._botInstance = bot;

// Load semua command cuma sekali
if (!global._commandsLoaded) {
  await setupBot(bot);
  global._commandsLoaded = true;
}

export default async function handler(req, res) {
  const { secret } = req.query;

  // Validasi secret URL
  if (secret !== SECRET) return res.status(403).send("Forbidden");

  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  try {
    if (!bot.isInited()) await bot.init();
    await bot.handleUpdate(req.body);
    return res.status(200).send("OK");
  } catch (err) {
    console.error("Webhook Error:", err);
    return res.status(500).send("Internal Server Error");
  }
}

// MODE polling tidak dijalankan di Vercel
