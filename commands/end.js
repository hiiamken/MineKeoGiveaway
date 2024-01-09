exports.run = async (client, message, args) => {

    // Nếu thành viên không có đủ quyền hạn
    if(!message.member.permissions.has('ManageMessages') && !message.member.roles.cache.some((r) => r.name === "Giveaways")){
        return message.reply(':x: Bạn cần có quyền quản lý tin nhắn để reroll lại sự kiện giveaway.');
    }

    // Nếu không có ID tin nhắn hoặc tên sự kiện giveaway được chỉ định
    if(!args[0]){
        return message.reply(':x: Bạn phải chỉ định một ID tin nhắn hợp lệ!');
    }

    // Thử tìm sự kiện giveaway với giải thưởng sau đó là ID
    let giveaway = 
    // Tìm với giải thưởng của sự kiện giveaway
    client.giveawaysManager.giveaways.find((g) => g.prize === args.join(' ')) ||
    // Tìm với ID của sự kiện giveaway
    client.giveawaysManager.giveaways.find((g) => g.messageId == args[0]);

    // Nếu không tìm thấy sự kiện giveaway
    if(!giveaway){
        return message.reply('Không tìm thấy sự kiện giveaway cho `'+ args.join(' ') + '`.');
    }

    // Kết thúc sự kiện giveaway
    client.giveawaysManager.end(giveaway.messageId)
    // Thành công
    .then(() => {
        // Thông báo thành công
        message.reply('sự kiện giveaway đã kết thúc.');
    }).catch((e) => {
            message.reply({
                content: e
            });
    })

};
