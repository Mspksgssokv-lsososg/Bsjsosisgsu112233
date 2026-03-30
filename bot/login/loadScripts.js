"use strict";

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const RESTART_CODE = 0;
const RESTART_FILE = path.join(__dirname, "../../restart.json");

function restartBot(chatId) {
  if (chatId) {
    try {
      fs.writeFileSync(RESTART_FILE, JSON.stringify({ chatId }));
    } catch (err) {
      console.error("Failed to write restart file:", err);
    }
  }
  console.log("Bot restarting now...");
  process.exit(RESTART_CODE);
}

function installAutoModules() {
  if (global.__autoInstall) return; 
  global.__autoInstall = true;

  const originalRequire = module.constructor.prototype.require;

  module.constructor.prototype.require = function (moduleName) {
    try {
      return originalRequire.call(this, moduleName);
    } catch (error) {
      if (
        error.code === "MODULE_NOT_FOUND" &&
        !moduleName.startsWith(".") &&
        !moduleName.startsWith("/")
      ) {
        console.log(`NPM module '${moduleName}' not found. Installing...`);
        try {
          execSync(`npm install ${moduleName}`, {
            stdio: "inherit",
            cwd: process.cwd(),
          });
          console.log(`Successfully installed '${moduleName}'. Restarting bot...`);
          restartBot();
          return originalRequire.call(this, moduleName);
        } catch (installError) {
          console.error(`Failed to install '${moduleName}':`, installError.message);
          throw installError;
        }
      }
      throw error;
    }
  };
}

// **New function exported for main.js**
function loadScripts() {
  console.log("Loading scripts...");
  // এখানে তুমি যে script লোড করতে চাও, তা লিখো
  // উদাহরণ:
  // const cmds = require("./commands");
  // global.config.cmds = cmds;
}

exports.loadScripts = loadScripts; // <-- এটা main.js-এ কল করার জন্য দরকার
exports.restartBot = restartBot;
exports.install = installAutoModules;
exports.RESTART_FILE = RESTART_FILE;

// Auto-install modules
if (!global.__autoInstall) {
  installAutoModules();
}
