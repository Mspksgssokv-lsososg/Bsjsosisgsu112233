const TelegramBot = require('node-telegram-bot-api');

const login = () => {
  const tokens = global.token.tokens;

  const bots = tokens.map(token => new TelegramBot(token, { polling: true }));
  const { listen } = require('../../logger/listen.js');

  bots.forEach(bot => {
    listen(bot);

    bot.on("polling_error", (err) => {
      console.error("⚠️ Polling error:", err.message);

    });

    bot.on("error", (err) => {
      console.error("🔥 Bot error:", err.message);
    });
  });

  return bots;
};

module.exports = { login };
