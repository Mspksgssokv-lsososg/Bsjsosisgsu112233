const axios = require('axios');
const { alldown } = require('nayan-media-downloaders');

module.exports = {
  config: {
    name: "alldown",
    author: "SK-SIDDIK-KHAN (Styled Fixed)",
    description: "Auto Video Downloader",
    category: "media",
    usage: "auto",
    usePrefix: false,
  },

  onStart: async ({ bot, chatId, args, messageId }) => {
    const link = args[0];

    if (!link || !link.startsWith("http")) {
      return bot.sendMessage(chatId, "❌ Please provide a valid url");
    }

    let waitMsg;
    try {
      waitMsg = await bot.sendMessage(
        chatId,
        "⏳ 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗜𝗡𝗚...\n━━━━━━━━━━━━━━━",
        { reply_to_message_id: messageId }
      );

      const res = await alldown(link);

      if (!res || !res.data) {
        throw new Error("Invalid response from API");
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
          [
            { text: "📞 CONTACT ADMIN", url: "https://t.me/busy1here" }
          ]
        ]
      };

      const caption = `
╭━━━〔 🎬 MEDIA DOWNLOADER 〕━━━╮
┃
┃ 🎬 Title : ${videoTitle}
┃ ⚡ Status : ✅ Completed
┃ 💡 Tip : Contact admin if any issue
┃
╰━━━〔 🤖 SIDDIK BOT 〕━━━╯`;

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
