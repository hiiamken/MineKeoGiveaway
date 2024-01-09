const Discord = require("discord.js");
module.exports = {
  async execute(giveaway, member) {
    return member.send({
      embeds: [new Discord.EmbedBuilder()
        .setTimestamp()
        .setTitle('❓ Đợi một chút, bạn vừa bỏ một phản ứng từ Giveaway?')
        .setColor("#2F3136")
        .setDescription(
          `Đã ghi nhận sự tham gia của bạn trong [Giveaway này](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) nhưng bạn đã bỏ phản ứng, vì bạn không cần **${giveaway.prize}** nữa, nên tôi sẽ phải chọn người khác thôi 😭`
        )
        .setFooter({ text: "Nghĩ rằng đó là một lỗi? Hãy bấm lại Emoji nha!" })
      ]
    }).catch(e => {})
  }
}
