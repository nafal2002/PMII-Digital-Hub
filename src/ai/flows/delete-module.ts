'use server';

/**
 * @fileOverview A flow to delete a module from the Firestore database.
 *
 * - deleteModule - A function that handles deleting a module.
 * - DeleteModuleInput - The input type for the deleteModule function.
 * - DeleteModuleOutput - The return type for the deleteModule function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { db } from '@/lib/firebase';
import { doc, deleteDoc, getDoc } from 'firebase/firestore';
import { sendTelegramNotification } from './send-telegram-notification';


const DeleteModuleInputSchema = z.object({
  id: z.string().describe('The ID of the module to delete.'),
});
export type DeleteModuleInput = z.infer<typeof DeleteModuleInputSchema>;

const DeleteModuleOutputSchema = z.object({
  success: z.boolean().describe('Whether the module was deleted successfully.'),
});
export type DeleteModuleOutput = z.infer<typeof DeleteModuleOutputSchema>;

export async function deleteModule(input: DeleteModuleInput): Promise<DeleteModuleOutput> {
  return deleteModuleFlow(input);
}

const deleteModuleFlow = ai.defineFlow(
  {
    name: 'deleteModuleFlow',
    inputSchema: DeleteModuleInputSchema,
    outputSchema: DeleteModuleOutputSchema,
  },
  async ({ id }) => {
    try {
      const moduleRef = doc(db, 'modules', id);
      const moduleSnap = await getDoc(moduleRef);
      
      if (!moduleSnap.exists()) {
          console.error('Module not found for deletion');
          return { success: false };
      }

      const moduleData = moduleSnap.data();
      const { title, category } = moduleData;

      await deleteDoc(doc(db, 'modules', id));
      console.log('Document with ID deleted: ', id);
      
      // Send notification
      try {
        const message = `🗑️ *Modul Dihapus!*\n\n*Judul:* ${title}\n*Kategori:* ${category}\n\nModul telah dihapus dari sistem.`;
        await sendTelegramNotification({ text: message });
      } catch (notificationError) {
        console.error("Failed to send Telegram notification:", notificationError);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting document: ', error);
      return { success: false };
    }
  }
);
