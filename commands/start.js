const ms = require("ms");
const messages = require("../utils/message");

module.exports.run = async (client, message, args) => {
  // Kiểm tra quyền hạn của thành viên
  if (
    !message.member.permissions.has("ManageMessages") &&
    !message.member.roles.cache.some(r => r.name === "Giveaways")
  ) {
    return message.reply(
      ":x: Bạn cần có quyền quản lý tin nhắn để bắt đầu sự kiện giveaway."
    );
  }

  // Kênh sự kiện giveaway
  let giveawayChannel = message.mentions.channels.first();
  // Nếu không có kênh được đề cập
  if (!giveawayChannel) {
    return message.reply(":x: Bạn phải đề cập đến một kênh hợp lệ!");
  }

  // Thời gian kéo dài sự kiện
  let giveawayDuration = args[1];
  // Nếu thời gian không hợp lệ
  if (!giveawayDuration || isNaN(ms(giveawayDuration))) {
    return message.reply(":x: Bạn phải chỉ định một thời lượng hợp lệ!");
  }

  // Số lượng người chiến thắng
  let giveawayNumberWinners = parseInt(args[2]);
  // Nếu số lượng người chiến thắng không phải là số
  if (isNaN(giveawayNumberWinners) || parseInt(giveawayNumberWinners) <= 0) {
    return message.reply(
      ":x: Bạn phải chỉ định một số lượng người chiến thắng hợp lệ!"
    );
  }

  // Giải thưởng cho sự kiện giveaway
  let giveawayPrize = args.slice(3).join(" ");
  // Nếu không có giải thưởng được chỉ định
  if (!giveawayPrize) {
    return message.reply(":x: Bạn phải chỉ định một giải thưởng hợp lệ!");
  }

  // Bắt đầu sự kiện giveaway
  await client.giveawaysManager.start(giveawayChannel, {
    // Thời lượng của sự kiện giveaway
    duration: ms(giveawayDuration),
    // Giải thưởng của sự kiện giveaway
    prize: giveawayPrize,
    // Số người chiến thắng của sự kiện giveaway
    winnerCount: parseInt(giveawayNumberWinners),
    // Người tổ chức sự kiện giveaway
    hostedBy: client.config.hostedBy ? message.author : null,
    // Tin nhắn
    messages
  });
  message.reply(`sự kiện giveaway đã bắt đầu tại ${giveawayChannel}!`);
}
