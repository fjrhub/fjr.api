import { Bot } from "grammy";
import dotenv from "dotenv";
import { setupBot } from "./handler.js";

dotenv.config({ path: ".env.local" });

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) throw new Error("BOT_TOKEN wajib!");

const bot = new Bot(BOT_TOKEN);

await setupBot(bot);
await bot.init();

console.log("Bot berjalan dalam mode polling...");
bot.start();
