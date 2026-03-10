const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();

const token = '8496607274:AAHHkMttTVoibyqJQB5V6KWcIzuq8HLBu2w'; 
const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  // Lấy mã ngôn ngữ của người dùng (nếu không có thì mặc định là 'en')
  const lang = msg.from.language_code || 'en'; 

  let welcomeMessage = '';
  let buttonText = '';

  // Kiểm tra nếu là tiếng Việt
  if (lang.startsWith('vi')) {
    welcomeMessage = '🎮 Chào mừng bạn đến với Woody Block Jam!\n\nHãy giải trí và rèn luyện trí não với tựa game xếp hình cực cuốn này. Bấm nút bên dưới để chơi ngay nhé!';
    buttonText = '🚀 Chơi Ngay';
  } 
  // Nếu là tiếng Anh hoặc các ngôn ngữ khác
  else {
    welcomeMessage = '🎮 Welcome to Woody Block Jam!\n\nRelax and train your brain with this addictive puzzle game. Click the button below to play now!';
    buttonText = '🚀 Play Now';
  }

  // Gửi tin nhắn
  bot.sendMessage(chatId, welcomeMessage, {
    reply_markup: {
      inline_keyboard: [
        [{
          text: buttonText,
          web_app: {url: "https://telewoodybockjam.web.app"} 
        }]
      ]
    }
  });
});

app.get('/', (req, res) => {
  res.send('Máy chủ Bot Woody Block Jam đang chạy ngon lành!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server đang chạy trên port ${port}`);
});
