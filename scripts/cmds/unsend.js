const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "unsend",
    aliases: ["u", "uns"],
    version: "1.0.0",
    author: "SK-SIDDIK-KHAN",
    role: 0, 
    description: "Deletes a message by replying to it.",
    category: "utility",
    guide: "Reply to a message with: unsend",
    prefix: false
  },

  async onStart({ bot, message, msg, chatId }) {
    const replyMsg = msg.reply_to_message;

    if (!replyMsg) {
      return message.reply("⚠️ Please reply to the message you want to unsend");
    }

    try {
      await bot.deleteMessage(chatId, replyMsg.message_id);
      await bot.deleteMessage(chatId, msg.message_id);
    } catch (error) {
      console.error("Error deleting message:", error);

      if (error.response && error.response.body) {
        if (error.response.body.description.includes("message can't be deleted")) {
          return message.reply("❌ I cannot delete this message. It might be too old or not sent by me.");
        }
      }

      return message.reply(`❌ An unexpected error occurred: ${error.message}`);
    }
  }
};
