module.exports = {
  config: {
    name: "ig",
    version: "1.0.0",
    author: "RAKIB MAHMUD",
    description: "Random Islamic Caption and Photo on Prefix",
    category: "utility",
    prefix: false
  },

  onStart: async function ({ bot, message }) {
    const chatId = message.chat.id;
    const messageId = message.message_id;

    try {
      const captions = [
        "ღ••\n– কোনো নেতার পিছনে নয়.!!🤸‍♂️\n– মসজিদের ইমামের পিছনে দাড়াও জীবন বদলে যাবে ইনশাআল্লাহ.!!🖤🌻\n۵",
        "- ইসলাম অহংকার করতে শেখায় না!🌸\n- ইসলাম শুকরিয়া আদায় করতে শেখায়!🤲🕋🥀",
        "🦋🥀࿐\nল_༎হাজারো স্বপ্নের শেষ স্থান কবরস্থান🙂🤲🥀",
        "_আল্লাহর ভালোবাসা পেতে চাও?\nতবে রাসুল (সা:) কে অনুসরণ করো🥰"
      ];

      const links = [
        "https://i.postimg.cc/7LdGnyjQ/images-31.jpg",
        "https://i.postimg.cc/65c81ZDZ/images-30.jpg",
        "https://i.postimg.cc/Y0wvTzr6/images-29.jpg",
        "https://i.postimg.cc/1Rpnw2BJ/images-28.jpg"
      ];

      // same index fix
      const index = Math.floor(Math.random() * captions.length);

      const randomCaption = captions[index];
      const randomImageLink = links[index];

      await bot.sendPhoto(chatId, randomImageLink, {
        caption: randomCaption,
        reply_to_message_id: messageId
      });

    } catch (error) {
      console.error("onStart Error:", error);

      await bot.sendMessage(chatId,
        "❌ Error হয়েছে, পরে আবার চেষ্টা করুন!",
        { reply_to_message_id: messageId }
      );
    }
  }
};
