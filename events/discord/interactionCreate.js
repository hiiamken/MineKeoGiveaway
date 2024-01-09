module.exports = (client, interaction) => {
    // Kiểm tra xem interaction có phải là một slash command không
    if (interaction.isCommand()) {
  
      // Lấy lệnh từ collection dành cho slash command
      const command = client.interactions.get(interaction.commandName);
  
      // Nếu lệnh không tồn tại, trả về một tin nhắn lỗi
      if (!command) return interaction.reply({
        content: "Có lỗi xảy ra | Có thể lệnh không được đăng ký?",
        ephemeral: true
      });
  
      command.run(client, interaction);
    }
  }
  