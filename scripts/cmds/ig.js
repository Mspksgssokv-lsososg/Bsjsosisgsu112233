const fs = require("fs");
const path = require("path");
const https = require("https");

const categories = {
  "ISLAMIC-VIDEO": [
    "https://i.imgur.com/3EXzdzu.mp4",
    "https://i.imgur.com/elsJxEk.mp4",
    "https://i.imgur.com/htitv6P.mp4",
  ],
  "LOFI-VIDEO": [
    "https://i.imgur.com/g6cdosz.mp4",
    "https://i.imgur.com/4gY1bWL.mp4",
  ],
  "FUNNY-VIDEO": [
    "https://i.imgur.com/sUJFShv.mp4",
    "https://i.imgur.com/WzXz13s.mp4",
  ],
};

const PAGE_SIZE = 10;

module.exports = {
  config: {
    name: "album",
    author: "SK-SIDDIK-KHAN",
    description: "Send random videos from an album.",
    category: "media",
    usage: "/album [page]",
    usePrefix: true,
  },

  onStart: async ({ bot, chatId, args, userId }) => {
    const categoryKeys = Object.keys(categories);
    let page = 1;

    if (args.length > 0) {
      const inputPage = parseInt(args[0]);
      if (!isNaN(inputPage) && inputPage > 0) page = inputPage;
    }

    const totalPages = Math.ceil(categoryKeys.length / PAGE_SIZE);
    if (page > totalPages) {
      return bot.sendMessage(chatId, `❌ Page ${page} doesn't exist. Total pages: ${totalPages}`);
    }

    const startIndex = (page - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const currentPageCategories = categoryKeys.slice(startIndex, endIndex);

    let text =
      `╭─🎬 𝗔𝗹𝗯𝘂𝗺 𝗩𝗶𝗱𝗲𝗼𝘀 ─╮\n\n` +
      `Reply with a number to select a category:\n\n` +
      currentPageCategories
        .map((cat, i) => `┃ ${startIndex + i + 1}. ${cat.toUpperCase()}`)
        .join("\n") +
      `\n\n╰─Page [${page} / ${totalPages}]─╯`;

    const sentMsg = await bot.sendMessage(chatId, text);

    // Telegram-style reply listener
    const replyListener = async (replyMsg) => {
      // Only consider replies to this menu and from same user
      if (
        replyMsg.chat.id === chatId &&
        replyMsg.reply_to_message?.message_id === sentMsg.message_id &&
        replyMsg.from.id === userId
      ) {
        const num = parseInt(replyMsg.text.trim());

        if (isNaN(num) || num < 1 || num > categoryKeys.length) {
          bot.sendMessage(chatId, "❌ Invalid input. Command cancelled.");
          bot.removeListener("message", replyListener);
          return;
        }

        const category = categoryKeys[num - 1];
        const videoURL = categories[category][Math.floor(Math.random() * categories[category].length)];
        const fileName = path.basename(videoURL);
        const filePath = path.join(__dirname, "cache", "album", fileName);

        if (!fs.existsSync(path.dirname(filePath))) {
          fs.mkdirSync(path.dirname(filePath), { recursive: true });
        }

        const loadingMsg = await bot.sendMessage(chatId, `⏳ Loading ${category.toUpperCase()}...`);

        try {
          if (!fs.existsSync(filePath)) await downloadFile(filePath, videoURL);

          await bot.sendVideo(chatId, fs.createReadStream(filePath), {
            caption: `✅ Here's your ${category.toUpperCase()}`,
          });

          await bot.deleteMessage(chatId, loadingMsg.message_id);
        } catch (err) {
          console.error(err);
          bot.sendMessage(chatId, "❌ Failed to load video");
        }

        // Remove listener after use
        bot.removeListener("message", replyListener);
      }
    };

    bot.on("message", replyListener);

    // Auto-delete menu after 30s
    setTimeout(() => {
      try {
        bot.deleteMessage(chatId, sentMsg.message_id);
        bot.removeListener("message", replyListener);
      } catch {}
    }, 30000);
  },
};

// Helper function to download videos
function downloadFile(filePath, url) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    https
      .get(url, (res) => {
        res.pipe(file);
        file.on("finish", () => file.close(resolve));
      })
      .on("error", (err) => {
        fs.unlink(filePath, () => {});
        reject(err);
      });
  });
}
