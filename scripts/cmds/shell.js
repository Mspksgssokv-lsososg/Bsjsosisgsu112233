const { exec } = require("child_process");

module.exports = {
  config: {
    name: "shell",
    aliases: ["sh", "terminal"],
    author: "SK-SIDDIK-KHAN",
    version: "1.0.0",
    cooldown: 10,
    role: 2, 
    description: "Execute shell commands (developer only).",
    category: "developer",
    guide: "Use: shell <command>"
  },

  async onStart({ message, args }) {
    const command = args.join(" ").trim();
    if (!command) {
      return message.reply("⚠️ Usage: shell <command>");
    }

    exec(command, { timeout: 10000 }, async (error, stdout, stderr) => {
      let output = "";

      if (error) {
        output += `❌ Error:\n${error.message}\n\n`;
      }
      if (stderr) {
        output += `⚠️ Stderr:\n${stderr}\n\n`;
      }
      if (stdout) {
        output += `✅ Output:\n${stdout}\n`;
      }

      if (!output.trim()) {
        output = "✅ Done.";
      }

      if (output.length > 3500) {
        output = output.slice(0, 3500) + "\n...truncated";
      }

      await message.reply(output);
    });
  }
};
