const axios = require('axios');
const { alldown } = require('nayan-media-downloaders');

module.exports = {
  config: {
    name: "alldwn",
    author: "SK-SIDDIK-KHAN",
    description: "Auto Video Downloader for any link",
    category: "media",
  },

  onMessage: async ({ bot, chatId, message, messageId }) => {
    const text = message?.text;
    if (!text || !text.includes("http")) return;

    const linkMatch = text.match(/https?:\/\/[^\s]+/g);
    if (!linkMatch) return;
    const link = linkMatch[0];

    const waitMsg = await bot.sendMessage(chatId, "⏳ 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗶𝗻𝗴 𝗣𝗹𝗲𝗮𝘀𝗲 𝗪𝗮𝗶𝘁", {
      reply_to_message_id: messageId
    });

    try {
      const res = await alldown(link);
      const videoUrl = res.high || res.url || res.data?.high;
      const videoTitle = res.title || "No Title Found";

      if (!videoUrl) throw new Error("No downloadable video found");

      const response = await axios.get(videoUrl, { responseType: "arraybuffer" });
      const buffer = Buffer.from(response.data, "binary");

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

      await bot.sendVideo(chatId, buffer, {
        caption: caption,
        parse_mode: "Markdown",
        reply_to_message_id: messageId,
        reply_markup: JSON.stringify(replyMarkup)
      });

    } catch (error) {
      console.error("Auto-download error:", error);
      await bot.editMessageText(`❌ Error: ${error.message || "Failed to download."}`, {
        chat_id: chatId,
        message_id: waitMsg.message_id
      });
    }
  }
};
