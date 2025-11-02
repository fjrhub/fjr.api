import fs from "fs";
import path from "path";

const __dirname = process.cwd();
const commands = new Map();

// 🔁 Load semua command di folder commands
function loadCommands(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      loadCommands(fullPath);
    } else if (file.endsWith(".js")) {
      const command = require(fullPath);
      if (command.name && typeof command.execute === "function") {
        commands.set(command.name, command);

        // Alias optional
        if (Array.isArray(command.aliases)) {
          for (const alias of command.aliases) commands.set(alias, command);
        }
      }
    }
  }
}

// Jalankan sekali di awal
loadCommands(path.join(__dirname, "commands"));

// 🔧 Handle pesan masuk
export async function handleMessage(ctx) {
  const text = ctx.message?.text;
  if (!text) return;

  // Jika command
  if (text.startsWith("/")) return handleCommand(ctx);

  // Jalankan handler otomatis kalau ada
  const autoHandler = commands.get("auto");
  if (autoHandler) {
    try {
      await autoHandler.execute(ctx);
    } catch (err) {
      console.error("Auto handler error:", err);
    }
  }
}

// 🔨 Handle command
export function handleCommand(ctx) {
  const text = ctx.message.text;
  const args = text.slice(1).split(/ +/);
  let commandName = args.shift().toLowerCase();

  const at = commandName.indexOf("@");
  if (at !== -1) commandName = commandName.slice(0, at);

  const command = commands.get(commandName);
  if (!command) return;

  try {
    command.execute(ctx, args);
  } catch (err) {
    console.error(`Command "${commandName}" error:`, err);
    ctx.reply("⚠️ Error executing command.");
  }
}

// 🎯 Handle callback
export async function handleCallback(ctx) {
  const data = ctx.callbackQuery?.data;
  if (!data) return;

  const [prefix] = data.split(":");
  const command = commands.get(prefix);
  if (!command || typeof command.handleCallback !== "function")
    return ctx.answerCallbackQuery({ text: "❌ Unrecognized action." });

  try {
    await command.handleCallback(ctx);
  } catch (err) {
    console.error(`Callback "${prefix}" error:`, err);
    ctx.answerCallbackQuery({ text: "⚠️ Error while handling action." });
  }
}