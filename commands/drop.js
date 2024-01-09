const messages = require("../utils/message");
module.exports.run = async (client, message, args) => {
  // Nếu thành viên không có đủ quyền hạn
  if (
    !message.member.permissions.has("ManageMessages") &&
    !message.member.roles.cache.some(r => r.name === "Giveaways")
  ) {
    return message.reply(
      ":x: Bạn cần có quyền quản lý tin nhắn để bắt đầu các sự kiện giveaway."
    );
  }

  // Kênh giveaway
  let giveawayChannel = message.mentions.channels.first();
  // Nếu không có kênh được đề cập
  if (!giveawayChannel) {
    return message.reply(":x: Bạn phải đề cập đến một kênh hợp lệ!");
  }

  // Số người chiến thắng
  let giveawayNumberWinners = parseInt(args[1]);
  // Nếu số người chiến thắng được chỉ định không phải là số
  if (isNaN(giveawayNumberWinners) || parseInt(giveawayNumberWinners) <= 0) {
    return message.reply(
      ":x: Bạn phải chỉ định một số người chiến thắng hợp lệ!"
    );
  }

  // Giải thưởng của sự kiện giveaway
  let giveawayPrize = args.slice(2).join(" ");
  // Nếu không có giải thưởng được chỉ định
  if (!giveawayPrize) {
    return message.reply(":x: Bạn phải chỉ định một giải thưởng hợp lệ!");
  }
  // Bắt đầu sự kiện giveaway
  await client.giveawaysManager.start(giveawayChannel, {
    // Giải thưởng của sự kiện giveaway
    prize: giveawayPrize,
    // Số người chiến thắng của sự kiện giveaway
    winnerCount: parseInt(giveawayNumberWinners),
    // Ai là người tổ chức sự kiện giveaway này
    hostedBy: client.config.hostedBy ? message.author : null,
    // Chỉ định là drop
    isDrop: true,
    // Các thông báo
    messages
  });
  message.reply(`Sự kiện giveaway đã bắt đầu tại ${giveawayChannel}!`);
}
