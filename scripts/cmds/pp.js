// scripts/cmds/avatar.js
module.exports.config = {
    name: "avatar",
    aliases: ["avt", "pp", "dp"],
    version: "1.0",
    credits: "Dipto",
    role: 0, // 0 = all users, 1 = admin, 2 = owner only
    usePrefix: false, // must use prefix to trigger
    description: "Get your or another user's avatar",
    commandCategory: "utility",
    guide: {
        en: "{pn} [user_id] - Get your or another user's profile picture"
    },
    cooldown: 5, // matches your main.js 'cooldown' system
    premium: false
};

module.exports.onStart = async function ({ bot, msg, args, chatId, userId }) {
    const targetId = args[0] || userId; // If no argument, get the sender's avatar

    try {
        const user = await bot.getUserProfilePhotos(targetId);

        if (user.total_count > 0) {
            // Get the latest avatar
            const fileId = user.photos[0][0].file_id;

            await bot.sendPhoto(chatId, fileId, {
                caption: `🖼 Avatar of user ${targetId}`
            });
        } else {
            await bot.sendMessage(chatId, `🚫 No avatar found for user ${targetId}`);
        }
    } catch (error) {
        console.error(`[Avatar Error]`, error.message);
        await bot.sendMessage(chatId, '⚠️ Sorry, something went wrong while fetching the avatar.');
    }
};
