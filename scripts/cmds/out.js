module.exports.config = {
    name: "out",
    aliases: ["leave"],
    version: "1.0",
    credits: "SK-SIDDIK-KHAN",
    role: 2,
    usePrefix: false,
    description: "Make the bot leave the group",
    commandCategory: "utility",
    guide: { en: "out" },
    coolDowns: 5,
};

module.exports.onStart = async ({ bot, chatId }) => {
    try {
        await bot.leaveChat(chatId);
        console.log(`✅ Left chat: ${chatId}`);
    } catch (error) {
        console.error("❌ Error leaving group:", error.message);
        await bot.sendMessage(chatId, `❌ | Error occurred: ${error.message}`);
    }
};
