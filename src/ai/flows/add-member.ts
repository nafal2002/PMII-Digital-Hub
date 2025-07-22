// src/ai/flows/add-member.ts
'use server';

/**
 * @fileOverview A flow to add new members to the Firestore database.
 *
 * - addMember - A function that handles adding a new member.
 * - AddMemberInput - The input type for the addMember function.
 * - AddMemberOutput - The return type for the addMember function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

const AddMemberInputSchema = z.object({
  fullName: z.string().describe('Full name of the member.'),
  nim: z.string().describe('Student identification number.'),
  faculty: z.string().describe('Faculty of the member.'),
  year: z.string().describe('The year the member enrolled.'),
  email: z.string().email().describe('Email address of the member.'),
  whatsapp: z.string().describe('WhatsApp number of the member.'),
});
export type AddMemberInput = z.infer<typeof AddMemberInputSchema>;

const AddMemberOutputSchema = z.object({
  success: z.boolean().describe('Whether the member was added successfully.'),
  memberId: z.string().optional().describe('The ID of the newly created member document.'),
});
export type AddMemberOutput = z.infer<typeof AddMemberOutputSchema>;

export async function addMember(input: AddMemberInput): Promise<AddMemberOutput> {
  return addMemberFlow(input);
}

const addMemberFlow = ai.defineFlow(
  {
    name: 'addMemberFlow',
    inputSchema: AddMemberInputSchema,
    outputSchema: AddMemberOutputSchema,
  },
  async (input) => {
    try {
      const docRef = await addDoc(collection(db, 'members'), input);
      console.log('Document written with ID: ', docRef.id);
      return {
        success: true,
        memberId: docRef.id,
      };
    } catch (error) {
      console.error('Error adding document: ', error);
      return {
        success: false,
      };
    }
  }
);
