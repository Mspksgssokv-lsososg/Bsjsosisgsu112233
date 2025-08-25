const path = require("path");
const fs = require("fs");

const dataPath = path.join(__dirname, '../../database/prefixes.json');

const getPrefixData = () => {
    if (!fs.existsSync(dataPath)) {
        fs.writeFileSync(dataPath, JSON.stringify({}));
        return {};
    }
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
};

const savePrefixData = (data) => {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

module.exports = {
    config: {
        name: "prefix",
        aliases: ["pre"],
        author: "SK-SIDDIK-KHAN",
        version: "1.0",
        cooldowns: 5,
        role: 0, 
        description: "Change the command prefix for the group.",
        category: "GROUP",
        guide: "Use: {pn} change <new_prefix>"
    },

    onStart: async function ({ message, args, chatId }) {
        const prefixes = getPrefixData();
        const currentPrefix = prefixes[chatId] || global.config.prefix;
        
        if (!args[0]) {
            return message.reply(`🌐 System prefix: ${global.config.prefix}\n🛸 This Group's prefix: ${currentPrefix}`);
        }

        if (args[0].toLowerCase() === 'change') {
            const newPrefix = args[1];

            if (!newPrefix) {
                return message.reply('❌ Please provide a new prefix.\nExample: prefix change !');
            }

            if (newPrefix.length > 3) {
                return message.reply("❌ The new prefix cannot be more than 3 characters long.");
            }

            prefixes[chatId] = newPrefix;
            savePrefixData(prefixes);
            
            return message.reply(`✅ Prefix changed to ${newPrefix} for this group.`);
        }

        return message.reply('❌ Invalid usage. Try:\nprefix change !');
    }
};
