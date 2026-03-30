const fs = require("fs");
const path = require("path");

const cacheDir = path.join(__dirname, "Siddik");
const restartTxt = path.join(cacheDir, "restart.txt");

module.exports.config = {
  name: "restart",
  aliases: [],
  version: "1.0.1",
  role: 3, // Admin
  author: "dipto",
  description: "Restart the bot.",
  usePrefix: true,
  guide: "",
  category: "Admin",
  countDown: 5,
};

// Ensure cacheDir exists
const ensureCacheDir = () => {
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
};

// Bot on load: notify restart if needed
module.exports.onLoad = async ({ bot }) => {
  try {
    ensureCacheDir();

    if (fs.existsSync(restartTxt)) {
      const content = fs.readFileSync(restartTxt, "utf-8").trim();
      const [chatId, oldTime] = content.split(" ");
      const elapsed = ((Date.now() - Number(oldTime)) / 1000).toFixed(2);
      await bot.sendMessage(chatId, `✅ | Bot restarted!\n⏰ | Time: ${elapsed}s`);
      fs.unlinkSync(restartTxt);
    }
  } catch (err) {
    console.error("Error in restart onLoad:", err);
  }
};

// Restart command
module.exports.onStart = async ({ message, chatId }) => {
  try {
    ensureCacheDir();

    // Save restart info for notification
    fs.writeFileSync(restartTxt, `${chatId} ${Date.now()}`);

    await message.reply("🔄 | Restarting the bot...");

    // Exit process to let pm2 or another manager restart the bot
    process.exit(0);
  } catch (err) {
    console.error("Restart command error:", err);
    message.reply("❌ | Error occurred while restarting");
  }
};
