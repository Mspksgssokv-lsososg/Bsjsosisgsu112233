const fs = require("fs");
const path = require("path");
const https = require("https");

const categories = {
  "ISLAMIC-VIDEO": [
    "https://i.imgur.com/3EXzdzu.mp4",
    "https://i.imgur.com/elsJxEk.mp4",
    "https://i.imgur.com/htitv6P.mp4"
  ],
  "LOFI-VIDEO": [
    "https://i.imgur.com/g6cdosz.mp4",
    "https://i.imgur.com/4gY1bWL.mp4"
  ],
  "FUNNY-VIDEO": [
    "https://i.imgur.com/sUJFShv.mp4",
    "https://i.imgur.com/WzXz13s.mp4"
  ]
};

const PAGE_SIZE = 10;

module.exports = {
  config: {
    name: "album",
    author: "SK-SIDDIK-KHAN",
    description: "Send random videos from an album.",
    category: "media",
    usage: "/album [page]",
    usePrefix: true
  },

  onStart: async ({ bot, chatId, args }) => {
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

    let text = "🎬 Select a category by replying with the number:\n\n";
    currentPageCategories.forEach((cat, i) => {
      text += `${startIndex + i + 1}. ${cat}\n`;
    });
    text += `\nPage [${page} / ${totalPages}]`;

    const sentMessage = await bot.sendMessage(chatId, text);

    // Wait for user's reply
    const listener = async (replyMsg) => {
      if (
        replyMsg.chat.id === chatId &&
        replyMsg.reply_to_message?.message_id === sentMessage.message_id
      ) {
        const num = parseInt(replyMsg.text);
        if (isNaN(num) || num < 1 || num > categoryKeys.length) {
          return bot.sendMessage(chatId, "❌ Invalid number. Command cancelled.");
        }

        const category = categoryKeys[num - 1];
        const videoURL = categories[category][Math.floor(Math.random() * categories[category].length)];
        const fileName = path.basename(videoURL);
        const filePath = path.join(__dirname, "cache", fileName);

        if (!fs.existsSync(path.dirname(filePath))) {
          fs.mkdirSync(path.dirname(filePath), { recursive: true });
        }

        try {
          if (!fs.existsSync(filePath)) {
            await downloadFile(filePath, videoURL);
          }

          await bot.sendVideo(chatId, fs.createReadStream(filePath), { caption: `✅ Here's your ${category}` });
        } catch (err) {
          console.error(err);
          bot.sendMessage(chatId, "❌ Failed to load video");
        }

        // Remove listener after reply
        bot.removeListener("message", listener);
      }
    };

    bot.on("message", listener);
  }
};

function downloadFile(filePath, url) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    https.get(url, (res) => {
      res.pipe(file);
      file.on("finish", () => file.close(resolve));
    }).on("error", (err) => {
      fs.unlink(filePath, () => {});
      reject(err);
    });
  });
}
