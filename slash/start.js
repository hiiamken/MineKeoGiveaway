const Discord = require("discord.js")
const {  ApplicationCommandOptionType } = require("discord.js");
const messages = require("../utils/message");
const ms = require("ms")
module.exports = {
  name: 'start',
  description: '🎉 Bắt đầu một sự kiện giveaway',

  options: [
    {
      name: 'duration',
      description: 'Thời gian diễn ra sự kiện giveaway. Ví dụ: 1m, 1h, 1d',
      type: ApplicationCommandOptionType.String,
      required: true
    },
    {
      name: 'winners',
      description: 'Số người chiến thắng của sự kiện giveaway',
      type: ApplicationCommandOptionType.Integer,
      required: true
    },
    {
      name: 'prize',
      description: 'Phần thưởng cho sự kiện giveaway',
      type: ApplicationCommandOptionType.String,
      required: true
    },
    {
      name: 'channel',
      description: 'Kênh để bắt đầu sự kiện giveaway',
      type: ApplicationCommandOptionType.Channel,
      required: true
    },
    {
      name: 'bonusrole',
      description: 'Role nhận phần thưởng thêm',
      type: ApplicationCommandOptionType.Role,
      required: false
    },
    {
      name: 'bonusamount',
      description: 'Số lượng phần thưởng thêm mà role sẽ nhận',
      type: ApplicationCommandOptionType.Integer,
      required: false
    },
    {
      name: 'invite',
      description: 'Link mời đến máy chủ bạn muốn đặt làm yêu cầu tham gia giveaway',
      type: ApplicationCommandOptionType.String,
      required: false
    },
    {
      name: 'role',
      description: 'Role bạn muốn đặt là yêu cầu tham gia giveaway',
      type: ApplicationCommandOptionType.Role,
      required: false
    },
  ],

  run: async (client, interaction) => {

    // If the member doesn't have enough permissions
    if (!interaction.member.permissions.has('ManageMessages') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")) {
      return interaction.reply({
        content: ':x: Bạn cần có quyền quản lý tin nhắn để bắt đầu sự kiện giveaway.',
        ephemeral: true
      });
    }

    const giveawayChannel = interaction.options.getChannel('channel');
    const giveawayDuration = interaction.options.getString('duration');
    const giveawayWinnerCount = interaction.options.getInteger('winners');
    const giveawayPrize = interaction.options.getString('prize');

    if (!giveawayChannel.isTextBased()) {
      return interaction.reply({
        content: ':x: Vui lòng chọn một kênh văn bản!',
        ephemeral: true
      });
    }
   if(isNaN(ms(giveawayDuration))) {
    return interaction.reply({
      content: ':x: Vui lòng chọn một thời gian hợp lệ!',
      ephemeral: true
    });
  }
    if (giveawayWinnerCount < 1) {
      return interaction.reply({
        content: ':x: Vui lòng chọn số lượng người chiến thắng hợp lệ, lớn hơn hoặc bằng một.',
      })
    }

    const bonusRole = interaction.options.getRole('bonusrole')
    const bonusEntries = interaction.options.getInteger('bonusamount')
    let rolereq = interaction.options.getRole('role')
    let invite = interaction.options.getString('invite')

    if (bonusRole) {
      if (!bonusEntries) {
        return interaction.reply({
          content: `:x: Bạn phải chỉ định số lượng phần thưởng thêm cho ${bonusRole}!`,
          ephemeral: true
        });
      }
    }


    await interaction.deferReply({ ephemeral: true })
    let reqinvite;
    if (invite) {
      let invitex = await client.fetchInvite(invite)
      let client_is_in_server = client.guilds.cache.get(
        invitex.guild.id
      )
      reqinvite = invitex
      if (!client_is_in_server) {
          const gaEmbed = {
            author: {
              name: client.user.username,
              iconURL: client.user.displayAvatarURL() 
            },
            title: "Kiểm Tra Server!",
            url: "https://github.com/hiiamken",
            description:
            "Woah woah woah! Tôi thấy một server mới! Bạn chắc chắn rằng tôi có ở đó không? Bạn cần mời tôi đến đó để đặt điều này làm yêu cầu! 😳",
            timestamp: new Date(),
            footer: {
              iconURL: client.user.displayAvatarURL(),
              text: "Kiểm Tra Server"
            }
          }  
        return interaction.editReply({ embeds: [gaEmbed]})
      }
    }

    if (rolereq && !invite) {
      messages.inviteToParticipate = `**Nhấn vào 🎉 để tham gia!**\n>>> - Chỉ có thành viên có role ${rolereq} mới được phép tham gia sự kiện này!`;
    }
    if (rolereq && invite) {
      messages.inviteToParticipate = `**Nhấn vào 🎉 để tham gia!**\n>>> - Chỉ có thành viên có role ${rolereq} mới được phép tham gia sự kiện này!\n- Thành viên cần tham gia [server này](${invite}) để có thể tham gia sự kiện này!`;
    }
    if (!rolereq && invite) {
      messages.inviteToParticipate = `**Nhấn vào 🎉 để tham gia!**\n>>> - Thành viên cần tham gia [server này](${invite}) để có thể tham gia sự kiện này!`;
    }


    // Bắt đầu sự kiện giveaway
    client.giveawaysManager.start(giveawayChannel, {
      duration: ms(giveawayDuration),
      prize: giveawayPrize,
      winnerCount: parseInt(giveawayWinnerCount),
      hostedBy: client.config.hostedBy ? interaction.user : null,
      bonusEntries: [
        {
          bonus: new Function('member', `return member.roles.cache.some((r) => r.name === \'${bonusRole ?.name}\') ? ${bonusEntries} : null`),
          cumulative: false
        }
      ],
      // Messages
      messages,
      extraData: {
        server: reqinvite == null ? "null" : reqinvite.guild.id,
        role: rolereq == null ? "null" : rolereq.id,
      }
    });
    interaction.editReply({
      content:
        `Giveaway đã bắt đầu trong kênh ${giveawayChannel}!`,
      ephemeral: true
    })

    if (bonusRole) {
      let giveaway = new Discord.EmbedBuilder()
        .setAuthor({ name: `Bonus:` })
        .setDescription(
          `► **${bonusRole}** - x**${bonusEntries}** giải thưởng`
        )
        .setColor("#EFB2FB")
        .setTimestamp();
      giveawayChannel.send({ embeds: [giveaway] });
    }

  }

};