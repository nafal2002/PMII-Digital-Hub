'use server';

/**
 * @fileOverview A flow to retrieve all modules from the Firestore database.
 *
 * - getModules - A function that handles fetching all modules.
 * - ModuleData - The type for a single module's data.
 * - GetModulesOutput - The return type for the getModules function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

const ModuleDataSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  fileUrl: z.string().optional(),
  status: z.string().optional(),
});
export type ModuleData = z.infer<typeof ModuleDataSchema>;

const GetModulesOutputSchema = z.object({
  modules: z.array(ModuleDataSchema),
});
export type GetModulesOutput = z.infer<typeof GetModulesOutputSchema>;

export async function getModules(): Promise<GetModulesOutput> {
  return getModulesFlow();
}

const getModulesFlow = ai.defineFlow(
  {
    name: 'getModulesFlow',
    outputSchema: GetModulesOutputSchema,
  },
  async () => {
    try {
      const modulesCol = query(collection(db, 'modules'), orderBy('title'));
      const moduleSnapshot = await getDocs(modulesCol);
      const modulesList = moduleSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as ModuleData));
      return {
        modules: modulesList,
      };
    } catch (error) {
      console.error('Error getting documents: ', error);
      return {
        modules: [],
      };
    }
  }
);
