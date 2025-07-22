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

const AddModuleInputSchema = z.object({
  title: z.string().describe('Title of the module.'),
  description: z.string().describe('Description of the module.'),
  category: z.string().describe('Category of the module.'),
  fileUrl: z.string().optional().describe('URL of the module file.'),
});
export type AddModuleInput = z.infer<typeof AddModuleInputSchema>;

const AddModuleOutputSchema = z.object({
  success: z.boolean().describe('Whether the module was added successfully.'),
  moduleId: z.string().optional().describe('The ID of the newly created module document.'),
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
      const docRef = await addDoc(collection(db, 'modules'), input);
      console.log('Document written with ID: ', docRef.id);
      return {
        success: true,
        moduleId: docRef.id,
      };
    } catch (error) {
      console.error('Error adding document: ', error);
      return {
        success: false,
      };
    }
  }
);
