module.exports = {
    name: "onStart", // trigger on bot start
    credits: "RAKIB MAHMUD",
    description: "Random Islamic Caption and Photo when bot starts",

    onStart: async (bot) => {
        try {
            const captions = [
                "ღ••\n– কোনো নেতার পিছনে নয়.!!🤸‍♂️\n– মসজিদের ইমামের পিছনে দাড়াও জীবন বদলে যাবে ইনশাআল্লাহ.!!🖤🌻\n۵",
                "-!\n__আল্লাহর রহমত থেকে নিরাশ হওয়া যাবে না!” আল্লাহ অবশ্যই তোমাকে ক্ষমা করে দিবেন☺️🌻\nসুরা যুমাহ্ আয়াত ৫২..৫৩💙🌸\n-!",
                "- ইসলাম অহংকার করতে শেখায় না!🌸\n\n- ইসলাম শুকরিয়া আদায় করতে শেখায়!🤲🕋🥀",
                "- বেপর্দা নারী যদি নায়িকা হতে পারে\n _____🤗🥀 -তবে পর্দাশীল নারী গুলো সব ইসলামের শাহাজাদী __🌺🥰\n  __মাশাল্লাহ।।",
                "┏━━━━ ﷽ ━━━━┓\n 🖤﷽স্মার্ট নয় ইসলামিক ﷽🥰\n 🖤﷽ জীবন সঙ্গি খুঁজুন ﷽🥰\n┗━━━━ ﷽ ━━━━┛",
                "ღ࿐– যখন বান্দার জ্বর হয়,😇\n🖤তখন গুনাহ গুলো ঝড়ে পড়তে থাকে☺️\n– হযরত মুহাম্মদ(সাঃ)●───༊༆"
            ];

            const links = [
                "https://i.postimg.cc/7LdGnyjQ/images-31.jpg",
                "https://i.postimg.cc/65c81ZDZ/images-30.jpg",
                "https://i.postimg.cc/Y0wvTzr6/images-29.jpg",
                "https://i.postimg.cc/1Rpnw2BJ/images-28.jpg",
                "https://i.postimg.cc/mgrPxDs5/images-27.jpg",
                "https://i.postimg.cc/yxXDK3xw/images-26.jpg"
            ];

            const randomCaption = captions[Math.floor(Math.random() * captions.length)];
            const randomImageLink = links[Math.floor(Math.random() * links.length)];

            // Replace 'YOUR_CHAT_ID' with your admin/chat ID where you want to send the start message
            const chatId = process.env.ADMIN_CHAT_ID || "YOUR_CHAT_ID"; 

            await bot.sendPhoto(chatId, randomImageLink, {
                caption: randomCaption
            });

            console.log("✅ onStart message sent successfully");

        } catch (error) {
            console.error("❌ onStart Error:", error.message);
        }
    }
};
