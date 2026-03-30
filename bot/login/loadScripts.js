"use strict";

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const RESTART_CODE = 0;
const RESTART_FILE = path.join(__dirname, "../../restart.json");

/**
 * Restart bot safely
 * @param {string} chatId - optional chatId to notify on restart
 */
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

/**
 * Install missing npm modules automatically
 */
function installAutoModules() {
  if (global.__autoInstall) return; // prevent multiple installs
  global.__autoInstall = true;

  const originalRequire = module.constructor.prototype.require;

  module.constructor.prototype.require = function (moduleName) {
    try {
      return originalRequire.call(this, moduleName);
    } catch (error) {
      // Only handle missing npm modules (not local files)
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

// Exports
exports.restartBot = restartBot;
exports.RESTART_FILE = RESTART_FILE;
exports.install = installAutoModules;

// Auto-install on first load
if (!global.__autoInstall) {
  installAutoModules();
}
