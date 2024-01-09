const Discord = require('discord.js');
module.exports = {
  async execute(giveaway, member, reaction) {
    reaction.users.remove(member.user);
    member.send({
        embeds: [
          new Discord.EmbedBuilder()
            .setTitle(`Giveaway đã kết thúc!`)
            .setColor('#b50505')
            .setDescription(
              `Xin chào ${member.user} **[[Giveaway này]](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})** mà bạn bấm vào đã kết thúc rồi :sob:\nHãy nhanh hơn lần sau!`
            )
            .setTimestamp(),
        ],
      })
      .catch((e) => {});
  },
};