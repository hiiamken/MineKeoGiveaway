const Discord = require('discord.js');
const config = require('../config.json');

module.exports = {
  name: 'list',
  description: '🎉 Kiểm tra các sự kiện giveaway thường diễn ra ở máy chủ!',
  run: async (client, interaction) => {
    const select = new Discord.SelectMenuBuilder()
      .setCustomId('select')
      .setPlaceholder('Chọn một loại sự kiện giveaway để xem!')
      .addOptions([
        {
          label: '🎉 Giveaway Thường',
          description: 'Kiểm tra các sự kiện giveaway hiện đang diễn ra trong máy chủ của bạn!',
          value: 'normal',
        },
      ]);
    const row = new Discord.ActionRowBuilder().addComponents([select]);
    let giveaways = client.giveawaysManager.giveaways.filter(
      (g) => g.guildId === `${interaction.guild.id}` && !g.ended
    );
    if (!giveaways.some((e) => e.messageId)) {
      return interaction.reply('💥 Không có Giveaway nào để hiển thị');
    }
    const msg = await interaction.channel.send({
      embeds: [
        new Discord.EmbedBuilder()
          .setDescription('Chọn một lựa chọn trong menu để bắt đầu!')
          .setColor('#f542ec')
          .setTimestamp(),
      ],
      components: [row],
    });
    let embed = new Discord.EmbedBuilder()
      .setTitle('Các Sự Kiện Giveaway Đang Diễn Ra')
      .setColor('#f58142')
      .setFooter({
        text: `Yêu cầu bởi ${interaction.user.username} | ` + config.copyright,
        iconURL: interaction.user.displayAvatarURL()
      })
      .setTimestamp();
    const filter = (x) =>
      x.customId == 'select' && x.user.id == interaction.member.id;
    const collector = await interaction.channel.createMessageComponentCollector(
      { filter, time: 60000, max: 1 }
    );
    await interaction.deferReply();
    collector.on('collect', async (i) => {
      const val = i.values[0];
      if (val == 'normal') {
        await Promise.all(
          giveaways.map(async (x) => {
            embed.addFields({ name:
              `Giveaway Thường:`, value: `**Giải thưởng:** **[${x.prize}](https://discord.com/channels/${x.guildId}/${x.channelId}/${x.messageId})\nBắt đầu:** <t:${((x.startAt)/1000).toFixed(0)}:R> (<t:${((x.startAt)/1000).toFixed(0)}:f>)\n**Kết thúc:** <t:${((x.endAt)/1000).toFixed(0)}:R> (<t:${((x.endAt)/1000).toFixed(0)}:f>)`
              });
          })
        );
        msg.delete();
        interaction.editReply({ embeds: [embed], components: [] });
      }
    });
    collector.on('end', (collected, reason) => {
      if (reason == 'time') {
        interaction.editReply({
          content: 'Thu thập bị hủy, Vui lòng thử lại!',
          components: [],
        });
      }
    });
  },
};
