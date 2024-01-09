const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: "reroll",
    description: '🎉 Reroll một sự kiện giveaway',

    options: [
        {
            name: 'giveaway',
            description: 'Sự kiện giveaway cần Reroll (ID tin nhắn hoặc giải thưởng)',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],

    run: async (client, interaction) => {

        // Nếu thành viên không có đủ quyền hạn
        if (!interaction.member.permissions.has('ManageMessages') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")) {
            return interaction.reply({
                content: ':x: Bạn cần có quyền quản lý tin nhắn để Reroll sự kiện giveaway.',
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

        if (!giveaway.ended) {
            return interaction.reply({
                content: `[Sự kiện này](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) chưa kết thúc`,
                ephemeral: true
            });
        }

        // Reroll sự kiện giveaway
        client.giveawaysManager.reroll(giveaway.messageId)
            .then(() => {
                // Thông báo thành công
                interaction.reply(`Reroll **[sự kiện này](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})!**`);
            })
            .catch((e) => {
                interaction.reply({
                    content: e,
                    ephemeral: true
                });
            });

    }
};
