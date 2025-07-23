
'use server';

/**
 * @fileOverview A chatbot flow that can answer questions about PMII.
 *
 * This flow uses a static context injected directly into the prompt,
 * rather than dynamic tools, to ensure reliability and consistency.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { Message, Stream } from 'genkit';

// == MANUAL DATA SOURCES ==
// All data is hardcoded here to be passed directly to the AI model.

const upcomingEvents = [
    {
        name: "Pelatihan Kader Dasar (PKD) 2024",
        description: "Pendaftaran PKD angkatan ke-XXI telah dibuka."
    }
];

const modules = [
  { title: "Buku Menjadi Kader PMII" },
  { title: "Nilai Dasar Pergerakan (NDP)" },
  { title: "Anggaran Dasar & Rumah Tangga (AD/ART)" },
  { title: "Manajemen Aksi & Advokasi" },
  { title: "Hasil Muspimnas Tulungagung 2022" },
  { title: "Materi Teknik Persidangan" },
  { title: "Modul MAPABA Proletariat" },
  { title: "Materi Nahdlatunnisa" },
  { title: "Dasar-Dasar PMII" },
  { title: "Materi Ke-KOPRI-an" },
  { title: "Dasar-Dasar Aswaja" }
];

const documents = [
  { title: "AD/ART PMII" },
  { title: "Notulen Rapat Pleno I" },
  { title: "LPJ Kegiatan PKD 2023" },
  { title: "SK Pengurus Cabang" },
  { title: "Panduan Administrasi" },
  { title: "Sejarah dan NDP PMII" },
];

const members = [
    { fullName: "Ahmad Zaini" },
    { fullName: "Siti Fatimah" },
];


// == AI System Prompt & Model Configuration ==

const chatbotSystemPrompt = `You are a simple AI assistant for PMII.
Answer the user's questions simply and concisely in Bahasa Indonesia based on the information provided below.
Do not answer questions outside of the PMII context.

## Informasi PMII:
- Acara Akan Datang: {{upcomingEvents.length}} acara. Detail: {{#each upcomingEvents}}{{name}} - {{description}}{{/each}}
- Total Modul: {{modules.length}} modul.
- Total Dokumen: {{documents.length}} dokumen.
- Total Anggota: {{members.length}} anggota terdaftar.
`;

const chatbotPrompt = ai.definePrompt({
    name: 'chatbotPrompt',
    model: 'googleai/gemini-2.0-flash',
    system: chatbotSystemPrompt,
    input: {
        schema: z.object({
            history: z.array(z.custom<Message>()),
            upcomingEvents: z.any(),
            modules: z.any(),
            documents: z.any(),
            members: z.any(),
        })
    }
});


// == Main Chat Function ==

export async function chat(history: Message[]): Promise<Stream<string>> {
    
  const { stream } = ai.generateStream({
      prompt: {
        template: chatbotPrompt,
        input: {
            history,
            upcomingEvents,
            modules,
            documents,
            members,
        }
      },
      history: history.filter(m => m.content?.[0]?.text?.trim() !== ''), // Ensure we dont send empty parts
  });

  return stream;
}
