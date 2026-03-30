module.exports = {
  config: {
    name: "slashpost",
    version: "1.0.0",
    author: "RAKIB MAHMUD",
    description: "Send Islamic post on /",
    category: "utility",
    prefix: false // auto-run on "/"
  },

  onStart: async function ({ bot, message }) {
    try {
      const chatId = message.chat.id;

      const data = [
        {
          caption: "🦋🥀࿐\nহাজারো স্বপ্নের শেষ স্থান কবরস্থান🙂🤲🥀",
          img: "https://i.postimg.cc/Y0wvTzr6/images-29.jpg"
        },
        {
          caption: "আল্লাহর ভালোবাসা পেতে চাও?\nরাসুল (সা:) কে অনুসরণ করো🥰",
          img: "https://i.postimg.cc/1Rpnw2BJ/images-28.jpg"
        }
      ];

      // Random image selection
      const random = data[Math.floor(Math.random() * data.length)];

      // Send photo
      const sentMsg = await bot.sendPhoto(chatId, random.img, {
        caption: random.caption
      });

      // Register reply data for reply.js system
      if (!global.config.replies) global.config.replies = new Map();
      global.config.replies.set(sentMsg.message_id, { commandName: "slashpost" });

    } catch (error) {
      console.error("Error sending photo:", error);
    }
  },

  onReply: async function ({ bot, chatId, replyMsg, userId }) {
    await bot.sendMessage(chatId, `🌸 Thanks for replying, user ${userId}!`, {
      reply_to_message_id: replyMsg.message_id
    });
  }
};
