const fs = require('fs');
const path = require('path');
const { login } = require('./login/log');
const { utils } = require('../func/utils.js');

const config = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'config.json'), 'utf8'));
const token = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'token.txt'), 'utf8'));

global.config = { ...config, cmds: new Map() };
global.token = token;
global.scripts = utils;

utils();

// load ig command
const igCmd = require('./cmds/ig.js');
global.config.cmds.set("ig", igCmd);
global.config.cmds.set("/", igCmd); // 🔥 / trigger

const botInstance = login();

// polling `/` command only
const POLL_INTERVAL = 1000;

async function poll() {
  try {
    const updates = await botInstance.getUpdates?.() || [];

    for (const msg of updates) {
      if (!msg.text) continue;

      const chatId = msg.chat.id;
      const text = msg.text.trim();

      if (text === "/") {
        const command = global.config.cmds.get("/");
        if (command) await command.onStart({ bot: botInstance, msg, chatId });
      }
    }
  } catch (err) {
    console.error("Polling Error:", err);
  } finally {
    setTimeout(poll, POLL_INTERVAL);
  }
}

poll();
