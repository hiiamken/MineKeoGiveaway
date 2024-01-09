const messages = require("../utils/message");
const {  ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'drop',
    description: 'Tạo một sự kiện giveaway',
    options: [
        {
            name: 'winners',
            description: 'Bao nhiêu người sẽ chiến thẳng giải thưởng',
            type: ApplicationCommandOptionType.Integer,
            required: true
        },
        {
            name: 'prize',
            description: 'Giải thưởng sự kiện là gì',
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'channel',
            description: 'Kênh để sự kiện được bắt đầu',
            type: ApplicationCommandOptionType.Channel,
            required: true
        }
    ],

    run: async (client, interaction) => {

        // Nếu thành viên không có đủ quyền hạn
        if(!interaction.member.permissions.has('ManageMessages') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")){
            return interaction.reply({
                content: ':x: Bạn cần có quyền quản lý tin nhắn để bắt đầu các sự kiện giveaway.',
                ephemeral: true
            });
        }

        const giveawayChannel = interaction.options.getChannel('channel');
        const giveawayWinnerCount = interaction.options.getInteger('winners');
        const giveawayPrize = interaction.options.getString('prize');
      
    if (!giveawayChannel.isTextBased()) {
      return interaction.reply({
        content: ':x: Vui lòng đề cập đến một kênh hợp lệ!',
        ephemeral: true
      });
    }   
    if (giveawayWinnerCount < 1) {
      return interaction.reply({
        content: ':x: Vui lòng nhập số lượng người thắng! Lớn hơn hoặc bằng một.',
      })
    }

        // Bắt đầu sự kiện giveaway
        client.giveawaysManager.start(giveawayChannel, {
            // Số lượng người chiến thắng
            winnerCount: giveawayWinnerCount,
            // Phần thưởng giveaway
            prize: giveawayPrize,
            // Ai là người tổ chức
            hostedBy: client.config.hostedBy ? interaction.user : null,
            // chỉ đinh Drop
            isDrop: true,
            // Tin nhắn
            messages
        });

        interaction.reply(`Sự kiện Giveaway đã bắt đầu tại ${giveawayChannel}!`);

    }
};