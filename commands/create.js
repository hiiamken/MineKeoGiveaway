const Discord = require('discord.js'),
  { EmbedBuilder } = Discord,
  parsec = require('parsec'),
  messages = require('../utils/message');

module.exports.run = async (client, message) => {
    // Nếu thành viên không có đủ quyền hạn
    if (
      !message.member.permissions.has("ManageMessages") &&
      !message.member.roles.cache.some(r => r.name === "Giveaways")
    ) {
      return message.reply(
        ":x: Bạn cần có quyền quản lý tin nhắn để bắt đầu các sự kiện giveaway."
      );
    }
    
    const collector = message.channel.createMessageCollector({
      filter: (m) => m.author.id === message.author.id,
      time: 60000,
    });

    let xembed = new EmbedBuilder()
      .setTitle("Rất tiếc! Hình như đã hết thời gian! 🕖")
      .setColor("#EFB2FB")
      .setDescription('💥 Hết giờ rồi!\nBạn đã mất quá nhiều thời gian để quyết định!\nSử dụng ``create`` để bắt đầu một sự kiện giveaway mới!\nHãy đợi thêm **30 giây** để thử lại!')
      .setFooter({
        text: `${client.user.username}`,
        iconURL: client.user.displayAvatarURL()
      })  
      .setTimestamp();

  function waitingEmbed(title, desc) {
    return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: `${message.author.tag} + ' | Thiết lập Giveaway'`,
            iconURL: message.member.displayAvatarURL()
          })
          .setTitle('Giveaway ' + title)
          .setDescription(desc + ' trong vòng 60 giây tới.')
          .setFooter({
            text: "Nhập 'huỷ' để thoát quá trình này.",
            iconURL: client.user.displayAvatarURL()
          })
          .setTimestamp()
          .setColor("#EFB2FB"),
      ],
    });
  }

  let winnerCount, channel, duration, prize, cancelled;

  await waitingEmbed('Giải thưởng', 'Vui lòng nhập giải thưởng của sự kiện giveaway');

  collector.on('collect', async (m) => {
    if (cancelled) return;

    async function failed(options, ...cancel) {
      if (typeof cancel[0] === 'boolean')
        (cancelled = true) && (await m.reply(options));
      else {
        await m.reply(
          options instanceof EmbedBuilder ? { embeds: [options] } : options
        );
        return await waitingEmbed(...cancel);
      }
    }

    if (m.content === 'hủy'){ 
      collector.stop();
      return await failed('Đã hủy Tạo sự kiện Giveaway.', true);
    }

    switch (true) {
      case !prize: {
        if (m.content.length > 256)
          return await failed(
            'Giải thưởng không thể dài hơn 256 ký tự.',
            'Giải thưởng',
            'Vui lòng nhập giải thưởng của sự kiện giveaway'
          );
        else {
          prize = m.content;
          await waitingEmbed('Kênh', 'Vui lòng nhập kênh của sự kiện giveaway');
        }

        break;
      }

      case !channel: {
        if (!(_channel = m.mentions.channels.first() || m.guild.channels.cache.get(m.content)))
          return await failed(
            'Vui lòng nhập một kênh hợp lệ / ID kênh.',
            'Kênh',
            'Vui lòng nhập kênh của sự kiện giveaway'
          );
        else if (!_channel.isTextBased())
          return await failed(
            'Kênh phải là một kênh văn bản.',
            'Kênh',
            'Vui lòng nhập kênh của sự kiện giveaway'
          );
        else {
          channel = _channel;
          await waitingEmbed(
            'Số người chiến thắng',
            'Vui lòng nhập số người chiến thắng của sự kiện giveaway.'
          );
        }

        break;
      }

      case !winnerCount: {
        if (!(_w = parseInt(m.content)))
          return await failed(
            'Số người chiến thắng phải là một số nguyên.',
            'Số người chiến thắng',
            'Vui lòng nhập số người chiến thắng của sự kiện giveaway.'
          );
        if (_w < 1)
          return await failed(
            'Số người chiến thắng phải lớn hơn 1.',
            'Số người chiến thắng',
            'Vui lòng nhập số người chiến thắng của sự kiện giveaway.'
          );
        else if (_w > 15)
          return await failed(
            'Số người chiến thắng phải nhỏ hơn 15.',
            'Số người chiến thắng',
            'Vui lòng nhập số người chiến thắng của sự kiện giveaway.'
          );
        else {
          winnerCount = _w;
          await waitingEmbed('Thời lượng', 'Vui lòng nhập thời lượng của sự kiện giveaway');
        }

        break;
      }

      case !duration: {
        if (!(_d = parsec(m.content).duration))
          return await failed(
            'Vui lòng cung cấp một thời lượng hợp lệ.',
            'Thời lượng',
            'Vui lòng nhập thời lượng của sự kiện giveaway'
          );
        if (_d > parsec('21d').duration)
          return await failed(
            'Thời lượng phải nhỏ hơn 21 ngày!',
            'Thời lượng',
            'Vui lòng nhập thời lượng của sự kiện giveaway'
          );
        else {
          duration = _d;
        }

        return client.giveawaysManager.start(channel, {
          prize,
          duration,
          winnerCount,
          hostedBy: client.config.hostedBy ? message.author : null,
          messages,
        });
      }
    }
  });
  collector.on('end', (collected, reason) => {
    if (reason == 'time') {
       message.reply({ embeds: [xembed]})
    }
  })
};
