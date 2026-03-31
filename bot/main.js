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
loadScripts(); // Load cmds + events

const { login } = require('./login/log');
const botInstance = login();

// =========================
// 🔥 ON CHAT HANDLER
// =========================
botInstance.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text || "";

  // Run all onChat handlers from cmds
  for (const cmd of global.config.cmds.values()) {
    if (cmd.onChat) {
      try {
        await cmd.onChat({ bot: botInstance, chatId, text, msg });
      } catch (err) {
        console.error(`onChat error in ${cmd.config?.name}:`, err);
      }
    }
  }

  // Prefix-based commands
  const prefix = global.config.prefix || "!";
  if (!text.startsWith(prefix)) return;

  const args = text.slice(prefix.length).trim().split(/ +/);
  const cmdName = args.shift().toLowerCase();

  const command = global.config.cmds.get(cmdName);
  if (command && command.run) {
    try {
      await command.run({ bot: botInstance, chatId, args, msg });
    } catch (err) {
      console.error(`Command ${cmdName} error:`, err);
    }
  }
});

// =========================
// 🔁 RESTART MESSAGE
// =========================
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
