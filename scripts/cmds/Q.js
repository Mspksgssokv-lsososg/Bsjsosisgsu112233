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
        botName: 'MyBots' // Add your bot's name here
    },

    onStart: async function({ msg, bot, config }) {
        try {
            // Fallback if botName is missing
            const botName = config.botName || 'Bot';
            const welcomeMessage = `👋 Welcome to ${botName}! How can I help you today?`;

            // Send the welcome message as a reply
            await bot.sendMessage(msg.chat.id, welcomeMessage, { replyToMessage: msg.message_id });
        } catch (error) {
            console.error('Error in start command:', error);
            await bot.sendMessage(msg.chat.id, '⚠️ Something went wrong while starting the bot.', { replyToMessage: msg.message_id });
        }
    }
};
