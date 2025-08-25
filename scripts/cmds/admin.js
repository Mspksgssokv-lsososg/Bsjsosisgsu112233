const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "..", "..", "config.json");

function loadConfig() {
  try {
    const configData = fs.readFileSync(configPath, "utf-8");
    const config = JSON.parse(configData);
    if (!config.admin) {
      config.admin = [];
    }
    if (!config.symbols) {
      config.symbols = "●";
    }
    if (!config.prefix) {
      config.prefix = "!";
    }
    return config;
  } catch (error) {
    console.error("Error loading config.json:", error);
    return { admin: [], symbols: "●", prefix: "!" };
  }
}

function saveConfig(config) {
  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  } catch (error) {
    console.error("Error saving config.json:", error);
  }
}

async function getAdminName(userId, bot, chatId) {
  try {
    const chatMember = await bot.getChatMember(chatId, userId);
    const user = chatMember.user;
    let userName = user.first_name;
    if (user.last_name) {
      userName += ` ${user.last_name}`;
    }
    return `${userName}\n(${userId})`;
  } catch (e) {
    return `User_${userId}\n(${userId})`;
  }
}

module.exports = {
  config: {
    name: "admin",
    prefix: false,
    admin: true,
    vip: true,
    role: 2,
    author: "SK-SIDDIK-KHAN",
    version: "1.0.0",
    description: "Manage bot administrators: add, remove, list",
    usage: "!admin add [reply/mention/ID] | !admin remove [reply/mention/ID] | !admin list",
    category: "admin",
    aliases: ["ad"]
  },

  async onStart({ bot, message, args, chatId, userId }) {
    const config = loadConfig();
    const symbol = config.symbols || "●";

    if (!config.admin.includes(String(userId))) {
      return message.reply("❌ | Only bot admins can use this command");
    }

    if (!args.length) {
      return message.reply(
        `${symbol} Usage:\n` +
        `\`${config.prefix}admin add [reply/mention/ID]\`\n` +
        `\`${config.prefix}admin remove [reply/mention/ID]\`\n` +
        `\`${config.prefix}admin list\``
      );
    }

    const subCmd = args[0].toLowerCase();

    if (subCmd === "list") {
      const admins = config.admin;
      if (admins.length === 0) {
        return message.reply(`${symbol} No bot administrators found.`);
      }

      const adminNames = await Promise.all(
        admins.map(async (adminId) => await getAdminName(adminId, bot, chatId))
      );

      return message.reply(
        "👑 | List of admins:\n" + adminNames.map(n => `• ${n}`).join("\n\n")
      );
    }

    if (!["add", "remove"].includes(subCmd)) {
      return message.reply(
        `${symbol} Invalid subcommand. Use: \`add\`, \`remove\`, or \`list\`.`
      );
    }

    let targetUsers = [];

    if (message.reply_to_message?.from) {
      targetUsers.push(message.reply_to_message.from.id);
    }

    if (message.entities) {
      for (const entity of message.entities) {
        if (entity.type === "text_mention" && entity.user) {
          targetUsers.push(entity.user.id);
        }
      }
    }

    if (args.length > 1 && !isNaN(parseInt(args[1]))) {
      targetUsers.push(parseInt(args[1]));
    }

    targetUsers = [...new Set(targetUsers)];

    if (targetUsers.length === 0) {
      return message.reply(
        `${symbol} Please reply to a user, mention a user, or provide a user ID.`
      );
    }

    const currentAdmins = config.admin.map(String);

    if (subCmd === "add") {
      const added = [];
      for (const uid of targetUsers) {
        const uidStr = String(uid);
        if (!currentAdmins.includes(uidStr)) {
          currentAdmins.push(uidStr);
          added.push(uid);
        }
      }
      config.admin = currentAdmins;
      saveConfig(config);

      if (added.length === 0) {
        return message.reply(`${symbol} All mentioned users are already bot administrators.`);
      }

      const addedDisplayNames = await Promise.all(
        added.map(uid => getAdminName(uid, bot, chatId))
      );

      return message.reply(
        `✅ | Added admin role for ${added.length} users:\n` +
        addedDisplayNames.map(n => `• ${n}`).join("\n")
      );
    }

    if (subCmd === "remove") {
      const removed = [];
      for (const uid of targetUsers) {
        const uidStr = String(uid);
        const idx = currentAdmins.indexOf(uidStr);
        if (idx !== -1) {
          currentAdmins.splice(idx, 1);
          removed.push(uid);
        }
      }
      config.admin = currentAdmins;
      saveConfig(config);

      if (removed.length === 0) {
        return message.reply(`${symbol} None of the mentioned users are bot administrators.`);
      }

      const removedDisplayNames = await Promise.all(
        removed.map(uid => getAdminName(uid, bot, chatId))
      );

      return message.reply(
        `✅ | Removed admin role from ${removed.length} users:\n` +
        removedDisplayNames.map(n => `• ${n}`).join("\n")
      );
    }
  }
};
