const fs = require('fs');
const path = require('path');

const cacheDir = path.join(__dirname, 'Siddik');
const restartTxt = path.join(cacheDir, 'restart.txt');

module.exports.config = {
  name: "restart",
  aliases: [],
  version: "1.0.0",
  role: 3,
  author: "SK-SIDDIK-KHAN",
  description: "Restart the bot.",
  usePrefix: true,
  guide: "",
  category: "Admin",
  countDown: 5,
};

module.exports.onLoad = async ({ bot }) => {
  try {
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    if (fs.existsSync(restartTxt)) {
      const content = fs.readFileSync(restartTxt, "utf-8").trim().split(" ");
      const chatId = content[0];
      const oldtime = Number(content[1]);
      if (chatId && oldtime) {
        const elapsed = ((Date.now() - oldtime) / 9000).toFixed(3);
        await bot.sendMessage(chatId, `✅ | Bot restarted\n⏰ | Time: ${elapsed}s`);
      }
      fs.unlinkSync(restartTxt);
    }
  } catch (err) {
    console.error("Error in restart onLoad:", err);
  }
};

module.exports.onStart = async ({ message, chatId }) => {
  try {
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    fs.writeFileSync(restartTxt, `${chatId} ${Date.now()}`);

    await message.reply("🔄 | Restarting the bot...");
    process.exit(1); 
  } catch (error) {
    console.error("Restart command error:", error);
    message.reply("❌ | Error occurred while restarting");
  }
};
