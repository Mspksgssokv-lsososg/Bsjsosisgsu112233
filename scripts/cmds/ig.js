module.exports = {
    config: {
        name: "slashPost",
        version: "1.0.0",
        author: "RAKIB MAHMUD",
        description: "Send Islamic post on /",
        category: "utility",
        prefix: false // auto-run
    },

    onStart: async function ({ bot, message }) {
        try {
            const chatId = message.chat.id;
            const messageId = message.message_id;
            const text = message.text || "";

            // শুধু "/" হলে run করবে
            if (text.trim() !== "/") return;

            const data = [
                {
                    caption: "🦋🥀࿐\nহাজারো স্বপ্নের শেষ স্থান কবরস্থান🙂🤲🥀",
                    img: "https://i.postimg.cc/Y0wvTzr6/images-29.jpg"
                },
                {
                    caption: "আল্লাহর ভালোবাসা পেতে চাও?\nরাসুল (সা:) কে অনুসরণ করো🥰",
                    img: "https://i.postimg.cc/1Rpnw2BJ/images-28.jpg"
                }
            ];

            // র‍্যান্ডম ছবি নির্বাচন
            const random = data[Math.floor(Math.random() * data.length)];

            // ছবি পাঠানো
            await bot.sendPhoto(chatId, random.img, {
                caption: random.caption,
                reply_to_message_id: messageId
            });

        } catch (error) {
            console.error("Error sending photo:", error);
        }
    }
};
