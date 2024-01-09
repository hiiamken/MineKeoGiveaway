const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ping',
    description: '🏓Kiểm tra ping của tôi!',
    run: async (client, interaction) => {
      let pembed = new EmbedBuilder()
		  .setColor("#EFB2FB")
		  .setTitle('Độ trễ của Bot')
		  .addFields({ name: '**Độ trễ**', 
                   value: `\`${Date.now() - interaction.createdTimestamp}ms\``
                 })
		  .addFields({ name: '**Phản hồi API**', 
                   value: `\`${Math.round(client.ws.ping)}ms\``
                 })
		  .setTimestamp()
                  .setFooter({
                     text: `${interaction.user.username}`,
                     iconURL: interaction.user.displayAvatarURL()
                  })
        interaction.reply({
          embeds: [pembed]
        });
    },
};