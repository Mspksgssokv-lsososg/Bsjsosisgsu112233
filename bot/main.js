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

const { login } = require('./login/log');
const botInstance = login();

// Handle bot restart
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

// ===============================================
// 🔥 Custom message handler for `/` command
// ===============================================

// Polling interval (library independent)
const POLL_INTERVAL = 1000; // 1 second

async function pollMessages() {
  try {
    // Replace `getUpdates` with your library's fetch method if needed
    const updates = await botInstance.getUpdates?.() || []; 

    for (const msg of updates) {
      if (!msg.text) continue;
      const chatId = msg.chat.id;
      const text = msg.text.trim();

      // ✅ Run `ig` command on `/`
      if (text === "/") {
        const igCmd = global.config.cmds.get("ig");
        if (igCmd) {
          await igCmd.onStart({ bot: botInstance, msg, chatId });
        }
        continue;
      }

      // ✅ Run other commands starting with `/`
      if (text.startsWith("/")) {
        const args = text.slice(1).split(/ +/);
        const cmdName = args.shift().toLowerCase();
        const command = global.config.cmds.get(cmdName);
        if (command) {
          await command.onStart({ bot: botInstance, msg, chatId, args });
        }
      }
    }
  } catch (err) {
    console.error("💥 Polling Error:", err);
  } finally {
    setTimeout(pollMessages, POLL_INTERVAL);
  }
}

// Start polling
pollMessages();
