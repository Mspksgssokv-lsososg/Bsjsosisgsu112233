const axios = require('axios');
const { alldown } = require('nayan-media-downloaders');

module.exports = {
  config: {
    name: "alldown",
    author: "SK-SIDDIK-KHAN",
    description: "Auto Video Downloader",
    category: "media",
    usage: "/alldown <link>",
    usePrefix: true,
  },

  onStart: async ({ bot, chatId, args, messageId }) => {
    const link = args[0];
    if (!link || !link.startsWith("http")) {
      return bot.sendMessage(chatId, "❌ Please provide a valid url");
    }

    const waitMsg = await bot.sendMessage(chatId, "⏳ 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗶𝗻𝗴 𝗣𝗹𝗲𝗮𝘀𝗲 𝗪𝗮𝗶𝘁", { 
      reply_to_message_id: messageId, parse_mode: "Markdown" 
    });

    try {
      const res = await alldown(link);
      const { high, title } = res.data;
      const videoTitle = title || "No Title Found";

      const vidResponse = await axios.get(high, { responseType: "stream" });

      const replyMarkup = {
        inline_keyboard: [
          [{ text: '𝗖𝗢𝗡𝗧𝗔𝗖𝗧 𝗡𝗢𝗪', url: 'https://t.me/busy1here' }]
        ]
      };

      const caption = `
╭─〔 MEDIA DOWNLOADER 〕─╮
┃
┃ 🎬 𝗧𝗶𝘁𝗹𝗲 : ${videoTitle}
┃ ⚡ 𝗦𝘁𝗮𝘁𝘂𝘀 : ✅ Download Completed
┃ 💡 𝗧𝗶𝗽 : Contact admin if any issue
┃
╰─〔 SIDDIK-BOT 〕─╯`;

      await bot.deleteMessage(chatId, waitMsg.message_id);

      await bot.sendVideo(chatId, vidResponse.data, {
        caption: caption,
        parse_mode: "Markdown",
        reply_to_message_id: messageId,
        reply_markup: replyMarkup
      });

    } catch (error) {
      console.error("Download error:", error);
      await bot.editMessageText(`❌ Error: ${error.message || "Failed to download."}`, {
        chat_id: chatId,
        message_id: waitMsg.message_id
      });
    }
  }
};
