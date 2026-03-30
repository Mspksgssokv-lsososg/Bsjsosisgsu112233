const fs = require("fs");
const path = require("path");

const cacheDir = path.join(__dirname, "Siddik");
const restartFile = path.join(cacheDir, "restart.txt");

module.exports = {
  name: "restart",
  role: 3,
  description: "Restart the bot safely and notify the user",

  // Command trigger (like onStart)
  onStart: async ({ bot, message }) => {
    const chatId = message.chat.id;

    try {
      const startTime = Date.now();

      // Ensure cache folder exists
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

      // Save restart info
      fs.writeFileSync(restartFile, `${chatId} ${startTime}`);

      // Send restarting message
      const sentMsg = await bot.sendMessage(chatId, "🔄 | Restarting the bot...");

      // Soft restart simulation
      setTimeout(async () => {
        try {
          const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

          // ✅ Send final message
          await bot.sendMessage(chatId, `✅ | Bot restarted\n⏰ | Time: ${elapsed}s`);

          // ❌ Delete previous message
          await bot.deleteMessage(chatId, sentMsg.message_id).catch(err => {
            console.error("Delete failed:", err.message);
          });

          // Remove restart file
          if (fs.existsSync(restartFile)) fs.unlinkSync(restartFile);
        } catch (err) {
          console.error("Restart handling error:", err.message);
        }
      }, 1500);

    } catch (err) {
      console.error("Restart command error:", err.message);
      bot.sendMessage(chatId, "❌ | Restart failed");
    }
  },

  // onLoad: notify if bot restarted
  onLoad: async ({ bot }) => {
    try {
      if (fs.existsSync(restartFile)) {
        const content = fs.readFileSync(restartFile, "utf-8").trim();
        const [chatId, oldTime] = content.split(" ");
        const elapsed = ((Date.now() - Number(oldTime)) / 1000).toFixed(2);

        await bot.sendMessage(chatId, `✅ | Bot restarted\n⏰ | Time: ${elapsed}s`);

        fs.unlinkSync(restartFile);
      }
    } catch (err) {
      console.error("onLoad restart notification failed:", err.message);
    }
  },
};
