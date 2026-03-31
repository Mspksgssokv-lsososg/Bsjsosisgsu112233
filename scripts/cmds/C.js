module.exports = {
  config: { name: "autoreply", cooldown: 3 },

  onChat: async ({ bot, chatId, text }) => {
    if (!text) return;
    const lower = text.toLowerCase();
    if (lower === "hi") bot.sendMessage(chatId, "Hello 👋");
    if (lower.includes("bot")) bot.sendMessage(chatId, "I'm here 🤖");
  },

  run: async ({ bot, chatId, args }) => {
    if (args[0] === "ping") bot.sendMessage(chatId, "Pong! 🏓");
  }
};
