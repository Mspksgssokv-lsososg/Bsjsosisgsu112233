const { cmds } = global.config;
const fs = require('fs');
const path = require('path');

exports.word = async function ({ bot, message, msg, chatId }) {
  if (!msg || !msg.text) return;

  const text = msg.text.trim();

  // Ignore prefixed commands
  if (text.startsWith(global.config.prefix)) return;

  const tokens = text.split(/\s+/);
  if (tokens.length > 0) {
    const firstToken = tokens[0].toLowerCase();

    for (const cmd of cmds.values()) {
      if (cmd.config.prefix === false || cmd.config.prefix === "both") {
        if (cmd.config.name.toLowerCase() === firstToken) return;
        if (
          cmd.config.aliases &&
          Array.isArray(cmd.config.aliases) &&
          cmd.config.aliases.map(alias => alias.toLowerCase()).includes(firstToken)
        ) {
          return;
        }
      }
    }
  }

  // Escape regex special chars
  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  for (const cmd of cmds.values()) {
    if (cmd.config && cmd.config.keyword) {
      const keywords = Array.isArray(cmd.config.keyword)
        ? cmd.config.keyword
        : [cmd.config.keyword];

      const keywordRegex = new RegExp(
        `\\b(${keywords.map(escapeRegex).join("|")})\\b`,
        "i"
      );

      if (keywordRegex.test(text)) {
        const args = text.split(/\s+/);
        try {
          await cmd.onWord({ bot, message, msg, chatId, args });
        } catch (error) {
          console.error(
            `Error in event handler for command "${cmd.config.name}": ${error.stack || error.message}`
          );
        }
      }
    }
  }
};