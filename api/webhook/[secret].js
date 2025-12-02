import { Bot } from "grammy";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const BOT_TOKEN = process.env.BOT_TOKEN;
const SECRET = process.env.TELEGRAM_SECRET;

if (!BOT_TOKEN || !SECRET) throw new Error("BOT_TOKEN atau TELEGRAM_SECRET tidak diisi!");

const bot = global._botInstance ?? new Bot(BOT_TOKEN);
global._botInstance = bot;

// Contoh command
bot.command("start", (ctx) => ctx.reply("Bot aktif!"));
bot.on("message", (ctx) => ctx.reply("Pesan diterima ✔️"));

export default async function handler(req, res) {
  const { secret } = req.query; // ambil dari path /webhook/[secret]

  // Validasi secret
  if (secret !== SECRET) {
    return res.status(403).send("Forbidden: Invalid Secret");
  }

  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    if (!bot.isInited()) await bot.init();
    await bot.handleUpdate(req.body);
    return res.status(200).send("OK");
  } catch (err) {
    console.error("Handler error:", err);
    return res.status(500).send("Internal Server Error");
  }
}
