const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();

// 1. THIẾT LẬP BOT TELEGRAM
const token = '8496607274:AAHHkMttTVoibyqJQB5V6KWcIzuq8HLBu2w';
const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, '🎮 Chào mừng bạn đến với Woody Block Jam!\n\nHãy giải trí và rèn luyện trí não với tựa game xếp hình cực cuốn này. Bấm nút bên dưới để chơi ngay nhé!', {
    reply_markup: {
      inline_keyboard: [
        [{
          text: "🚀 Chơi Ngay (Play Now)",
          web_app: {url: "https://telewoodybockjam.web.app"} 
        }]
      ]
    }
  });
});

// 2. TẠO WEB SERVER GIẢ ĐỂ RENDER KHÔNG BÁO LỖI
app.get('/', (req, res) => {
  res.send('Máy chủ Bot Woody Block Jam đang chạy ngon lành!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server đang chạy trên port ${port}`);
});
