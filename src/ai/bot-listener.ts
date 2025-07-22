// src/ai/bot-listener.ts
import { config } from 'dotenv';
config(); // Load environment variables from .env file

import TelegramBot from 'node-telegram-bot-api';
import { db } from '@/lib/firebase';
import { doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

if (!botToken || !chatId) {
  console.error('Error: TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID must be set in the .env file.');
  process.exit(1);
}

const bot = new TelegramBot(botToken, { polling: true });

console.log('Bot listener started...');

bot.on('callback_query', async (callbackQuery) => {
  const msg = callbackQuery.message;
  const data = callbackQuery.data;

  if (!msg || !data) {
    console.error('Invalid callback query received.');
    return;
  }
  
  // Ensure the callback is from the designated admin chat
  if (msg.chat.id.toString() !== chatId) {
      console.warn(`Received callback from unauthorized chat ID: ${msg.chat.id}`);
      return;
  }

  const [action, moduleId] = data.split(':');

  if (!action || !moduleId) {
    console.error('Invalid callback data format.');
    return;
  }

  const moduleRef = doc(db, 'modules', moduleId);
  
  try {
    const docSnap = await getDoc(moduleRef);
    if (!docSnap.exists()) {
        await bot.editMessageText(`Aksi gagal: Modul tidak ditemukan lagi. Mungkin sudah dihapus.`, {
          chat_id: msg.chat.id,
          message_id: msg.message_id,
        });
        return;
    }
    
    const moduleTitle = docSnap.data()?.title || 'Tanpa Judul';

    if (action === 'approve_module') {
      await updateDoc(moduleRef, { status: 'approved' });
      console.log(`Module ${moduleId} approved.`);
      await bot.editMessageText(`✅ Modul "${moduleTitle}" telah disetujui dan sekarang tampil di aplikasi.`, {
        chat_id: msg.chat.id,
        message_id: msg.message_id,
        reply_markup: undefined,
      });
    } else if (action === 'deny_module') {
      await deleteDoc(moduleRef);
      console.log(`Module ${moduleId} denied and deleted.`);
      await bot.editMessageText(`❌ Pengajuan modul "${moduleTitle}" telah ditolak dan dihapus.`, {
        chat_id: msg.chat.id,
        message_id: msg.message_id,
        reply_markup: undefined,
      });
    }
  } catch (error) {
    console.error(`Error processing action "${action}" for module ${moduleId}:`, error);
    await bot.answerCallbackQuery(callbackQuery.id, {
        text: 'Terjadi kesalahan di server saat memproses aksi.',
        show_alert: true,
    });
  }
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log("Stopping bot listener...");
    bot.stopPolling().then(() => {
        console.log("Bot polling stopped.");
        process.exit(0);
    });
});
process.on('SIGTERM', () => {
    console.log("Stopping bot listener...");
    bot.stopPolling().then(() => {
        console.log("Bot polling stopped.");
        process.exit(0);
    });
});
