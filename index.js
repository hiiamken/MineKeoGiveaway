// Import các modules cần thiết từ thư viện Discord.js
const Discord = require("discord.js");
const { Client, GatewayIntentBits, Partials } = require("discord.js");

// Tạo một client mới cho bot
const client = new Client({
  partials: [
    Partials.Message, // cho tin nhắn
    Partials.Channel, // cho kênh văn bản
    Partials.GuildMember, // cho thành viên trong server
    Partials.Reaction, // cho phản ứng tin nhắn
  ],
  intents: [
    GatewayIntentBits.Guilds, // cho những thao tác liên quan đến server
    GatewayIntentBits.GuildInvites, // cho quản lý lời mời vào server
    GatewayIntentBits.GuildMessages, // cho tin nhắn trong server
    GatewayIntentBits.GuildMessageReactions, // cho phản ứng của tin nhắn
    GatewayIntentBits.MessageContent, // bật nếu cần các thao tác liên quan đến nội dung tin nhắn
  ],
});

// Import module fs để làm việc với file system
const fs = require("fs");
const config = require("./config.json");
client.config = config;

// Khởi tạo hệ thống quản lý các sự kiện Giveaway trong Discord
const { GiveawaysManager } = require("discord-giveaways");
client.giveawaysManager = new GiveawaysManager(client, {
  storage: "./storage/giveaways.json",
  default: {
    botsCanWin: false,
    embedColor: "#2F3136",
    reaction: "🎉",
    lastChance: {
      enabled: true,
      content: `🛑 **Cơ hội cuối để tham gia** 🛑`,
      threshold: 5000,
      embedColor: '#FF0000'
    }
  }
});
//Coded by TKen

/* Chạy tất cả các sự kiện Discord */
fs.readdir("./events/discord", (_err, files) => {
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    const event = require(`./events/discord/${file}`);
    let eventName = file.split(".")[0];
    console.log(`[Event]   ✅  Loaded: ${eventName}`);
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./events/discord/${file}`)];
  });
});

/* Chạy tất cả các sự kiện Giveaway */
fs.readdir("./events/giveaways", (_err, files) => {
  files.forEach((file) => {
    if (!file.endsWith(".js")) return;
    const event = require(`./events/giveaways/${file}`);
    let eventName = file.split(".")[0];
    console.log(`[Event]   🎉 Loaded: ${eventName}`);
    client.giveawaysManager.on(eventName, (...file) => event.execute(...file, client)), delete require.cache[require.resolve(`./events/giveaways/${file}`)];
  })
})

// Tạo một collection để lưu trữ các lệnh (message commands)
client.commands = new Discord.Collection();
/* Tải tất cả các lệnh */
fs.readdir("./commands/", (_err, files) => {
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    client.commands.set(commandName, {
      name: commandName,
      ...props
    });
    console.log(`[Command] ✅  Loaded: ${commandName}`);
  });
});

// Tạo một collection để lưu trữ các slash command
client.interactions = new Discord.Collection();
// Tạo một mảng trống để đăng ký slash command
client.register_arr = []
/* Tải tất cả các slash command */
fs.readdir("./slash/", (_err, files) => {
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./slash/${file}`);
    let commandName = file.split(".")[0];
    client.interactions.set(commandName, {
      name: commandName,
      ...props
    });
    client.register_arr.push(props)
  });
});

// Đăng nhập vào Discord bằng thông tin token trong file config
client.login(config.token);
