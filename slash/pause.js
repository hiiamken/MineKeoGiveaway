const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: "pause",
    description: '⏸ Tạm dừng một sự kiện giveaway',

    options: [
        {
            name: 'giveaway',
            description: 'Sự kiện giveaway cần tạm dừng (ID tin nhắn hoặc giải thưởng giveaway)',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],

    run: async (client, interaction) => {

        // Nếu thành viên không có đủ quyền hạn
        if (!interaction.member.permissions.has('ManageMessages') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")) {
            return interaction.reply({
                content: ':x: Bạn cần có quyền quản lý tin nhắn để tạm dừng các sự kiện giveaway.',
                ephemeral: true
            });
        }

        const query = interaction.options.getString('giveaway');

        // Tìm sự kiện giveaway dựa trên giải thưởng hoặc ID
        const giveaway =
            // Tìm theo giải thưởng
            client.giveawaysManager.giveaways.find((g) => g.prize === query && g.guildId === interaction.guild.id) ||
            // Tìm theo ID sự kiện giveaway
            client.giveawaysManager.giveaways.find((g) => g.messageId === query && g.guildId === interaction.guild.id);

        // Nếu không tìm thấy sự kiện giveaway
        if (!giveaway) {
            return interaction.reply({
                content: 'Không thể tìm thấy sự kiện giveaway cho `' + query + '`.',
                ephemeral: true
            });
        }

        if (giveaway.pauseOptions.isPaused) {
            return interaction.reply({
                content: `**[Sự kiện này](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})** đã được tạm dừng.`,
                ephemeral: true
            });
        }

        // Chỉnh sửa sự kiện giveaway
        client.giveawaysManager.pause(giveaway.messageId)
            // Thông báo thành công
            .then(() => {
                interaction.reply(`**[Sự kiện này](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})** đã được tạm dừng!`);
            })
            .catch((e) => {
                interaction.reply({
                    content: e,
                    ephemeral: true
                });
            });

    }
};
