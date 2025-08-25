const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "help",
    version: "1.0",
    author: "Dipto",
    role: 0,
    usePrefix: true,
    description: "List all commands",
    commandCategory: "system",
    guide: "{p}help",
    coolDowns: 5,
    premium: false
};

module.exports.onStart = async ({ event, args, message, threadsData }) => {
    const commandFiles = fs.readdirSync(path.join(__dirname, '..', 'cmds')).filter(file => file.endsWith('.js'));
    const config = require('../../config.json');
    const thread = await threadsData.getThread(event.chat.id);
    const prefix = thread?.prefix || '!';
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
            return message.reply('Command not found.');
        }

        let guide = command?.guide || command?.usages || 'No usage available';
        guide = guide.replace(/{pn}|{pm}|{p}|{prefix}|{name}/g, prefix + command?.name);

        if (args[1] === '-u') {
            const usageMessage = `📝 Usage for ${command.name}: ${guide}`;
            return message.reply(usageMessage);
        }

        if (args[1] === '-a') {
            const aliasesMessage = `🪶 [ Aliases for ${command.name} ]: ${command.aliases ? command.aliases.join(', ') : 'None'}`;
            return message.reply(aliasesMessage);
        }

        let commandInfo = `
╭──✦ [ Command: ${command.name.toUpperCase()} ]
├‣ 📜 Name: ${command.name}
├‣ 👤 Credits: ${command?.credits || command?.author || 'Unknown'}
├‣ 🔑 Permission: ${command.role === 0 ? 'Everyone' : 'Admin'}
├‣ 🪶 Aliases: ${command.aliases ? command.aliases.join(', ') : 'None'}
├‣ 📜 Description: ${command.description || 'No description'}
├‣ 📚 Guide: ${guide}
├‣ 🚩 Prefix Required: ${command.prefix || command.usePrefix ? 'Yes' : 'No'}
├‣ ⚜️ Premium: ${command.premium ? 'Yes' : 'No'}
╰───────────────◊`;

        return message.reply(commandInfo);
    }

    const page = parseInt(args[0], 10) || 1;
    const categoryKeys = Object.keys(categories);
    const totalPages = 1;

    let helpMessage = `✨ [ Guide For Beginners - Page ${page} ] ✨\n\n`;

    for (const category of categoryKeys) {
        helpMessage += `╭──── [ ${category.toUpperCase()} ]\n`;
        helpMessage += `│ ✧${categories[category].map(cmd => cmd.name).join(' ✧ ')}\n`;
        helpMessage += `╰───────────────◊\n`;
    }

    helpMessage += `\n╭─『 ${config.botName.toUpperCase()} BOT 』\n╰‣ Total commands: ${totalCommands}\n╰‣ Page ${page} of ${totalPages}\n╰‣ A personal Telegram bot ✨\n╰‣ ADMIN: ${config.adminName}\n`;

    return message.reply(helpMessage);
};
