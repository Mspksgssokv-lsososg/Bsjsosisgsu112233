const axios = require('axios');
const { alldown } = require('nayan-media-downloaders');

module.exports = {
  config: {
    name: "alldown",
    author: "SK-SIDDIK-KHAN (Auto Modified)",
    description: "Auto Video Downloader",
    category: "media",
    usePrefix: false,
  },

  onChat: async ({ bot, chatId, message, messageId }) => {
    const text = message?.text;

    if (!text || !text.match(/https?:\/\/[^\s]+/)) return;

    const link = text.match(/https?:\/\/[^\s]+/)[0];

    let waitMsg;
    try {
      waitMsg = await bot.sendMessage(
        chatId,
        "⏳ 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗶𝗻𝗴 𝗣𝗹𝗲𝗮𝘀𝗲 𝗪𝗮𝗶𝘁...",
        { reply_to_message_id: messageId }
      );

      const res = await alldown(link);

      if (!res || !res.data) {
        throw new Error("Invalid response from downloader API");
      }

      const data = res.data;
      const videoUrl = data.high || data.low || data.url;

      if (!videoUrl) {
        throw new Error("No downloadable video found");
      }

      const videoTitle = data.title || "No Title Found";

      const vidResponse = await axios.get(videoUrl, {
        responseType: "stream",
        timeout: 60000
      });

      const replyMarkup = {
        inline_keyboard: [
          [{ text: "𝗖𝗢𝗡𝗧𝗔𝗖𝗧 𝗡𝗢𝗪", url: "https://t.me/busy1here" }]
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

      if (waitMsg?.message_id) {
        await bot.deleteMessage(chatId, waitMsg.message_id).catch(() => {});
      }

      await bot.sendVideo(chatId, vidResponse.data, {
        caption,
        parse_mode: "Markdown",
        reply_to_message_id: messageId,
        reply_markup: replyMarkup
      });

    } catch (error) {
      console.error("Download error:", error);

      const errorMsg = `❌ Error: ${error.message || "Failed to download."}`;

      if (waitMsg?.message_id) {
        await bot.editMessageText(errorMsg, {
          chat_id: chatId,
          message_id: waitMsg.message_id
        }).catch(() => {
          bot.sendMessage(chatId, errorMsg);
        });
      } else {
        bot.sendMessage(chatId, errorMsg);
      }
    }
  }
};
