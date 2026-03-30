const axios = require('axios');
const { alldown } = require('nayan-media-downloaders');

module.exports = {
  config: {
    name: "alldown",
    usePrefix: false,       // auto onChat
    description: "Auto Video Downloader",
  },

  onChat: async ({ bot, chatId, message, messageId }) => {
    const text = message?.body || message?.text;
    if (!text) return;

    // detect first link in message
    const linkMatch = text.match(/https?:\/\/[^\s]+/);
    if (!linkMatch) return;

    const link = linkMatch[0];
    let waitMsg;

    try {
      // send waiting message
      waitMsg = await bot.sendMessage(chatId, "⏳ Downloading, please wait...", {
        reply_to_message_id: messageId
      });

      // fetch download data
      const res = await alldown(link);
      if (!res || !res.data) throw new Error("Failed to fetch download info.");

      const data = res.data;
      const videoUrl = data.high || data.low || data.url;
      if (!videoUrl) throw new Error("No downloadable video found.");

      const videoTitle = data.title || "No Title Found";

      // download video stream
      const vidResponse = await axios.get(videoUrl, {
        responseType: "stream",
        timeout: 60000
      });

      // optional reply button
      const replyMarkup = {
        inline_keyboard: [
          [{ text: "CONTACT ADMIN", url: "https://t.me/busy1here" }]
        ]
      };

      const caption = `
╭─〔 MEDIA DOWNLOADER 〕─╮
┃ 🎬 Title: ${videoTitle}
┃ ⚡ Status: ✅ Download Completed
┃ 💡 Tip: Contact admin if any issue
╰─〔 SIDDIK-BOT 〕─╯`;

      // delete waiting message
      if (waitMsg?.message_id) {
        await bot.deleteMessage(chatId, waitMsg.message_id).catch(() => {});
      }

      // send video
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
        }).catch(() => bot.sendMessage(chatId, errorMsg));
      } else {
        bot.sendMessage(chatId, errorMsg);
      }
    }
  }
};
