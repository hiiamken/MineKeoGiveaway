const Discord = require("discord.js");
module.exports = {
  async execute(giveaway, reactor, messageReaction) {
    let approved = new Discord.EmbedBuilder()
      .setTimestamp()
      .setColor("#EFB2FB")
      .setTitle("🎉 Tham gia thành công! 🎉")
      .setDescription(
        `Bạn vừa tham gia một sự kiện [Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) tại MineKeo Network.\nHi vọng bạn sẽ lụm được giải thưởng trong sự kiện lần này nha!\n\n Nhớ theo dõi các thông báo của chúng mình để không bỏ lỡ các sự kiện mới nhất nhé.`
      )
      .setFooter({ text: "MineKeo Network" })
      .setThumbnail('https://cdn.discordapp.com/attachments/1174937441556238396/1194089044074836069/vitrine-logo_1.png?ex=65af1515&is=659ca015&hm=079b89b4421d9c2f3c78c245c26153e54bcbb3e0abd3f5ecfa474e841d2252a7&')
      .setTimestamp();
    let denied = new Discord.EmbedBuilder()
      .setTimestamp()
      .setColor("#EFB2FB")
      .setTitle("🎉 Tham gia thất bại! 🎉")
      .setThumbnail('https://cdn.discordapp.com/attachments/1174937441556238396/1194089044074836069/vitrine-logo_1.png?ex=65af1515&is=659ca015&hm=079b89b4421d9c2f3c78c245c26153e54bcbb3e0abd3f5ecfa474e841d2252a7&')
      .setDescription(
        `Bạn không thể tham gia [Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) tại MineKeo Network!\nHãy xem xét lại yêu cầu của Giveaway một cách chính xác.`
      )
      .setFooter({ text: "MineKeo Network" });

    let client = messageReaction.message.client;
    if (reactor.user.bot) return;
    if (giveaway.extraData) {
      if (giveaway.extraData.server !== "null") {
        try {
          await client.guilds.cache.get(giveaway.extraData.server).members.fetch(reactor.id);
          return reactor.send({
            embeds: [approved],
          });
        } catch (e) {
          messageReaction.users.remove(reactor.user);
          return reactor.send({
            embeds: [denied],
          }).catch((e) => {});
        }
      }
      if (giveaway.extraData.role !== "null" && !reactor.roles.cache.get(giveaway.extraData.role)) {
        messageReaction.users.remove(reactor.user);
        return reactor.send({
          embeds: [denied],
        }).catch((e) => {});
      }

      return reactor.send({
        embeds: [approved],
      }).catch((e) => {});
    } else {
      return reactor.send({
        embeds: [approved],
      }).catch((e) => {});
    }
  },
};
