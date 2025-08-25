module.exports.config = {
  name: "spam",
  aliases: [],
  author: "SK-SIDDIK-KHAN",
  countDown: 2,
  role: 2,
  description: "Spams a message a specified number of times.",
  category: "Utility",
  usePrefix: true,
  usage: "{pn} <count> <message>"
};

module.exports.onStart = async ({ bot, chatId, args }) => {
  const count = parseInt(args[0], 10);
  const spamMessage = args.slice(1).join(" ");

  if (isNaN(count) || count <= 0) {
    return bot.sendMessage(chatId, "❌ Please specify a valid number of times to spam.");
  }

  if (!spamMessage) {
    return bot.sendMessage(chatId, "❌ Please provide a message to spam.");
  }

  const maxSpamCount = 50;
  if (count > maxSpamCount) {
    return bot.sendMessage(chatId, `⚠ You can only spam up to ${maxSpamCount} times.`);
  }

  for (let i = 0; i < count; i++) {
    await bot.sendMessage(chatId, spamMessage);
  }
};
