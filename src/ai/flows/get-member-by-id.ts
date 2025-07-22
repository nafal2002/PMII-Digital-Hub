// src/ai/flows/get-member-by-id.ts
'use server';

/**
 * @fileOverview A flow to retrieve a single member from the Firestore database by their ID.
 *
 * - getMemberById - A function that handles fetching a single member.
 * - GetMemberByIdInput - The input type for the getMemberById function.
 * - GetMemberByIdOutput - The return type for the getMemberById function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { MemberData } from './get-members';

const GetMemberByIdInputSchema = z.object({
  id: z.string().describe('The ID of the member to retrieve.'),
});
export type GetMemberByIdInput = z.infer<typeof GetMemberByIdInputSchema>;

const GetMemberByIdOutputSchema = z.object({
  member: z.custom<MemberData>().optional(),
});
export type GetMemberByIdOutput = z.infer<typeof GetMemberByIdOutputSchema>;

export async function getMemberById(input: GetMemberByIdInput): Promise<GetMemberByIdOutput> {
  return getMemberByIdFlow(input);
}

const getMemberByIdFlow = ai.defineFlow(
  {
    name: 'getMemberByIdFlow',
    inputSchema: GetMemberByIdInputSchema,
    outputSchema: GetMemberByIdOutputSchema,
  },
  async ({ id }) => {
    try {
      const docRef = doc(db, 'members', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          member: { ...docSnap.data(), id: docSnap.id } as MemberData,
        };
      } else {
        console.log('No such document!');
        return { member: undefined };
      }
    } catch (error) {
      console.error('Error getting document:', error);
      return { member: undefined };
    }
  }
);
