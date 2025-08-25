module.exports = {
  config: {
    name: "welcome",
    description: "Handles new members joining the group and sends welcome messages.",
    type: "welcome",
    author: "SK-SIDDIK-KHAN"
  },

  onStart: async function ({ bot, msg }) {
    try {
      const chatId = msg.chat.id;
      const newMembers = msg.new_chat_members;
      if (!newMembers) return;

      const botInfo = await bot.getMe();
      const chatInfo = await bot.getChat(chatId);
      const title = chatInfo?.title || "the group";

      const isBotAdded = newMembers.some(member => member.id === botInfo.id);
      if (isBotAdded) {
        const chatMember = await bot.getChatMember(chatId, botInfo.id);
        if (chatMember.status !== "administrator") {
          await bot.sendMessage(
            chatId,
            `🎉 ${botInfo.first_name} has been successfully connected!\n\n` +
            `Thank you for inviting me to ${title}. To unlock my full range of features, ` +
            `please consider granting me admin privileges.`
          );
        }
        return;
      }

      for (const newMember of newMembers) {
        const memberName = `${newMember.first_name || ""}${newMember.last_name ? " " + newMember.last_name : ""}`;
        const memberCount = await bot.getChatMemberCount(chatId);

        await bot.sendMessage(
          chatId,
          `Hi ${memberName}, welcome to ${title}!\n` +
          `Please enjoy your time here! 🥳♥\n\n` +
          `You are ${memberCount}th member of this group.`
        );
      }

    } catch (error) {
      console.error("Error in welcome handler:", error);
      if (global.config?.admin?.length) {
        await bot.sendMessage(
          global.config.admin[0],
          `⚠️ Error in welcome handler:\n${error.message}`
        );
      }
    }
  }
};
