const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();

const token = '8496607274:AAHHkMttTVoibyqJQB5V6KWcIzuq8HLBu2w'; 
const bot = new TelegramBot(token, {polling: true});

// ==========================================
// BẢNG GIÁ VẬT PHẨM (Quy đổi: 0.99$ = 50 Stars)
// ==========================================
const SHOP_ITEMS = {
  // Gói Remove Ads
  "removeads": { title: "No Ads", desc: "Remove ads + 2000 coin", price: 200 }, // 3.99$
  "removeadsbundle": { title: "No Ads Bundle", desc: "Remove ads + 2000 coin, 3 Freeze, 3 Hammer, 3 Magnet", price: 250 }, // 4.99$
  
  // Các gói Bundle
  "smallbundle": { title: "Small Bundle", desc: "1h unlimited heart + 6000 coin", price: 300 }, // 5.99$
  "mediumbundle": { title: "Medium Bundle", desc: "1h heart + 10000 coin, 2 Freeze, 2 Hammer, 2 Magnet", price: 500 }, // 9.99$
  "largebundle": { title: "Large Bundle", desc: "4h heart + 16000 coin, 4 Freeze, 4 Hammer, 4 Magnet", price: 850 }, // 16.99$

  // Các gói Coin
  "coin1": { title: "Coin Pack 1", desc: "1000 Coin", price: 50 }, // 0.99$
  "coin2": { title: "Coin Pack 2", desc: "5000 Coin", price: 200 }, // 3.99$
  "coin3": { title: "Coin Pack 3", desc: "10000 Coin", price: 400 }, // 7.99$
  "coin4": { title: "Coin Pack 4", desc: "25000 Coin", price: 750 }, // 14.99$
  "coin5": { title: "Coin Pack 5", desc: "50000 Coin", price: 1250 }, // 24.99$
  "coin6": { title: "Coin Pack 6", desc: "100000 Coin", price: 2500 }, // 49.99$

  // Các gói Booster
  "freeze": { title: "Booster Freeze", desc: "2000 coin + 3 Freeze", price: 100 }, // 1.99$
  "freezeoriginal": { title: "Booster Freeze Original", desc: "2000 coin + 3 Freeze", price: 150 }, // 2.99$
  "hammer": { title: "Booster Hammer", desc: "1500 coin + 3 Hammer", price: 100 }, // 1.99$
  "hammeroriginal": { title: "Booster Hammer Original", desc: "1500 coin + 3 Hammer", price: 150 }, // 2.99$
  "magnet": { title: "Booster Magnet", desc: "1000 coin + 3 Magnet", price: 100 }, // 1.99$
  "magnetoriginal": { title: "Booster Magnet Original", desc: "1000 coin + 3 Magnet", price: 150 }, // 2.99$

  // Piggy Bank
  "piggyhalf": { title: "Piggy Half", desc: "1500 coin", price: 75 }, // 1.49$
  "piggymax": { title: "Piggy Max", desc: "3000 coin", price: 150 }, // 2.99$

  // Starter & Deals
  "starter": { title: "Starter Pack", desc: "1h heart + 1000 coin, 1 Freeze, 1 Hammer, 1 Magnet", price: 150 }, // 2.99$
  "starteroriginal": { title: "Starter Pack Original", desc: "1h heart + 1000 coin, 1 Freeze, 1 Hammer, 1 Magnet", price: 250 }, // 4.99$
  "daily": { title: "Daily Deal", desc: "1h heart + 500 coin, 1 Freeze, 1 Hammer, 1 Magnet", price: 150 }, // 2.99$
  "dailyoriginal": { title: "Daily Deal Original", desc: "1h heart + 500 coin, 1 Freeze, 1 Hammer, 1 Magnet", price: 200 }, // 3.99$
  "weekend": { title: "Weekend Sale", desc: "3h heart + 1500 coin, 3 Freeze, 3 Hammer, 3 Magnet", price: 350 }, // 6.99$
  "weekendoriginal": { title: "Weekend Sale Original", desc: "3h heart + 1500 coin, 3 Freeze, 3 Hammer, 3 Magnet", price: 600 }, // 11.99$
  "rescue": { title: "Level Rescue Offer", desc: "3h heart + 1 Freeze, 1 Hammer, 1 Magnet", price: 75 }, // 1.49$
  "rescueoriginal": { title: "Rescue Offer Original", desc: "3h heart + 1 Freeze, 1 Hammer, 1 Magnet", price: 100 } // 1.99$
};

// ==========================================
// 1. LỆNH /START TRÊN TELEGRAM
// ==========================================
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const lang = msg.from.language_code || 'en'; 
  
  let welcomeMessage = lang.startsWith('vi') 
    ? '🎮 Chào mừng bạn đến với Woody Block Jam!\n\nHãy giải trí và rèn luyện trí não với tựa game xếp hình cực cuốn này. Bấm nút bên dưới để chơi ngay nhé!' 
    : '🎮 Welcome to Woody Block Jam!\n\nRelax and train your brain with this addictive puzzle game. Click the button below to play now!';
  let buttonText = lang.startsWith('vi') ? '🚀 Chơi Ngay' : '🚀 Play Now';

  bot.sendMessage(chatId, welcomeMessage, {
    reply_markup: { inline_keyboard: [[{ text: buttonText, web_app: {url: "https://telewoodybockjam.web.app"} }]] }
  });
});

// ==========================================
// 2. API TẠO HÓA ĐƠN IAP CHO UNITY
// ==========================================
app.get('/get-invoice', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); 

  const packId = req.query.packId; 

  if (!packId || !SHOP_ITEMS[packId]) {
    return res.status(400).json({ success: false, error: "Mã vật phẩm không tồn tại!" });
  }

  const itemInfo = SHOP_ITEMS[packId];

  try {
    const invoiceLink = await bot.createInvoiceLink(
      itemInfo.title,       
      itemInfo.desc,        
      packId,               
      '',                   
      'XTR',                
      [{ label: 'Giá (Stars)', amount: itemInfo.price }] 
    );
    
    res.json({ success: true, link: invoiceLink });
  } catch (error) {
    console.error("Lỗi tạo hóa đơn:", error);
    res.status(500).json({ success: false, error: error.toString() });
  }
});

// ==========================================
// 3. API NHẬN POSTBACK TỪ ADSGRAM (SERVER-TO-SERVER)
// ==========================================
app.get('/adsgram-reward', (req, res) => {
  // Cho phép gọi xuyên domain
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const userId = req.query.userid;
  const signature = req.query.signature;

  console.log(`[Adsgram] Nhận báo cáo xem video từ user: ${userId}`);

  // Trả về mã 200 OK để hệ thống Adsgram biết là máy chủ của bạn đã ghi nhận
  // Lưu ý: Việc cộng vàng thực tế vẫn diễn ra ở file .jslib trong Unity để người chơi nhận thưởng ngay lập tức.
  res.status(200).send("OK");
});

// ==========================================
// 4. SERVER CHẠY NỀN
// ==========================================
app.get('/', (req, res) => {
  res.send('Máy chủ Bot Woody Block Jam đang chạy hoàn hảo!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server đang chạy trên port ${port}`);
});
