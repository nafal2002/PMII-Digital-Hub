// src/ai/flows/add-module.ts
'use server';

/**
 * @fileOverview A flow to add new modules to the Firestore database.
 *
 * - addModule - A function that handles adding a new module.
 * - AddModuleInput - The input type for the addModule function.
 * - AddModuleOutput - The return type for the addModule function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { uploadFileFromDataUri } from '@/lib/firebase-storage';
import { sendTelegramNotification } from './send-telegram-notification';

const AddModuleInputSchema = z.object({
  title: z.string().describe('Title of the module.'),
  description: z.string().describe('Description of the module.'),
  category: z.string().describe('Category of the module.'),
  fileDataUri: z.string().optional().describe("A module file (e.g., PDF) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type AddModuleInput = z.infer<typeof AddModuleInputSchema>;

const AddModuleOutputSchema = z.object({
  success: z.boolean().describe('Whether the module was added successfully.'),
  moduleId: z.string().optional().describe('The ID of the newly created module document.'),
  error: z.string().optional().describe('An error message if the operation failed.'),
});
export type AddModuleOutput = z.infer<typeof AddModuleOutputSchema>;

export async function addModule(input: AddModuleInput): Promise<AddModuleOutput> {
  return addModuleFlow(input);
}

const addModuleFlow = ai.defineFlow(
  {
    name: 'addModuleFlow',
    inputSchema: AddModuleInputSchema,
    outputSchema: AddModuleOutputSchema,
  },
  async (input) => {
    try {
      let fileUrl: string | undefined = undefined;

      if (input.fileDataUri) {
        fileUrl = await uploadFileFromDataUri(input.fileDataUri, 'module-files');
      }

      const moduleData = {
        title: input.title,
        description: input.description,
        category: input.category,
        fileUrl: fileUrl,
      };

      const docRef = await addDoc(collection(db, 'modules'), moduleData);
      console.log('Document written with ID: ', docRef.id);

      // Send notification, but don't block the response if it fails
      try {
        const message = `✅ *Modul Baru Ditambahkan!*\n\n*Judul:* ${input.title}\n*Kategori:* ${input.category}\n\nModul baru telah berhasil ditambahkan ke sistem.`;
        await sendTelegramNotification({ text: message });
      } catch (notificationError) {
        console.error("Failed to send Telegram notification:", notificationError);
        // Do not return an error to the user, as the main operation was successful.
      }


      return {
        success: true,
        moduleId: docRef.id,
      };
    } catch (error) {
      console.error('Error in addModuleFlow: ', error);
      return {
        success: false,
        error: 'Terjadi kesalahan saat menambahkan modul.',
      };
    }
  }
);
