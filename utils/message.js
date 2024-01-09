const config = require('../config.json');
module.exports = {
  giveaway:
    (config.everyoneMention ? "@everyone\n\n" : "") +
    "🎉 **SỰ KIỆN GIVEAWAY** 🎉",
  giveawayEnded:
    (config.everyoneMention ? "@everyone\n\n" : "") +
    "🎉 **GIVEAWAY KẾT THÚC** 🎉",
  drawing:  `Kết thúc sau: **{timestamp}**`,
  inviteToParticipate: `Bấm vào emoji 🎉 để tham gia!`,
  winMessage: "Chúc mừng {winners}! Bạn đã chiến thắng **{this.prize}**!",
  embedFooter: "{this.winnerCount} giải",
  noWinner: "Giveaway đã bị huỷ, không có ai tham gia hợp lệ.",
  hostedBy: "Tổ chức bởi: {this.hostedBy}",
  winners: "Người chiến thắng",
  endedAt: "Kết thúc vào"
}