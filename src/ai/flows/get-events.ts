'use server';
/**
 * @fileOverview A flow to get a list of events.
 *
 * - getEvents - A function that handles fetching events.
 * - GetEventsInput - The input type for the getEvents function.
 * - GetEventsOutput - The return type for the getEvents function.
 */

import { z } from 'genkit';
import { ai } from '@/ai/genkit';


const EventSchema = z.object({
  src: z.string().optional(),
  alt: z.string().optional(),
  hint: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
});

export const GetEventsInputSchema = z.object({
  type: z.enum(['past', 'upcoming']).describe('The type of events to get.'),
});

const GetEventsOutputSchema = z.object({
  events: z.array(EventSchema),
});

export type GetEventsInput = z.infer<typeof GetEventsInputSchema>;
export type GetEventsOutput = z.infer<typeof GetEventsOutputSchema>;

// Static data for events as the app doesn't have a database for them yet.
const pastEvents = [
  {
    src: 'https://placehold.co/600x400.png',
    alt: 'PKD 2023',
    hint: 'student meeting',
  },
  {
    src: 'https://placehold.co/600x400.png',
    alt: 'Seminar Kebangsaan',
    hint: 'conference presentation',
  },
  {
    src: 'https://placehold.co/600x400.png',
    alt: 'Aksi Sosial',
    hint: 'community volunteering',
  },
  {
    src: 'https://placehold.co/600x400.png',
    alt: 'Rapat Anggota',
    hint: 'group discussion',
  },
];

const upcomingEvents = [
    {
        name: "Pelatihan Kader Dasar (PKD) 2024",
        description: "Pendaftaran PKD angkatan ke-XXI telah dibuka. Segera daftarkan diri Anda sebelum kuota terpenuhi."
    }
];

export async function getEvents(input: GetEventsInput): Promise<GetEventsOutput> {
  if (input.type === 'past') {
    return { events: pastEvents };
  } else {
    return { events: upcomingEvents };
  }
}
