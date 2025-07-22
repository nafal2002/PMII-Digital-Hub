'use server';

/**
 * @fileOverview A flow to send a message to a Telegram chat.
 *
 * - sendTelegramNotification - A function that handles sending the message.
 * - SendTelegramNotificationInput - The input type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import TelegramBot from 'node-telegram-bot-api';

const SendTelegramNotificationInputSchema = z.object({
  text: z.string().describe('The message text to send.'),
});
export type SendTelegramNotificationInput = z.infer<typeof SendTelegramNotificationInputSchema>;

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

export async function sendTelegramNotification(input: SendTelegramNotificationInput): Promise<void> {
  return sendTelegramNotificationFlow(input);
}

const sendTelegramNotificationFlow = ai.defineFlow(
  {
    name: 'sendTelegramNotificationFlow',
    inputSchema: SendTelegramNotificationInputSchema,
    outputSchema: z.void(),
  },
  async ({ text }) => {
    if (!botToken || !chatId) {
      console.error('Telegram Bot Token or Chat ID is not configured in .env');
      // We don't throw an error to prevent the calling flow from failing.
      // The main operation (like adding a module) should still succeed.
      return;
    }

    try {
      const bot = new TelegramBot(botToken);
      await bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
      console.log('Telegram notification sent successfully.');
    } catch (error) {
      console.error('Failed to send Telegram message:', error);
      // We also don't re-throw the error here for the same reason as above.
    }
  }
);
