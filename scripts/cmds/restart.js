module.exports = {
  name: "restart",
  role: 3,
  description: "Restart the bot safely and notify the user",

  run: async ({ bot, message }) => {
    const chatId = message.chat.id;

    try {
      const startTime = Date.now();

      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
      fs.writeFileSync(restartFile, `${chatId} ${startTime}`);

      const sentMsg = await bot.sendMessage(chatId, "🔄 | Restarting the bot...");

      setTimeout(async () => {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
        await bot.sendMessage(chatId, `✅ | Bot restarted\n⏰ | Time: ${elapsed}s`);
        await bot.deleteMessage(chatId, sentMsg.message_id).catch(() => {});
        if (fs.existsSync(restartFile)) fs.unlinkSync(restartFile);
      }, 1500);

    } catch (err) {
      console.error(err);
      bot.sendMessage(chatId, "❌ | Restart failed");
    }
  },

  onLoad: async ({ bot }) => {
    try {
      if (fs.existsSync(restartFile)) {
        const [chatId, oldTime] = fs.readFileSync(restartFile, "utf-8").trim().split(" ");
        const elapsed = ((Date.now() - Number(oldTime)) / 1000).toFixed(2);
        await bot.sendMessage(chatId, `✅ | Bot restarted\n⏰ | Time: ${elapsed}s`);
        fs.unlinkSync(restartFile);
      }
    } catch (err) {
      console.error("onLoad restart notification failed:", err.message);
    }
  },
};
