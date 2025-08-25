const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, '../../database/balance.json');

const getBalanceData = () => {
  if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, JSON.stringify({}));
    return {};
  }
  const data = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(data);
};

module.exports = {
  config: {
    name: "bal",
    aliases: ["balance", "money"],
    author: "SK-SIDDIK-KHAN",
    version: "1.0.0",
    cooldown: 5,
    role: 0,
    description: "Shows the user's current balance.",
    category: "games",
    guide: "Use: {pn}"
  },

  onStart: async function ({ message, userId }) {
    const balances = getBalanceData();
    const userBalance = balances[userId]?.money || 0;

    await message.reply(`💸 Your balance: ${userBalance} BDT`);
  }
};
