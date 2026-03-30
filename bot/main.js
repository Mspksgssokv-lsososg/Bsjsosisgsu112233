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

// ================== 🔥 / handler START ==================
botInstance.on("message", async (msg) => {
  try {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (!text) return;

    // ✅ শুধু "/" দিলে ig command run
    if (text.trim() === "/") {
      const command = global.config.cmds.get("ig");
      if (command) {
        return command.onStart({ bot: botInstance, msg, chatId });
      }
    }

    // ✅ normal command system
    if (!text.startsWith("/")) return;

    const args = text.slice(1).trim().split(/ +/);
    const cmdName = args.shift().toLowerCase();

    const command = global.config.cmds.get(cmdName);

    if (!command) return;

    await command.onStart({ bot: botInstance, msg, chatId, args });

  } catch (err) {
    console.error("💥 Command Error:", err);
  }
});
// ================== 🔥 / handler END ==================
