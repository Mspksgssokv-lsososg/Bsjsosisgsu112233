module.exports = {
    config: {
        name: "ig",
        aliases: [],
        version: "1.0.0",
        author: "RAKIB MAHMUD (fixed)",
        description: "Random Islamic caption + photo",
        category: "fun",
        usePrefix: false
    },

    onStart: async function ({ bot, msg, chatId }) {
        try {
            // message না থাকলে return
            if (!msg.text) return;

            // যদি message '/' দিয়ে শুরু হয়, trigger হবে
            if (!msg.text.trim().startsWith("/")) return;

            // Random captions
            const captions = [
                "ღ••\n– কোনো নেতার পিছনে নয়.!!🤸‍♂️\n– মসজিদের ইমামের পিছনে দাড়াও জীবন বদলে যাবে ইনশাআল্লাহ.!!🖤🌻\n۵",
                "-!\n__আল্লাহর রহমত থেকে নিরাশ হওয়া যাবে না! আল্লাহ অবশ্যই তোমাকে ক্ষমা করে দিবেন☺️🌻\nসুরা যুমাহ্ আয়াত ৫২..৫৩💙🌸\n-!",
                "- ইসলাম অহংকার করতে শেখায় না!🌸\n- ইসলাম শুকরিয়া আদায় করতে শেখায়!🤲🕋🥀"
            ];

            // Random image links
            const links = [
                "https://i.postimg.cc/7LdGnyjQ/images-31.jpg",
                "https://i.postimg.cc/65c81ZDZ/images-30.jpg",
                "https://i.postimg.cc/Y0wvTzr6/images-29.jpg"
            ];

            // Randomly select one caption and one image
            const randomCaption = captions[Math.floor(Math.random() * captions.length)];
            const randomImageLink = links[Math.floor(Math.random() * links.length)];

            // Send photo with caption
            await bot.sendPhoto(chatId, randomImageLink, { caption: randomCaption });

        } catch (error) {
            console.error("Error in ig.js:", error);
        }
    }
};
