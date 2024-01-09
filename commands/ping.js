const Discord = require('discord.js');
const config = require('../config.json');
module.exports.run = async (client, message, args) => {
  let m = await message.reply("Đang thu thập dữ liệu...")
  let pong = new Discord.EmbedBuilder()
    .setAuthor({
      name: `🏓 Ponk!`, 
      iconURL: message.author.displayAvatarURL()
    })
    .setTitle("Độ trễ của Bot")
    .setColor('#2F3136')	
    .setTimestamp()
                 
    .addFields([
   { name: '**Độ trễ**', value: `\`${Date.now() - message.createdTimestamp}ms\`` },
   { name: '**Phản hồi API**', value: `\`${Math.round(client.ws.ping)}ms\`` },
    ])
    .setFooter({
      text: `Yêu cầu bởi ${message.author.tag}`, 
      iconURL: message.author.displayAvatarURL()
    });

     m.delete()
  message.reply({ content: " ", embeds: [pong] })
}