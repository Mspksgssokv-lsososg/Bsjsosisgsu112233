"use strict";

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const RESTART_FILE = path.join(__dirname, "../../restart.json");

function restartBot(chatId) {
  if (chatId) fs.writeFileSync(RESTART_FILE, JSON.stringify({ chatId }));
  console.log("Bot restarting now...");
  process.exit(0);
}

function loadScripts() {
  const cmdsDir = path.join(process.cwd(), "cmds");
  const eventsDir = path.join(process.cwd(), "events");

  // Load commands
  if (!fs.existsSync(cmdsDir)) console.warn("Commands folder not found:", cmdsDir);
  else {
    const cmdFiles = fs.readdirSync(cmdsDir).filter(f => f.endsWith(".js"));
    for (const file of cmdFiles) {
      try {
        const cmd = require(path.join(cmdsDir, file));
        if (cmd.config?.name) {
          global.config.cmds.set(cmd.config.name.toLowerCase(), cmd);
          console.log(`[COMMAND LOADED] ${file}`);
        } else console.warn(`[SKIP] ${file} missing config.name`);
      } catch (err) {
        console.error(`[ERROR] Failed to load ${file}: ${err.message}`);
      }
    }
  }

  // Load events
  if (!fs.existsSync(eventsDir)) console.warn("Events folder not found:", eventsDir);
  else {
    const eventFiles = fs.readdirSync(eventsDir).filter(f => f.endsWith(".js"));
    for (const file of eventFiles) {
      try {
        const ev = require(path.join(eventsDir, file));
        if (ev.config?.name) {
          global.config.events.set(ev.config.name.toLowerCase(), ev);
          console.log(`[EVENT LOADED] ${file}`);
        } else console.warn(`[SKIP] ${file} missing config.name`);
      } catch (err) {
        console.error(`[ERROR] Failed to load event ${file}: ${err.message}`);
      }
    }
  }
}

// Auto npm install if missing
function installHook() {
  const originalRequire = module.constructor.prototype.require;
  module.constructor.prototype.require = function (moduleName) {
    try { return originalRequire.call(this, moduleName); }
    catch (err) {
      if (err.code === "MODULE_NOT_FOUND" && !moduleName.startsWith(".") && !moduleName.startsWith("/")) {
        console.log(`Installing missing module '${moduleName}'...`);
        execSync(`npm install ${moduleName}`, { stdio: "inherit", cwd: process.cwd() });
        console.log(`Installed '${moduleName}', restarting bot...`);
        restartBot();
        return originalRequire.call(this, moduleName);
      }
      throw err;
    }
  };
}

if (!global.install) { installHook(); global.install = true; }

module.exports = { loadScripts, restartBot, RESTART_FILE };
