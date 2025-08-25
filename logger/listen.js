const fs = require("fs");
const path = require("path");
const { Message } = require("../bot/custom.js");
const { command, registerCommand } = require("../bot/handle/command.js");

exports.listen = async function (bot) {
  const commandsPath = path.join(__dirname, "../scripts/cmds");
  if (fs.existsSync(commandsPath)) {
    const files = fs.readdirSync(commandsPath);
    for (const file of files) {
      if (file.endsWith(".js")) {
        const fullPath = path.join(commandsPath, file);
        delete require.cache[require.resolve(fullPath)];
        const cmdModule = require(fullPath);
        if (cmdModule && cmdModule.config && typeof cmdModule.onStart === "function") {
          registerCommand(cmdModule);
        } else {
          console.warn(`Command file ${file} is invalid.`);
        }
      }
    }
  }

  bot.on("message", async (msg) => {
    try {
      const chatId = msg.chat.id;
      const userId = msg.from.id;
      const message = new Message(bot, msg);

      await command({ bot, msg, chatId, userId, message });
    } catch (error) {
      console.error("Error in message handler:", error);
    }
  });
};
