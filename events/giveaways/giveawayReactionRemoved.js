const Discord = require("discord.js");
module.exports = {
  async execute(giveaway, member) {
    return member.send({
      embeds: [new Discord.EmbedBuilder()
        .setTimestamp()
        .setTitle('❓ Đợi một chút, bạn vừa bỏ một phản ứng từ Giveaway?')
        .setColor("#EFB2FB")
        .setThumbnail('https://cdn.discordapp.com/attachments/1174937441556238396/1194089044074836069/vitrine-logo_1.png?ex=65af1515&is=659ca015&hm=079b89b4421d9c2f3c78c245c26153e54bcbb3e0abd3f5ecfa474e841d2252a7&')
        .setDescription(
          `Đã ghi nhận sự tham gia của bạn trong [Giveaway này](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) nhưng bạn đã bỏ phản ứng, vì bạn không cần **${giveaway.prize}** nữa, nên tôi sẽ phải chọn người khác thôi 😭`
        )
        .setFooter({ text: "Nghĩ rằng đó là một lỗi? Hãy bấm lại Emoji nha!" })
      ]
    }).catch(e => {})
  }
}
