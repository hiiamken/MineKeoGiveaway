const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../config.json');

module.exports.run = async (client, message, args) => {
    const row = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
        .setLabel(`Mời ${client.user.username}`)
        .setStyle(ButtonStyle.Link)
        .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=applications.commands%20bot`),
        new ButtonBuilder()
        .setLabel('Máy chủ hỗ trợ')
        .setStyle(ButtonStyle.Link)
        .setURL("https://discord.gg/minekeo"),
    )
    let invite = new EmbedBuilder()
     .setAuthor({ 
          name: `Mời ${client.user.username}`, 
          iconURL: client.user.displayAvatarURL() 
     })  
    .setTitle("Link mời và hỗ trợ!")
    .setDescription(`Mời ${client.user} vào máy chủ của bạn để sử dụng các tính năng giveaway tốt nhất!`)
    .setColor("#EFB2FB")
    .setTimestamp()
    .setFooter({
      text: `Yêu cầu bởi ${message.author.username} | ` + config.copyright, 
      iconURL: message.author.displayAvatarURL()
    });
    message.reply({ embeds: [invite], components: [row]});
}