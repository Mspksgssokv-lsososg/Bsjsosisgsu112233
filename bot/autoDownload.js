const axios = require("axios");
const { alldown } = require("nayan-media-downloaders");

module.exports = (bot) => {
  bot.on("message", async (msg) => {
    const chatId = msg.chat?.id || msg.from?.id;
    if (!chatId || !msg.text) return;

    const link = msg.text.match(/https?:\/\/[^\s]+/)?.[0];
    if (!link) return;

    let waitMsg;
    try {
      waitMsg = await bot.sendMessage(chatId, "⏳ 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗶𝗻𝗴 𝗣𝗹𝗲𝗮𝘀𝗲 𝗪𝗮𝗶𝘁...");

      const res = await alldown(link);
      if (!res || !res.data) throw new Error("Invalid downloader response");

      const data = res.data;
      const videoUrl = data.high || data.low || data.url;
      if (!videoUrl) throw new Error("No downloadable video found");

      const videoTitle = data.title || "No Title Found";

      const vidResponse = await axios.get(videoUrl, { responseType: "stream", timeout: 60000 });

      const caption = `
╭─〔 𝗠𝗘𝗗𝗜𝗔 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥 〕─╮
┃
┃ 🎬 𝗧𝗶𝘁𝗹𝗲 : ${videoTitle}
┃ ⚡ 𝗦𝘁𝗮𝘁𝘂𝘀 : ✅ 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱 𝗖𝗼𝗺𝗽𝗹𝗲𝘁𝗲𝗱
┃ 💡 𝗧𝗶𝗽 : Contact admin if any issue
┃
╰─〔 𝗦𝗜𝗗𝗗𝗜𝗞-𝗕𝗢𝗧 〕─╯`;

      const replyMarkup = {
        inline_keyboard: [
          [{ text: "𝗖𝗢𝗡𝗧𝗔𝗖𝗧 𝗡𝗢𝗪", url: "https://t.me/busy1here" }]
        ]
      };

      if (waitMsg?.message_id) await bot.deleteMessage(chatId, waitMsg.message_id).catch(() => {});

      await bot.sendVideo(chatId, vidResponse.data, {
        caption,
        parse_mode: "Markdown",
        reply_markup: replyMarkup
      });

    } catch (error) {
      if (waitMsg?.message_id) {
        await bot.editMessageText(`❌ Error: ${error.message}`, { chat_id: chatId, message_id: waitMsg.message_id }).catch(() => {});
      } else {
        bot.sendMessage(chatId, `❌ Error: ${error.message}`);
      }
    }
  });
};
