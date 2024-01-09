const register = require('../../utils/slashsync');
const { ActivityType } = require('discord.js');

module.exports = async (client) => {
  await register(client, client.register_arr.map((command) => ({
    name: command.name,
    description: command.description,
    options: command.options,
    type: '1'
  })), {
    debug: true
  });
  console.log(`[ / | Slash Command ] - ✅ Loaded all slash commands!`)
  let invite = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=applications.commands%20bot`;
  // Danh sách các activities
  const activities = [
    { name: 'Tham gia Giveaway đi mọi người!', type: ActivityType.Custom },
    { name: 'Đang theo dõi server...', type: ActivityType.Custom },
    // Thêm các activities khác theo ý bạn
  ];

  // Đặt index hiện tại của activity
  let currentActivity = 0;

  // Hàm thay đổi activity mỗi 30 giây
  setInterval(() => {
    client.user.setPresence({
      activities: [activities[currentActivity]],
      status: 'idle',
    });

    // Cập nhật index cho activity tiếp theo hoặc quay lại đầu nếu đến cuối danh sách
    currentActivity = (currentActivity + 1) % activities.length;
  }, 30000); // 30000 milliseconds = 30 giây

  console.log(`[STATUS] ${client.user.tag} đang trực tuyến!\n[INFO] Bot by TKen\n[Invite Link] ${invite}`);
};