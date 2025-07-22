// src/ai/flows/get-members.ts
'use server';

/**
 * @fileOverview A flow to retrieve all members from the Firestore database.
 *
 * - getMembers - A function that handles fetching all members.
 * - MemberData - The type for a single member's data.
 * - GetMembersOutput - The return type for the getMembers function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

const MemberDataSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  nim: z.string(),
  faculty: z.string(),
  year: z.string(),
  email: z.string().email(),
  whatsapp: z.string(),
});
export type MemberData = z.infer<typeof MemberDataSchema>;

const GetMembersOutputSchema = z.object({
  members: z.array(MemberDataSchema),
});
export type GetMembersOutput = z.infer<typeof GetMembersOutputSchema>;


export async function getMembers(): Promise<GetMembersOutput> {
  return getMembersFlow();
}

const getMembersFlow = ai.defineFlow(
  {
    name: 'getMembersFlow',
    outputSchema: GetMembersOutputSchema,
  },
  async () => {
    try {
      const membersCol = collection(db, 'members');
      const memberSnapshot = await getDocs(membersCol);
      const membersList = memberSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as MemberData));
      return {
        members: membersList,
      };
    } catch (error) {
      console.error('Error getting documents: ', error);
      return {
        members: [],
      };
    }
  }
);
