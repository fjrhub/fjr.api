import { Bot } from "grammy";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MODE = process.env.TELEGRAM_MODE || "webhook";
const BOT_TOKEN = process.env.BOT_TOKEN || "dummy-token"; // dummy-token untuk webhook

// ==========================
// Buat Bot instance
// ==========================
const bot = new Bot(BOT_TOKEN);

// Handler contoh
bot.command("start", (ctx) => ctx.reply("Bot aktif!"));
bot.on("message", (ctx) => ctx.reply("Pesan diterima ✔️"));

// ==========================
// Export handler top-level untuk Vercel webhook
// ==========================
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    await bot.handleUpdate(req.body);
    res.status(200).send("OK");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
}

// ==========================
// Jalankan polling jika MODE=polling
// ==========================
if (MODE === "polling") {
  if (!process.env.BOT_TOKEN) {
    throw new Error("BOT_TOKEN is required for polling mode!");
  }

  console.log("[BOT] Running in POLLING mode...");
  bot.start();
} else {
  console.log("[BOT] Webhook mode active (export default handler for Vercel)");
}
