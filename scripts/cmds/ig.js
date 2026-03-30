module.exports = {
    config: {
        name: "ig",
        aliases: ["ig"],
        version: "1.1.0",
        author: "RAKIB MAHMUD (pro)",
        description: "Random caption + photo with typing effect",
        category: "fun",
        usePrefix: false
    },

    onStart: async function ({ bot, msg, chatId }) {
        try {
            // 1️⃣ typing simulation
            await bot.sendChatAction(chatId, "typing");
            await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5s delay

            // 2️⃣ captions
            const captions = [
                "ღ••\n– কোনো নেতার পিছনে নয়.!!🤸‍♂️\n– মসজিদের ইমামের পিছনে দাড়াও জীবন বদলে যাবে ইনশাআল্লাহ.!!🖤🌻\n۵",
                "-!\n__আল্লাহর রহমত থেকে নিরাশ হওয়া যাবে না!” আল্লাহ অবশ্যই তোমাকে ক্ষমা করে দিবেন☺️🌻\nসুরা যুমাহ্ আয়াত ৫২..৫৩💙🌸\n-!",
                "- ইসলাম অহংকার করতে শেখায় না!🌸\n- ইসলাম শুকরিয়া আদায় করতে শেখায়!🤲🕋🥀",
                "🌸 জীবন সুন্দর, ইসলাম সুন্দর, মন শান্ত.🌿\n– একটু সময় নাও, আল্লাহর নাম নাও।🙏"
            ];

            // 3️⃣ images
            const links = [
                "https://i.postimg.cc/7LdGnyjQ/images-31.jpg",
                "https://i.postimg.cc/65c81ZDZ/images-30.jpg",
                "https://i.postimg.cc/Y0wvTzr6/images-29.jpg",
                "https://i.postimg.cc/3x3d7L5x/images-28.jpg"
            ];

            // 4️⃣ random selection
            const randomCaption = captions[Math.floor(Math.random() * captions.length)];
            const randomImageLink = links[Math.floor(Math.random() * links.length)];

            // 5️⃣ send photo with caption
            await bot.sendPhoto(chatId, randomImageLink, {
                caption: randomCaption
            });

        } catch (error) {
            console.error("💥 IG Command Error:", error);
        }
    }
};
