module.exports.run = async (client, message) => {
    const Discord = require("discord.js");
    const ms = require("ms");

      // If the member doesn't have enough permissions
  if (
    !message.member.permissions.has("ManageMessages") &&
    !message.member.roles.cache.some(r => r.name === "Giveaways")
  ) {
    return message.reply(
        ":x: Bạn cần có quyền quản lý tin nhắn để bắt đầu các sự kiện giveaway."
    );
  }
  
    let time = "";
    let winnersCount;
    let prize = "";
    let giveawayx = "";
    let embed = new Discord.EmbedBuilder()
      .setTitle("Chỉnh sửa một sự kiện giveaway!")
      .setColor('#2F3136')
      .setFooter({ 
        text: `${client.user.username}`, 
        iconURL: client.user.displayAvatarURL() 
      })
      .setTimestamp();
    const msg = await message.reply({
      embeds:
        [embed.setDescription(
          "Bạn muốn chỉnh sửa sự kiện Giveaway nào?\nCung cấp ID tin nhắn của sự kiện\n **Cần phản hồi trong 30 giây!**"
        )]
    }
    );
    let xembed = new Discord.EmbedBuilder()
      .setTitle("Ối! Hết thời gian phản hồi! 🕖")
      .setColor("#FF0000")
      .setDescription('💥 Đã hết thời gian!\nBạn đã mất quá nhiều thời gian để chỉnh sửa!\nSử dụng ``edit`` để chỉnh sửa lại giveaway!\nCần phản hồi trong **30 seconds** ngay lúc này!')
      .setFooter({ 
        text: `${client.user.username}`, 
        iconURL: client.user.displayAvatarURL() 
      })
      .setTimestamp();
  
    const filter = m => m.author.id === message.author.id && !m.author.bot;
    const collector = await message.channel.createMessageCollector(filter, {
      max: 3,
      time: 30000
    });
  
    collector.on("collect", async collect => {
  
      const response = collect.content;
      let gid = response;
      // kiểm tra xem ID tin nhắn có hợp lệ không

      
      await collect.delete()
        if (!client.giveawaysManager.giveaways.find((g) => g.messageID === gid)) {
           return msg.edit({
                embeds: [
                  embed.setDescription(
                    "Ôi không! Bạn cung cấp ID Tin nhắn không hợp lệ rồi!\n**Thử lại?**\n Ví dụ: ``677813783523098627``"
                  )]
              }
              );
        }
      else {
        collector.stop(
          msg.edit({
            embeds: [
              embed.setDescription(
                `Okay! Tiếp theo, hãy chọn thời gian kết thúc sự kiện Giveaway này \n** Hãy phản hồi trong 30 giây!**`
              )]
          }
          )
        );
      }
      const collector2 = await message.channel.createMessageCollector(filter, {
        max: 3,
        time: 30000
      });
      collector2.on("collect", async collect2 => {
  
        let mss = ms(collect2.content);
        await collect2.delete()
        if (!mss) {
          return msg.edit({
            embeds: [
              embed.setDescription(
                "Ôi không! Bạn cung cấp thời gian không hợp lệ\n**Hãy thử lại?**\n Ví dụ: ``-10 minutes``,``-10m``,``-10``\n **Lưu ý: - (minus) Dấu trừ để giảm thời gian!**"
              )]
          }
          );
        } else {
          time = mss;
          collector2.stop(
            msg.edit({
              embeds: [
                embed.setDescription(
                  `Tốt! Tiếp theo, Hãy lựa chọn số lượng người chiến thắng Giveaway?\n**Hãy phản hồi trong 30 giây.**`
                )]
            }
            )
          );
        }
        const collector3 = await message.channel.createMessageCollector(filter, {
          max: 3,
          time: 30000,
          errors: ['time']
        });
        collector3.on("collect", async collect3 => {
  
          const response3 = collect3.content.toLowerCase();
          await collect3.delete()
          if (parseInt(response3) < 1 || isNaN(parseInt(response3))) {
            return msg.edit({
              embeds: [
                embed.setDescription(
                  "Này! Số lượng phải lớn hơn hoặc bằng 1!\n**Hãy thử lại?**\n Ví dụ ``1``,``10``, vân vân."
                )]
            }
            );
          } else {
            winnersCount = parseInt(response3);
            collector3.stop(
              msg.edit({
                embeds: [
                  embed.setDescription(
                    `Tốt rồi! Tiếp theo, hãy lựa chọn phần thưởng mới cho sự kiện Giveaway?\n**Hãy phản hồi trong 30 giây!**`
                  )]
              })
            )
          }
          const collector4 = await message.channel.createMessageCollector(filter, {
          max: 3,
          time: 30000,
          errors: ['time']
        });
          collector4.on("collect", async collect4 => {
  
            const response4 = collect4.content.toLowerCase();
            prize = response4;
            await collect4.delete()
            collector4.stop(
              console.log(giveawayx),
              msg.edit({
                embeds: [
                  embed.setDescription(
                    `Đã chỉnh sửa`
                  )]
              }
              )
            );
            client.giveawaysManager.edit(gid, {
              newWinnerCount: winnersCount,
              newPrize: prize,
              addTime: time
            })
          });
        });
      });
    });
    collector.on('end', (collected, reason) => {
      if (reason == 'time') {
        message.reply({ embeds: [xembed] });
      }
    })
    try {
      collector2.on('end', (collected, reason) => {
        if (reason == 'time') {
  
          message.reply({ embeds: [xembed] });
        }
      });
      collector3.on('end', (collected, reason) => {
        if (reason == 'time') {
          message.reply({ embeds: [xembed] });
  
        }
      })
      collector4.on('end', (collected, reason) => {
        if (reason == 'time') {
  
          message.reply({ embeds: [xembed] });
        }
      })
    } catch (e) { }
  }