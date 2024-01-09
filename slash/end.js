const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: "end",
    description: '🎉 Kết thúc một sự kiện giveaway đang diễn ra',

    options: [
        {
            name: 'giveaway',
            description: 'Sự kiện giveaway để kết thúc (ID tin nhắn hoặc giải thưởng)',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],

    run: async (client, interaction) => {

        // Nếu thành viên không có đủ quyền hạn
        if (!interaction.member.permissions.has('ManageMessages') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")) {
            return interaction.reply({
                content: ':x: Bạn cần có quyền quản lý tin nhắn để kết thúc sự kiện giveaway.',
                ephemeral: true
            });
        }

        const query = interaction.options.getString('giveaway');

        // Tìm sự kiện giveaway với ID tin nhắn hoặc giải thưởng
        const giveaway =
            // Tìm với giải thưởng
            client.giveawaysManager.giveaways.find((g) => g.prize === query && g.guildId === interaction.guild.id) ||
            // Tìm với ID tin nhắn
            client.giveawaysManager.giveaways.find((g) => g.messageId === query && g.guildId === interaction.guild.id);

        // Nếu không tìm thấy sự kiện giveaway tương ứng
        if (!giveaway) {
            return interaction.reply({
                content: 'Không tìm thấy sự kiện giveaway cho `' + query + '`.',
                ephemeral: true
            });
        }

        if (giveaway.ended) {
            return interaction.reply({
                content: 'Sự kiện giveaway này đã kết thúc!',
                ephemeral: true
            });
        }

        // Kết thúc sự kiện giveaway
        client.giveawaysManager.end(giveaway.messageId)
            // Thông báo thành công
            .then(() => {
                // Thông báo thành công
                interaction.reply(`**[Sự kiện này](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})** đã được kết thúc!`);
            })
            .catch((e) => {
                interaction.reply({
                    content: e,
                    ephemeral: true
                });
            });

    }
};
