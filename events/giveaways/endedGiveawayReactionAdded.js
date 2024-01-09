const Discord = require('discord.js');
module.exports = {
  async execute(giveaway, member, reaction) {
    reaction.users.remove(member.user);
    member.send({
        embeds: [
          new Discord.EmbedBuilder()
            .setTitle(`Giveaway đã kết thúc!`)
            .setColor("#EFB2FB")
            .setThumbnail('https://cdn.discordapp.com/attachments/1174937441556238396/1194089044074836069/vitrine-logo_1.png?ex=65af1515&is=659ca015&hm=079b89b4421d9c2f3c78c245c26153e54bcbb3e0abd3f5ecfa474e841d2252a7&')
            .setDescription(
              `Xin chào ${member.user} **[[Giveaway này]](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})** mà bạn bấm vào đã kết thúc rồi :sob:\nHãy nhanh hơn lần sau!`
            )
            .setTimestamp(),
        ],
      })
      .catch((e) => {});
  },
};