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

// Global bot configuration
global.config = {
  ...config,
  prefix: config.prefix || "/",  // default prefix
  cmds: new Map(),
  cooldowns: new Map(),
  replies: new Map(),
  callbacks: new Map(),
  events: new Map()
};

global.token = token;
global.scripts = utils;

// Load user-defined scripts/modules
utils();
loadScripts();

const { login } = require('./login/log');
const botInstance = login();

// Handle bot restart message
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

/**
 * Full onChat system
 * Handles prefix commands, automatic replies, cooldowns, and plugin events
 */
function onChat(chat) {
  try {
    const chatId = chat.chatId;
    const message = chat.body || chat.text || "";
    const fromMe = chat.fromMe || false;

    if (fromMe || !message) return;

    const args = message.trim().split(/\s+/);
    const commandName = args[0].startsWith(global.config.prefix)
      ? args[0].slice(global.config.prefix.length).toLowerCase()
      : null;

    // -----------------------------
    // 1️⃣ Run prefix commands
    // -----------------------------
    if (commandName && global.config.cmds.has(commandName)) {
      const handler = global.config.cmds.get(commandName);

      // Cooldown system
      const now = Date.now();
      const cooldowns = global.config.cooldowns;
      if (!cooldowns.has(commandName)) cooldowns.set(commandName, new Map());
      const timestamps = cooldowns.get(commandName);
      const cooldownAmount = (handler.cooldown || 3) * 1000;

      if (timestamps.has(chatId)) {
        const expirationTime = timestamps.get(chatId) + cooldownAmount;
        if (now < expirationTime) {
          const timeLeft = ((expirationTime - now) / 1000).toFixed(1);
          botInstance.sendMessage(chatId, `⏳ Please wait ${timeLeft}s before using this command again.`);
          return;
        }
      }

      timestamps.set(chatId, now);
      setTimeout(() => timestamps.delete(chatId), cooldownAmount);

      // Execute command
      handler({ chat, args, bot: botInstance });
      return;
    }

    // -----------------------------
    // 2️⃣ Run plugin-based onChat events
    // -----------------------------
    for (const [, script] of global.config.events) {
      if (typeof script.onChat === "function") {
        script.onChat({
          bot: botInstance,
          chatId,
          message: chat,
          messageId: chat.message_id
        });
      }
    }

    // -----------------------------
    // 3️⃣ Handle automatic replies
    // -----------------------------
    const lowerMessage = message.toLowerCase();
    if (global.config.replies.has(lowerMessage)) {
      const reply = global.config.replies.get(lowerMessage);
      botInstance.sendMessage(chatId, reply);
    }

    // Optional: log unhandled messages
    console.log(`[${chatId}] Message received: ${message}`);

  } catch (err) {
    console.error("Error handling chat message:", err);
  }
}

// Attach the listener
botInstance.on('message', onChat);

console.log("✅ Bot is running...");
