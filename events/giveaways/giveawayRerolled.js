const Discord = require("discord.js");
module.exports = {
  async execute(giveaway, winners) {
    winners.forEach((member) => {
      member.send({
        embeds: [new Discord.EmbedBuilder()
          .setTitle(`🎁 Thật tuyệt! Chúng ta có một người chiến thắng mới`)
          .setColor("#2F3136")
          .setDescription(`Xin chào ${member.user}\n Tôi nghe nói người tổ chức đã reroll và bạn đã chiến thắng **[[Giveaway này]](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})**\n Chúc mừng bạn đã giành chiến thắng **${giveaway.prize}!**\nTạo ticket để nhận giải thưởng của bạn!!`)
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
