const {
  EmbedBuilder,
  ActionRowBuilder,
  SelectMenuBuilder,
  ComponentType,
} = require("discord.js");
const config = require("../config.json");

module.exports = {
  name: "help",
  description: "📜 Xem tất cả các lệnh có sẵn cho bot!",
  run: async (client, interaction) => {
    const embed = new EmbedBuilder()
      .setTitle(`Các lệnh của ${client.user.username}`)
      .setColor("#EFB2FB")
      .setDescription(
        "**Vui lòng chọn một danh mục để xem tất cả các lệnh trong đó**"
      )
      .addFields({
        name: `Links:`,
        value: `- [Discord Server](https://discord.gg/minekeo)\n- [GitHub](https://github.com/hiiamken/MineKeoGiveaway)`,
        inline: true,
      })

      .setTimestamp()
      .setFooter({
        text: `Yêu cầu bởi ${interaction.user.username} | ` + config.copyright,
        iconURL: interaction.user.displayAvatarURL(),
      });

    const giveaway = new EmbedBuilder()
      .setTitle("Danh mục » Giveaway")
      .setColor("#EFB2FB")
      .setDescription("```yaml\nCác lệnh Giveaway:```")
      .addFields(
        {
          name: "Create / Start",
          value: `Tạo một sự kiện giveaway!\n > **Loại: __\`slash\` / \`message\`__**`,
          inline: true,
        },
        {
          name: "Drop",
          value: `Bắt đầu sự kiện giveaway!\n > **Loại: __\`slash\` / \`message\`__**`,
          inline: true,
        },
        {
          name: "Edit",
          value: `Chỉnh sửa một sự kiện giveaway đang có!\n > **Loại: __\`slash\` / \`message\`__**`,
          inline: true,
        },
        {
          name: "End",
          value: `Kết thúc một sự kiện giveaway!\n > **Loại: __\`slash\` / \`message\`__**`,
          inline: true,
        },
        {
          name: "List",
          value: `Danh sách tất cả giveaway đang có!\n > **Loại: __\`slash\` / \`message\`__**`,
          inline: true,
        },
        {
          name: "Pause",
          value: `Tạm dừng một sự kiện giveaway đang diễn ra!\n > **Loại: __\`slash\`__**`,
          inline: true,
        },
        {
          name: "Reroll",
          value: `Reroll một sự kiện giveaway!\n > **Loại: __\`slash\` / \`message\`__**`,
          inline: true,
        },
        {
          name: "Resume",
          value: `Tiếp tục một sự kiện giveaway!\n > **Loại: __\`slash\`__**`,
          inline: true,
        }
      )
      .setTimestamp()
      .setFooter({
        text: `Yêu cầu bởi ${interaction.user.username} | ` + config.copyright,
        iconURL: interaction.user.displayAvatarURL(),
      });

    const general = new EmbedBuilder()
      .setTitle("Danh mục » Chung")
      .setColor("#EFB2FB")
      .setDescription("```yaml\nCác lệnh chung:```")
      .addFields(
        {
          name: "Help",
          value: `Các lệnh hiện có!\n > **Loại: __\`slash\` / \`message\`__**`,
          inline: true,
        },
        {
          name: "Invite",
          value: `Lấy link mời bot!\n > **Loại: __\`slash\` / \`message\`__**`,
          inline: true,
        },
        {
          name: "Ping",
          value: `Kiểm tra độ trễ của bot!\n > **Loại: __\`slash\` / \`message\`__**`,
          inline: true,
        }
      )
      .setTimestamp()
      .setFooter({
        text: `Yêu cầu bởi ${interaction.user.username} | ` + config.copyright,
        iconURL: interaction.user.displayAvatarURL(),
      });

    const components = (state) => [
      new ActionRowBuilder().addComponents(
        new SelectMenuBuilder()
          .setCustomId("help-menu")
          .setPlaceholder("Vui lòng lựa chọn danh mục")
          .setDisabled(state)
          .addOptions([
            {
              label: `Giveaways`,
              value: `giveaway`,
              description: `Xem tất cả các lệnh liên quan tới Giveaway!`,
              emoji: `🎉`,
            },
            {
              label: `Chung`,
              value: `general`,
              description: `Xem tất cả các lệnh chung!`,
              emoji: `⚙`,
            },
          ])
      ),
    ];

    const initialMessage = await interaction.reply({
      embeds: [embed],
      components: components(false),
    });

    const filter = (interaction) =>
      interaction.user.id === interaction.member.id;

    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      componentType: ComponentType.SelectMenu,
      idle: 300000,
      dispose: true,
    });

    collector.on("collect", (interaction) => {
      if (interaction.values[0] === "giveaway") {
        interaction
          .update({ embeds: [giveaway], components: components(false) })
          .catch((e) => {});
      } else if (interaction.values[0] === "general") {
        interaction
          .update({ embeds: [general], components: components(false) })
          .catch((e) => {});
      }
    });
    collector.on("end", (collected, reason) => {
      if (reason == "time") {
        initialMessage.edit({
          content: "Lỗi khi load, vui lòng thử lại!",
          components: [],
        });
      }
    });
  },
};
