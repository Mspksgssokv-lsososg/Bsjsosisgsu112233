module.exports = {
  config: {
    name: "goodbye",
    description: "Handles members leaving the group and sends goodbye messages.",
    type: "leave",
    author: "SK-SIDDIK-KHAN"
  },

  run: async function ({ bot, msg }) {
    try {
      const chatId = msg.chat.id;
      const leftMember = msg.left_chat_member;

      if (!leftMember) return;

      const { first_name, last_name, id: userId } = leftMember;
      const fullName = `${first_name || ""}${last_name ? " " + last_name : ""}`.trim();

      const botInfo = await bot.getMe();
      if (userId === botInfo.id) {
        const chatInfo = await bot.getChat(chatId);
        const title = chatInfo?.title || "a group";
        const actionBy = `${msg.from.first_name || ""}${msg.from.last_name ? " " + msg.from.last_name : ""}`.trim();

        console.log(`🤖 Bot was removed from ${title} by ${actionBy}.`);
        return;
      }

      const goodbyeMessage =
        msg.from.id === userId
          ? `👋 ${fullName} left the group.`
          : `🥱 ${fullName} was removed by an admin.`;

      await bot.sendMessage(chatId, goodbyeMessage);

    } catch (error) {
      console.error("Error in goodbye handler:", error);

      if (global.config?.admin?.length) {
        await bot.sendMessage(
          global.config.admin[0],
          `⚠️ Error in goodbye handler:\n${error.message}`
        );
      }
    }
  }
};
