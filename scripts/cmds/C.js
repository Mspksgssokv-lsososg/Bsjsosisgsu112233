module.exports = {
    config: {
        name: "autoreply"
    },

    onChat: async ({ bot, chatId, text }) => {

        if (text.toLowerCase() === "hi") {
            bot.sendMessage(chatId, "Hello 👋");
        }

        if (text.includes("bot")) {
            bot.sendMessage(chatId, "I'm here 🤖");
        }

    }
};
