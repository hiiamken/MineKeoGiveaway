const Discord = require("discord.js");
module.exports = {
  async execute(giveaway, winners) {
    winners.forEach((member) => {
      member.send({
        embeds: [new Discord.EmbedBuilder()
          .setTitle(`🎉 Chúc mừng bạn! 🎉`)
          .setColor("#EFB2FB")
          .setThumbnail('https://cdn.discordapp.com/attachments/1174937441556238396/1194089044074836069/vitrine-logo_1.png?ex=65af1515&is=659ca015&hm=079b89b4421d9c2f3c78c245c26153e54bcbb3e0abd3f5ecfa474e841d2252a7&')
          .setDescription(`Xin chào ${member.user}\n Hình như bạn vừa chiến thắng một sự kiện **[[Giveaway này]](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})**\n Phần thưởng của sự kiện là **${giveaway.prize}!**\nHãy tạo ticket để nhận phần thưởng nha!\n\n Nhớ theo dõi các thông báo của chúng mình để không bỏ lỡ các sự kiện mới nhất nhé.`)
          .setTimestamp()
          .setFooter({
            text: `${member.user.username}`, 
            iconURL: member.user.displayAvatarURL()
          })
        ]
      }).catch(e => {})
    });
  }
}