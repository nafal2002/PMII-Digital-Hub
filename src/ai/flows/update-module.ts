'use server';

/**
 * @fileOverview A flow to update an existing module in the Firestore database.
 *
 * - updateModule - A function that handles updating a module.
 * - UpdateModuleInput - The input type for the updateModule function.
 * - UpdateModuleOutput - The return type for the updateModule function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const UpdateModuleInputSchema = z.object({
  id: z.string().describe('The ID of the module to update.'),
  title: z.string().describe('The new title of the module.'),
  description: z.string().describe('The new description of the module.'),
  category: z.string().describe('The new category of the module.'),
});
export type UpdateModuleInput = z.infer<typeof UpdateModuleInputSchema>;

const UpdateModuleOutputSchema = z.object({
  success: z.boolean().describe('Whether the module was updated successfully.'),
});
export type UpdateModuleOutput = z.infer<typeof UpdateModuleOutputSchema>;

export async function updateModule(input: UpdateModuleInput): Promise<UpdateModuleOutput> {
  return updateModuleFlow(input);
}

const updateModuleFlow = ai.defineFlow(
  {
    name: 'updateModuleFlow',
    inputSchema: UpdateModuleInputSchema,
    outputSchema: UpdateModuleOutputSchema,
  },
  async ({ id, ...dataToUpdate }) => {
    try {
      const moduleRef = doc(db, 'modules', id);
      await updateDoc(moduleRef, dataToUpdate);
      console.log('Document with ID updated: ', id);
      return { success: true };
    } catch (error) {
      console.error('Error updating document: ', error);
      return { success: false };
    }
  }
);
