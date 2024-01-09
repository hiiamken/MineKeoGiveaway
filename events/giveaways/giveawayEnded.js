const Discord = require("discord.js")
module.exports = {
  async execute(giveaway, winners) {
    winners.forEach((member) => {
      member.send({
        embeds: [new Discord.EmbedBuilder()
          .setTitle(`🎁 Chúc mừng bồ!`)
          .setColor("#2F3136")
          .setDescription(`Này ${member.user}!\n Hình như bạn vừa chiến thắng sự kiện **[[Giveaway]](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})**\n Bạn vừa nhận được **${giveaway.prize}!**\nTạo ticket để nhận thưởng nha!!`)
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