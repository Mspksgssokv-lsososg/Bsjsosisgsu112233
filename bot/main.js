"use strict";

const fs = require('fs');
const path = require('path');
const { loadScripts, RESTART_FILE } = require('./login/loadScripts');
const { utils } = require('../func/utils.js');

const configPath = path.join(process.cwd(), 'config.json');
const tokenPath = path.join(process.cwd(), 'token.txt');

if (!fs.existsSync(configPath) || !fs.existsSync(tokenPath)) {
  console.error("Error: config.json or token.txt not found in the root directory.");
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const token = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));

global.config = {
  ...config,
  cmds: new Map(),
  cooldowns: new Map(),
  replies: new Map(),
  callbacks: new Map(),
  events: new Map()
};

global.token = token;
global.scripts = utils;

utils();
loadScripts(); // load commands & events

const { login } = require('./login/log');
const botInstance = login();

/* =========================
   🔥 ON CHAT HANDLER
========================= */
botInstance.on("message", async (msg) => {
  try {
    if (!msg.text) return;

    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const text = msg.text.trim();

    // 🔹 run all onChat handlers from loaded commands
    for (const cmd of global.config.cmds.values()) {
      if (typeof cmd.onChat === "function") {
        try {
          await cmd.onChat({
            bot: botInstance,
            msg,
            chatId,
            userId,
            text
          });
        } catch (err) {
          console.error(`onChat error in ${cmd.config?.name}:`, err);
        }
      }
    }

    // 🔹 COMMAND HANDLER (prefix based)
    const prefix = global.config.prefix || "!";

    if (!text.startsWith(prefix)) return;

    const args = text.slice(prefix.length).split(/ +/);
    const cmdName = args.shift().toLowerCase();

    const command = global.config.cmds.get(cmdName);
    if (!command) return;

    // cooldown system
    const now = Date.now();
    const cooldown = command.config?.cooldown || 3;
    const timestamps = global.config.cooldowns;

    if (!timestamps.has(cmdName)) timestamps.set(cmdName, new Map());

    const userCooldowns = timestamps.get(cmdName);
    const expirationTime = userCooldowns.get(userId) || 0;

    if (now < expirationTime) {
      const timeLeft = ((expirationTime - now) / 1000).toFixed(1);
      return botInstance.sendMessage(chatId, `⏳ Wait ${timeLeft}s before using this command again.`);
    }

    userCooldowns.set(userId, now + cooldown * 1000);

    // execute command
    if (typeof command.run === "function") {
      await command.run({
        bot: botInstance,
        msg,
        args,
        chatId,
        userId
      });
    }

  } catch (err) {
    console.error("❌ Error in message handler:", err);
  }
});

/* =========================
   🔁 RESTART MESSAGE
========================= */
if (fs.existsSync(RESTART_FILE)) {
  try {
    const data = JSON.parse(fs.readFileSync(RESTART_FILE, 'utf8'));
    if (data.chatId) {
      botInstance.sendMessage(data.chatId, "✅ Bot restarted successfully.");
    }
  } catch (err) {
    console.error("Failed to send restart confirmation:", err);
  }
  fs.unlinkSync(RESTART_FILE);
}
