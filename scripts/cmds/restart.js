const fs = require('fs');
const path = require('path');

const cacheDir = path.join(__dirname, 'Siddik');
const restartTxt = path.join(cacheDir, 'restart.txt');

module.exports.config = {
  name: "restart",
  aliases: [],
  version: "1.0.0",
  role: 3,
  author: "dipto",
  description: "Restart the bot.",
  usePrefix: true,
  guide: "",
  category: "Admin",
  countDown: 5,
};

// Runs when the bot loads
module.exports.onLoad = async ({ api }) => {
  try {
    if (fs.existsSync(restartTxt)) {
      const content = fs.readFileSync(restartTxt, "utf-8");
      const [target, oldtime] = content.split(" ");

      if (target && oldtime) {
        const uptimeSeconds = ((Date.now() - parseInt(oldtime)) / 1000).toFixed(2);
        api.sendMessage(target, `✅ | Bot restarted\n⏰ | Time: ${uptimeSeconds}s`);
      }

      fs.unlinkSync(restartTxt);
    }
  } catch (error) {
    console.error("Error in onLoad:", error);
  }
};

// Runs when the restart command is triggered
module.exports.onStart = async ({ message, event }) => {
  try {
    // Ensure cache directory exists
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

    // Check that chat ID exists
    if (!event?.chat?.id) return message.reply("❌ | Cannot get chat ID");

    // Write restart info
    fs.writeFileSync(restartTxt, `${event.chat.id} ${Date.now()}`);

    await message.reply("🔄 | Restarting the bot...");
    process.exit(2); // exit code 2 signals a restart
  } catch (error) {
    console.error("Error in onStart:", error); // detailed logging
    message.reply("❌ | Error restarting the bot");
  }
};
