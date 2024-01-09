const Discord = require("discord.js");
const { ApplicationCommandOptionType } = require("discord.js");
const messages = require("../utils/message");
const ms = require("ms");
module.exports = {
  name: "start",
  description: "🎉 Bắt đầu một sự kiện giveaway",

  options: [
    {
      name: "duration",
      description: "Thời gian diễn ra sự kiện giveaway. Ví dụ: 1m, 1h, 1d",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "winners",
      description: "Số người chiến thắng của sự kiện giveaway",
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
    {
      name: "prize",
      description: "Phần thưởng cho sự kiện giveaway",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "channel",
      description: "Kênh để bắt đầu sự kiện giveaway",
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
    {
      name: "bonusrole1",
      description: "Role thứ nhất nhận phần thưởng thêm",
      type: ApplicationCommandOptionType.Role,
      required: false,
    },
    {
      name: "bonusamount1",
      description: "Số lượng phần thưởng thêm cho role thứ nhất",
      type: ApplicationCommandOptionType.Integer,
      required: false,
    },
    {
      name: "bonusrole2",
      description: "Role thứ hai nhận phần thưởng thêm",
      type: ApplicationCommandOptionType.Role,
      required: false,
    },
    {
      name: "bonusamount2",
      description: "Số lượng phần thưởng thêm cho role thứ hai",
      type: ApplicationCommandOptionType.Integer,
      required: false,
    },
    {
      name: "bonusrole3",
      description: "Role thứ ba nhận phần thưởng thêm",
      type: ApplicationCommandOptionType.Role,
      required: false,
    },
    {
      name: "bonusamount3",
      description: "Số lượng phần thưởng thêm cho role thứ ba",
      type: ApplicationCommandOptionType.Integer,
      required: false,
    },
    {
      name: "invite",
      description:
        "Link mời đến máy chủ bạn muốn đặt làm yêu cầu tham gia giveaway",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
    {
      name: "role",
      description: "Role bạn muốn đặt là yêu cầu tham gia giveaway",
      type: ApplicationCommandOptionType.Role,
      required: false,
    },
  ],

  run: async (client, interaction) => {
    if (
      !interaction.member.permissions.has("ManageMessages") &&
      !interaction.member.roles.cache.some((r) => r.name === "Giveaways")
    ) {
      return interaction.reply({
        content:
          ":x: Bạn cần có quyền quản lý tin nhắn để bắt đầu sự kiện giveaway.",
        ephemeral: true,
      });
    }

    const giveawayChannel = interaction.options.getChannel("channel");
    const giveawayDuration = interaction.options.getString("duration");
    const giveawayWinnerCount = interaction.options.getInteger("winners");
    const giveawayPrize = interaction.options.getString("prize");

    if (!giveawayChannel.isTextBased()) {
      return interaction.reply({
        content: ":x: Vui lòng chọn một kênh văn bản!",
        ephemeral: true,
      });
    }
    if (isNaN(ms(giveawayDuration))) {
      return interaction.reply({
        content: ":x: Vui lòng chọn một thời gian hợp lệ!",
        ephemeral: true,
      });
    }
    if (giveawayWinnerCount < 1) {
      return interaction.reply({
        content:
          ":x: Vui lòng chọn số lượng người chiến thắng hợp lệ, lớn hơn hoặc bằng một.",
      });
    }

    // Xử lý bonus roles
    let bonusEntriesConfig = [];
    for (let i = 1; i <= 3; i++) {
      const bonusRole = interaction.options.getRole(`bonusrole${i}`);
      const bonusAmount = interaction.options.getInteger(`bonusamount${i}`);
      if (bonusRole && bonusAmount) {
        bonusEntriesConfig.push({
          role: bonusRole, // Lưu trữ đối tượng role
          entries: bonusAmount, // Lưu trữ số lượng entries
          bonusFunction: new Function(
            "member",
            `return member.roles.cache.has('${bonusRole.id}') ? ${bonusAmount} : null`
          ),
          cumulative: false,
        });
      }
    }

    let rolereq = interaction.options.getRole("role");
    let invite = interaction.options.getString("invite");

    await interaction.deferReply({ ephemeral: true });
    let reqinvite;
    if (invite) {
      let invitex = await client.fetchInvite(invite);
      let client_is_in_server = client.guilds.cache.get(invitex.guild.id);
      reqinvite = invitex;
      if (!client_is_in_server) {
        const gaEmbed = {
          author: {
            name: client.user.username,
            iconURL: client.user.displayAvatarURL(),
          },
          title: "Kiểm Tra Server!",
          url: "https://github.com/hiiamken",
          description:
            "Woah woah woah! Tôi thấy một server mới! Bạn chắc chắn rằng tôi có ở đó không? Bạn cần mời tôi đến đó để đặt điều này làm yêu cầu! 😳",
          timestamp: new Date(),
          footer: {
            iconURL: client.user.displayAvatarURL(),
            text: "Kiểm Tra Server",
          },
        };
        return interaction.editReply({ embeds: [gaEmbed] });
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
      bonusEntries: bonusEntriesConfig,
      // Messages
      messages,
      extraData: {
        server: reqinvite == null ? "null" : reqinvite.guild.id,
        role: rolereq == null ? "null" : rolereq.id,
      },
    });
    interaction.editReply({
      content: `Giveaway đã bắt đầu trong kênh ${giveawayChannel}!`,
      ephemeral: true,
    });
    // Phần thông báo về bonus roles
    if (bonusEntriesConfig.length > 0) {
      let bonusRolesDescriptions = bonusEntriesConfig
        .map((entry) => {
          // Sử dụng cú pháp mention để tạo ra tag cho role
          // Điều này sẽ hiển thị tên role với màu sắc tương ứng trên server
          return `► <@&${entry.role.id}> - x**${entry.entries}** giải thưởng`;
        })
        .join("\n");

      let giveaway = new Discord.EmbedBuilder()
        .setAuthor({ name: `Bonus:` })
        .setDescription(bonusRolesDescriptions)
        .setColor("#EFB2FB")
        .setTimestamp();
      giveawayChannel.send({ embeds: [giveaway] });
    }
  },
};