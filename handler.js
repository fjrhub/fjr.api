import fs from "fs";
import path from "path";

/**
 * Auto-load semua command dari folder ./commands/**
 */
export async function setupBot(bot) {
  const commandsDir = path.join(process.cwd(), "commands");

  function load(dir) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);

      if (fs.statSync(fullPath).isDirectory()) {
        load(fullPath);
      } else if (item.endsWith(".js")) {
        import(fullPath).then((mod) => {
          if (typeof mod.default === "function") {
            mod.default(bot);
          }
        });
      }
    }
  }

  load(commandsDir);
}
