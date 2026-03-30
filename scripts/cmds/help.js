const fs = require('fs');
const path = require('path');
 
module.exports.config = {
    name: "help",
    version: "1.1",
    author: "SK-SIDDIK-KHAN",
    role: 0,
    usePrefix: true,
    description: "List all commands with details",
    commandCategory: "system",
    guide: "{p}help",
    coolDowns: 5,
    premium: false
};
 
module.exports.onStart = async ({ event, args, message }) => {
    try {
        const commandFiles = fs.readdirSync(path.join(__dirname, '..', 'cmds')).filter(file => file.endsWith('.js'));
        const config = require('../../config.json');
 
        const prefix = config.prefix || "/";
 
        let categories = {};
        let totalCommands = 0;
 
        for (const file of commandFiles) {
            const command = require(path.join(__dirname, '..', 'cmds', file));
            if (command.config) {
                const category = command.config.commandCategory || command.config.category || 'OTHER';
                if (!categories[category]) categories[category] = [];
                categories[category].push(command.config);
                totalCommands++;
            }
        }

        if (args[0]) {
            if (args[0] === '-s' && args[1]) {
                const searchLetter = args[1].toLowerCase();
                const matchingCommands = Object.values(categories).flat().filter(cmd => cmd.name.startsWith(searchLetter));
                if (matchingCommands.length === 0) {
                    return message.reply(`No commands found starting with '${searchLetter}'.`);
                }
 
                let searchMessage = `✨ [ Commands Starting with '${searchLetter.toUpperCase()}' ] ✨\n\n`;
                matchingCommands.forEach(cmd => (searchMessage += `✧ ${cmd.name}\n`));
                return message.reply(searchMessage);
            }
 
            const commandName = args[0].toLowerCase();
            const command = Object.values(categories).flat().find(cmd => cmd.name === commandName || cmd.aliases?.includes(commandName));
 
            if (!command) {
                return message.reply('❌ Command not found.');
            }
 
            let guide = command?.guide || command?.usages || 'No usage available';
            guide = guide.replace(/{pn}|{pm}|{p}|{prefix}|{name}/g, prefix + command?.name);
 
            if (args[1] === '-u') {
                return message.reply(`📝 Usage for ${command.name}: ${guide}`);
            }
 
            if (args[1] === '-a') {
                return message.reply(`🪶 Aliases for ${command.name}: ${command.aliases ? command.aliases.join(', ') : 'None'}`);
            }
 
            let commandInfo = `
╭──✦ [ Command: ${command.name.toUpperCase()} ]
├‣ 📜 Name: ${command.name}
├‣ 👤 Author: ${command?.author || command?.credits || 'Unknown'}
├‣ 🔑 Permission: ${command.role === 0 ? 'Everyone' : 'Admin'}
├‣ 🪶 Aliases: ${command.aliases ? command.aliases.join(', ') : 'None'}
├‣ 📜 Description: ${command.description || 'No description'}
├‣ 📚 Guide: ${guide}
├‣ 🚩 Prefix Required: ${command.usePrefix ? 'Yes' : 'No'}
├‣ ⚜️ Premium: ${command.premium ? 'Yes' : 'No'}
╰───────────────◊`;
 
            return message.reply(commandInfo);
        }
 
        const page = parseInt(args[0], 10) || 1;
        const categoryKeys = Object.keys(categories);
        const totalPages = 1;
 
        let helpMessage = `✨ [ Help Menu - Page ${page} ] ✨\n\n`;
 
        for (const category of categoryKeys) {
            helpMessage += `╭──── [ ${category.toUpperCase()} ]\n`;
            helpMessage += `│ ✧ ${categories[category].map(cmd => cmd.name).join(' ✧ ')}\n`;
            helpMessage += `╰───────────────◊\n`;
        }
 
        helpMessage += `\n╭─『 ${config.owner.name}'s BOT 』\n╰‣ Total commands: ${totalCommands}\n╰‣ Page ${page} of ${totalPages}\n╰‣ Prefix: ${prefix}\n╰‣ Developer: ${config.owner.name}\n`;
 
        return message.reply(helpMessage);
    } catch (err) {
        console.error("❌ Error in help command:", err);
        return message.reply("❌ An error occurred while executing the help command.");
    }
};
 
