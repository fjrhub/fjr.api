import { Bot } from "grammy";

const token = process.env.BOT_TOKEN;
if (!token) throw new Error("Missing BOT_TOKEN in environment variables");

let bot;

// Pastikan hanya satu instance bot yang dibuat
if (!global._botInstance) {
  global._botInstance = new Bot(token);
}

bot = global._botInstance;

export default bot;
