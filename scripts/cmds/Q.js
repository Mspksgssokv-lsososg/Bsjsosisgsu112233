module.exports = {
    config: {
        name: 'start',
        aliases: ['example'],
        category: 'general',
        role: 0,
        cooldowns: 5,
        version: '1.0.0',
        author: 'Samir Thakuri',
        description: 'Start the bot',
        usage: 'start',
        botName: 'MyBot'
    },

    onStart: async function({ msg, bot, config }) {
        const botName = config.botName || 'Bot';
        const welcomeMessage = `👋 Welcome to ${botName}! How can I help you today?`;

        // Try multiple ways to send the message safely
        try {
            if (bot.sendMessage && msg.chat?.id) {
                await bot.sendMessage(msg.chat.id, welcomeMessage, { replyToMessage: msg.message_id });
            } else if (bot.sendMessage) {
                await bot.sendMessage(msg.from.id, welcomeMessage); // fallback
            } else {
                console.error('bot.sendMessage is not defined');
            }
        } catch (err) {
            console.error('Error sending start message:', err);
        }
    }
};
