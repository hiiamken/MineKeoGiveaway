const { ApplicationCommandOptionType } = require('discord.js');
const ms = require("ms");

module.exports = {
  name: 'edit',
  description: '🎉 Chỉnh sửa một giveaway',

  options: [
    {
      name: 'giveaway',
      description: 'ID của sự kiện giveaway cần chỉnh sửa',
      type: ApplicationCommandOptionType.String,
      required: true
    },
    {
      name: 'duration',
      description: 'Thời lượng mới của sự kiện giveaway. Ví dụ: 1h sẽ kết thúc sự kiện sau một giờ!',
      type: ApplicationCommandOptionType.String,
      required: true
    },
    {
      name: 'winners',
      description: 'Số người chiến thắng trong sự kiện giveaway',
      type: ApplicationCommandOptionType.Integer,
      required: true
    },
    {
      name: 'prize',
      description: 'Giải thưởng cho sự kiện giveaway',
      type: ApplicationCommandOptionType.String,
      required: true
    }
  ],

  run: async (client, interaction) => {

    // Nếu thành viên không có đủ quyền hạn
    if (!interaction.member.permissions.has('ManageMessages') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")) {
      return interaction.reply({
        content: ':x: Bạn cần có quyền quản lý tin nhắn để tạo sự kiện giveaway.',
        ephemeral: true
      });
    }
    const gid = interaction.options.getString('giveaway');
    const time = interaction.options.getString('duration');
    const winnersCount = interaction.options.getInteger('winners');
    const prize = interaction.options.getString('prize');
    let duration;
    if (time.startsWith("-")) {
      duration = -ms(time.substring(1));
    } else {
      duration = ms(time);
    }

    if (isNaN(duration)) {
      return interaction.reply({
        content: ":x: Vui lòng chọn thời lượng hợp lệ!",
        ephemeral: true,
      });
    }
    await interaction.deferReply({
      ephemeral: true
    })
    // Chỉnh sửa sự kiện giveaway
    try {
      await client.giveawaysManager.edit(gid, {
        newWinnerCount: winnersCount,
        newPrize: prize,
        addTime: time
      })
    } catch (e) {
      return interaction.editReply({
        content:
          `Không tìm thấy sự kiện giveaway với ID: \`${gid}\``,
        ephemeral: true
      });
    }
    interaction.editReply({
      content:
        `Sự kiện giveaway đã được chỉnh sửa thành công!`,
      ephemeral: true
    });
  }

};
