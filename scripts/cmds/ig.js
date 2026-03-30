const botConfig = require("../config.json"); // adjust path if needed

module.exports = {
    config: {
        name: "islamic",
        aliases: ["islam"],
        version: "1.0.0",
        author: "RAKIB MAHMUD (fixed)",
        description: "Random Islamic caption + photo",
        category: "fun",
        usePrefix: botConfig.prefix || "/", // <-- uses prefix from config.json
    },

    onStart: async function ({ bot, msg, chatId }) {
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

            await bot.sendPhoto(chatId, randomImageLink, {
                caption: randomCaption
            });

        } catch (error) {
            console.error("Error in Islamic module:", error);
        }
    }
};
