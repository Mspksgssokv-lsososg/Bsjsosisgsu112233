const moment = require('moment-timezone');

module.exports = {
    config: {
        name: "info",
        aliases: ["owner"],
        version: "1.0.0",
        cooldown: 5,
        role: 0,
        author: "SK-SIDDIK-KHAN",
        usePrefix: true,
        description: "Owner information",
        category: "owner",
        guide: "{p}info"
    },

    onStart: async ({ bot, msg, chatId, message }) => {
        try {
            const botName = "SIDDIK-BOT";
            const botPrefix = "/";
            const authorName = "SK-SIDDIK-KHAN";
            const ownAge = "18";
            const teamName = "VAI BROTHER ADDA";
            const authorFB = "https://m.me/SK.SIDDIK.HERE";
            const authortg = "https://t.me/busy1here";
            const link = "https://files.catbox.moe/gct1ii.jpg";

            const now = moment().tz('Asia/Dhaka');
            const date = now.format('MMMM Do YYYY');
            const time = now.format('h:mm:ss A');

            const uptime = process.uptime();
            const seconds = Math.floor(uptime % 60);
            const minutes = Math.floor((uptime / 60) % 60);
            const hours = Math.floor((uptime / (60 * 60)) % 24);
            const days = Math.floor(uptime / (60 * 60 * 24));
            const uptimeString = `${days} d ${hours} h ${minutes} m ${seconds} s`;

            const buttons = {
                inline_keyboard: [
                    [
                        { text: "Facebook", url: "https://m.me/SK.SIDDIK.HERE" },
                        { text: "Telegram", url: "https://t.me/busy1here" }
                    ]
                ]
            };

            const caption = `♡   ∩_∩
 („• ֊ •„)♡
╭─∪∪───────────⟡
├‣ Bot & Owner Info
├──────────────⟡
├‣ Bot Name: ${botName}
├‣ Bot Prefix: ${botPrefix}
├‣ Owner: ${authorName}
├‣ Age: ${ownAge}
├‣ Fb: ${authorFB}
├‣ Tg: ${authortg}
├‣ Date: ${date}
├‣ Time: ${time}
├‣ Team: ${teamName}
├‣ Up: ${uptimeString}
╰──────────────⟡`;

            const sentMsg = await bot.sendPhoto(chatId, link, { caption, reply_markup: buttons });

            setTimeout(() => {
                bot.deleteMessage(chatId, sentMsg.message_id).catch(() => {});
            }, 40000);

        } catch (error) {
            console.error("Error in info command:", error);
            bot.sendMessage(chatId, "⚠️ An error occurred while fetching info");
        }
    }
};
