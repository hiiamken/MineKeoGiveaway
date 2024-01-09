<center><img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=200&section=header&text=MineKeo-GiveAway&fontSize=80&fontAlignY=35&animation=twinkling&fontColor=gradient" /></center>


  <h1 align="center">MineKeo GiveAway v1.2.0</h1>

  <p align="center">Full tính năng của Giveaway mà các bạn cần!
    <br />
    <br />
    <a href="https://github.com/hiiamken/MineKeo-Bot-2.0/issues">Báo cáo lỗi hoặc muốn góp ý</a>
  </p>
</p>

## 🔥 Tính năng

-   ⏱️ Dễ sử dụng
-   🔄 Tự động restart khi bot bị crash
-   🇻🇳 Hỗ trợ tiếng Việt
-   ⚙️ Tuỳ chỉnh nhiều option! (giải thưởng, thời gian, số lượng người chiến thắng, quyền lợi, phần thưởng bonus, vv...)
-   🚀 Nhiều tính năng: tạo, chỉnh sửa, reroll, kết thúc, xoá và tạm dừng giveaway!
-   💥 Sự kiện: giveawayEnded, giveawayRerolled, giveawayDeleted, giveawayReactionAdded, giveawayReactionRemoved, endedGiveawayReactionAdded
-   🖋 Gửi tin nhắn riêng thông báo
-   🕸️ Lightweight!
-   và nhiều nhiều nữa!

## ✔️ Todolist

-   📁 Hỗ trợ đa đạng cơ sở dữ liệu (MySQL, MongoDB, ...)

## 🔧 Yêu cầu

Trước khi bắt đầu, bạn cần cài đặt:
-   [Node.js v16.9+](https://nodejs.org/en/blog/release/v16.9.0/)

## 🔗 Cách cài đặt

### Bước 1: Cài đặt các depencies:
Linux 
```sh
wget https://nodejs.org/dist/v16.18.0/node-v16.18.0-linux-x64.tar.xz
unxz node-v16.18.0-linux-x64.tar.xz
tar xvf node-v16.18.0-linux-x64.tar
mv node-v16.18.0-linux-x64 /usr/local/node

ln /usr/local/node/bin/node /usr/bin
ln /usr/local/node/bin/corepack /usr/bin
ln /usr/local/node/bin/npm /usr/bin

corepack enable
```
Windows 
```sh
# https://nodejs.org/en/blog/release/v16.9.1/ get node.js
npm install 
```

### Bước 2: Lấy Token Bot từ [đây](https://discord.com/developers) <br> <br>
### Bước 3 : Thay thế token vào [config.json](https://github.com/hiiamken/MineKeoGiveaway/blob/main/config.json) <br>
#### Thế là xong! Giờ hãy host của bạn là được <3

### Chạy với node
```sh
node index.js
```
### Chạy với pm2
```sh
npm install -g pm2@latest
pm2 start --name "Giveaway" index.js --watch
```
