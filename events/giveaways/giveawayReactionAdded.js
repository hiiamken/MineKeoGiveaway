const Discord = require("discord.js");
module.exports = {
  async execute(giveaway, reactor, messageReaction) {
    let approved = new Discord.EmbedBuilder()
      .setTimestamp()
      .setColor("#2F3136")
      .setTitle("Tham gia thành công! | Hên hên lại win thì sao!!")
      .setDescription(
        `Đã chấp nhận tham gia [Giveaway này](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) của bạn!`
      )
      .setFooter({ text: "MineKeo Network" })
      .setTimestamp();
    let denied = new Discord.EmbedBuilder()
      .setTimestamp()
      .setColor("#2F3136")
      .setTitle(":x: Bị Từ Chối | Tham gia thất bại!")
      .setDescription(
        `Tham gia [Giveaway này](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) của bạn đã bị từ chối, hãy xem xét lại yêu cầu của Giveaway một cách chính xác.`
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
