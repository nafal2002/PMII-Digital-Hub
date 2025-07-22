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
import { doc, deleteDoc } from 'firebase/firestore';


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
      await deleteDoc(doc(db, 'modules', id));
      console.log('Document with ID deleted: ', id);
      return { success: true };
    } catch (error) {
      console.error('Error deleting document: ', error);
      return { success: false };
    }
  }
);
