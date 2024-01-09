const ms = require('ms');
module.exports.run = async (client, message, args) => {

    // Nếu thành viên không đủ quyền lợi
    if(!message.member.permissions.has('ManageMessages') && !message.member.roles.cache.some((r) => r.name === "Giveaways")){
        return message.reply(':x: Bạn không có đủ quyền để reroll giveaway.');
    }

    // Nếu ID tin nhắn không hợp lệ
    if(!args[0]){
        return message.reply(':x: Bạn cần nhập một ID tin nhắn cụ thể!');
    }

    // Thử tìm sự kiện Giveaway với phần thưởng kèm ID
    let giveaway = 
    // tìm kiếm phần thưởng
    client.giveawaysManager.giveaways.find((g) => g.prize === args.join(' ')) ||
    // tìm kiếm theo ID
    client.giveawaysManager.giveaways.find((g) => g.messageID === args[0]);

    // Nếu sự kiện giveaway không tìm thấy
    if(!giveaway){
        return message.reply('Không tìm thấy một sự kiện giveaway nào với `'+ args.join(' ') +'`.');
    }

    // Reroll the giveaway
    client.giveawaysManager.reroll(giveaway.messageID)
    .then(() => {
        // Success message
        message.reply('Đang reroll giveaway!');
    })
    .catch((e) => {
        if(e.startsWith(`Giveaway với ID ${giveaway.messageID} chưa kết thúc.`)){
            message.reply('Giveaway này chưa kết thúc!');
        } else {
            console.error(e);
            message.reply(e);
        }
    });

};