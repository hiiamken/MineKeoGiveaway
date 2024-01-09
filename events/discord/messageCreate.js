module.exports = (client, message) => {
    // Trả về nếu người gửi là bot
    if (message.author.bot) return;

    // Trả về nếu tin nhắn không khớp với tiền tố (trong lệnh)
    if (message.content.indexOf(client.config.prefix) !== 0) return;

    // Xác định đối số và lệnh
    const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // Lấy dữ liệu của lệnh từ client.commands Collection
    const cmd = client.commands.get(command);

    // Nếu lệnh không tồn tại, trả về
    if (!cmd) return;

    // Chạy lệnh
    cmd.run(client, message, args);
};
