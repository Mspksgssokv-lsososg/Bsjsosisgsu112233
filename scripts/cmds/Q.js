const config = require('../config.json'); // এক ধাপ উপরে উঠে config.json নাও

module.exports = {
    config: {
        name: 'start',
        aliases: ['example'],
        category: 'general',
        role: 0,
        cooldowns: 5,
        version: '1.0.0',
        author: config.owner.name,
        description: 'Start the bot',
        usage: 'start',
        botName: config.botName
    },

    onStart: async function({ msg, bot }) {
        const botName = config.botName || 'Bot';
        const welcomeMessage = `👋 Welcome to ${botName}! How can I help you today?`;

        try {
            if (bot.sendMessage && msg.chat?.id) {
                await bot.sendMessage(msg.chat.id, welcomeMessage, { replyToMessage: msg.message_id });
            } else if (bot.sendMessage) {
                await bot.sendMessage(msg.from.id, welcomeMessage);
            } else {
                console.error('bot.sendMessage is not defined');
            }
        } catch (err) {
            console.error('Error sending start message:', err);
        }
    }
};
