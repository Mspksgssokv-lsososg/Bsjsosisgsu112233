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
  const cmdsDir = path.join(process.cwd(), "commands");

  if (!fs.existsSync(cmdsDir)) {
    console.warn("Commands folder not found:", cmdsDir);
    return;
  }

  const files = fs.readdirSync(cmdsDir).filter(f => f.endsWith(".js"));

  for (const file of files) {
    try {
      const cmd = require(path.join(cmdsDir, file));
      if (cmd.config?.name) {
        global.config.cmds.set(cmd.config.name.toLowerCase(), cmd);
        console.log(`[COMMAND LOADED] ${file}`);
      } else {
        console.warn(`[SKIP] ${file} missing config.name`);
      }
    } catch (err) {
      console.error(`[ERROR] Failed to load ${file}: ${err.message}`);
    }
  }
}

// Auto npm install if module missing
function installHook() {
  const originalRequire = module.constructor.prototype.require;

  module.constructor.prototype.require = function (moduleName) {
    try {
      return originalRequire.call(this, moduleName);
    } catch (err) {
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

if (!global.install) {
  installHook();
  global.install = true;
}

module.exports = { loadScripts, restartBot, RESTART_FILE };
