const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "delete",
    version: "1.1",
    aliases: [],
    author: "SK-SIDDIK-KHAN",
    countDown: 3,
    role: 2, 
    description: "Deletes a command file from cmds folder and unloads it instantly",
    commandCategory: "admin",
    guide: "{pn} <commandName>",
  },

  run: async function ({ message, args, commands }) {
    const commandName = args[0];
    if (!commandName) {
      return message.reply("⚠️ Please specify a command name to delete.");
    }

    const fileName = commandName.endsWith('.js') ? commandName : `${commandName}.js`;
    const commandPath = path.join(__dirname, fileName);

    if (!fs.existsSync(commandPath)) {
      return message.reply(`❌ Command file \`${fileName}\` does not exist.`);
    }

    try {
      fs.unlinkSync(commandPath);

      delete require.cache[require.resolve(commandPath)];

      const index = commands.findIndex(c => c.config.name === commandName || c.config.name === fileName.replace('.js', ''));
      if (index !== -1) commands.splice(index, 1);

      return message.reply(`✅ Command \`${fileName}\` has been deleted and unloaded successfully.`);
    } catch (error) {
      console.error(error);
      return message.reply("⚠️ Error deleting the command file.");
    }
  },
};
