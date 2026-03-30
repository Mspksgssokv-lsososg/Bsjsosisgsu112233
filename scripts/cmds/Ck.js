// Islamic.js
const config = require("./config");

module.exports = {
  config: {
    name: "islamic",
    aliases: ["islam"],
    version: "1.2.0",
    author: config.author,
    description: "Random Islamic caption + photo & auto trigger on prefix",
    category: "fun",
    usePrefix: true // auto trigger uses prefix
  },

  onStart: async function ({ bot, msg, chatId, event }) {
    try {
      const captions = [
        "ღ••\n– কোনো নেতার পিছনে নয়.!!🤸‍♂️\n– মসজিদের ইমামের পিছনে দাড়াও জীবন বদলে যাবে ইনশাআল্লাহ.!!🖤🌻\n۵",
        "-!\n__আল্লাহর রহমত থেকে নিরাশ হওয়া যাবে না!” আল্লাহ অবশ্যই তোমাকে ক্ষমা করে দিবেন☺️🌻\nসুরা যুমাহ্ আয়াত ৫২..৫৩💙🌸\n-!",
        "- ইসলাম অহংকার করতে শেখায় না!🌸\n- ইসলাম শুকরিয়া আদায় করতে শেখায়!🤲🕋🥀"
      ];

      const links = [
        "https://i.postimg.cc/7LdGnyjQ/images-31.jpg",
        "https://i.postimg.cc/65c81ZDZ/images-30.jpg",
        "https://i.postimg.cc/Y0wvTzr6/images-29.jpg"
      ];

      const randomCaption = captions[Math.floor(Math.random() * captions.length)];
      const randomImageLink = links[Math.floor(Math.random() * links.length)];

      const targetChat = chatId || event?.senderID;

      await bot.sendPhoto(targetChat, randomImageLink, { caption: randomCaption });

    } catch (error) {
      console.error("Islamic Command Error:", error);
    }
  },

  // Auto trigger if only prefix is typed
  async onMessage({ bot, message, event }) {
    try {
      const text = event.body?.trim();
      const prefix = config.prefix;

      if (text === prefix) {
        return this.onStart({ bot, msg: message, chatId: event.senderID, event });
      }
    } catch (err) {
      console.error("AutoIslamic Error:", err);
    }
  }
};
