
'use server';

/**
 * @fileOverview A chatbot flow that can answer questions about PMII.
 *
 * This flow uses tools to access information about events, modules, and members.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getModules as fetchModules } from './get-modules';
import { getMembers as fetchMembers } from './get-members';
import { getDocuments as fetchDocuments } from './get-documents';
import type { Message, Stream } from 'genkit';

// == Schemas for Tooling ==
// This tells the AI what the data looks like.

const EventSchema = z.object({
    name: z.string().optional().describe("The name or title of the event."),
    description: z.string().optional().describe("A brief description of the event."),
    src: z.string().optional().describe("A URL to an image for the event."),
    alt: z.string().optional().describe("Alternative text for the event image."),
    hint: z.string().optional().describe("A hint for AI image generation."),
});
export type EventData = z.infer<typeof EventSchema>;


const ModuleDataSchema = z.object({
  id: z.string().describe('The unique identifier for the module.'),
  title: z.string().describe('The title of the module.'),
  description: z.string().describe('A description of what the module contains.'),
  category: z.string().describe('The category of the module (e.g., Ideologi, Praktis).'),
  fileUrl: z.string().optional().describe('The URL to the module file (if available).'),
});

const MemberDataSchema = z.object({
  id: z.string().describe("The member's unique ID."),
  fullName: z.string().describe("The full name of the member."),
  nim: z.string().describe("The member's student identification number."),
  faculty: z.string().describe("The member's faculty."),
  year: z.string().describe("The member's enrollment year."),
  email: z.string().email().describe("The member's email address."),
  whatsapp: z.string().describe("The member's WhatsApp number."),
});

const DocumentDataSchema = z.object({
    id: z.string().describe("The unique ID of the document."),
    title: z.string().describe("The title of the document."),
    description: z.string().describe("A brief description of the document's contents."),
    category: z.string().describe("The category of the document (e.g., Dasar Organisasi, LPJ).")
});


// == Tool Data Sources ==

const pastEvents: EventData[] = [
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

const upcomingEvents: EventData[] = [
    {
        name: "Pelatihan Kader Dasar (PKD) 2024",
        description: "Pendaftaran PKD angkatan ke-XXI telah dibuka. Segera daftarkan diri Anda sebelum kuota terpenuhi."
    }
];

async function getEvents(input: { type: 'past' | 'upcoming' }) {
  return input.type === 'past' ? pastEvents : upcomingEvents;
}

// == Tool Definitions ==
// These are the capabilities we give to the AI.

const getEventsTool = ai.defineTool(
  {
    name: 'getEvents',
    description: 'Get a list of upcoming and past events for PMII.',
    inputSchema: z.object({
      type: z.enum(['past', 'upcoming']).describe('The type of events to get.'),
    }),
    outputSchema: z.array(EventSchema),
  },
  getEvents
);

const getModulesTool = ai.defineTool(
  {
    name: 'getModules',
    description: 'Get a list of all available learning modules for PMII. Use this to answer questions about what modules exist or how many there are.',
    inputSchema: z.object({}),
    outputSchema: z.array(ModuleDataSchema),
  },
  async () => (await fetchModules()).modules
);

const getMembersTool = ai.defineTool(
    {
        name: 'getMembers',
        description: 'Get a list of all registered members of PMII. Use this to count the total number of members or answer questions about members.',
        inputSchema: z.object({}),
        outputSchema: z.array(MemberDataSchema),
    },
    async () => (await fetchMembers()).members
);

const getDocumentsTool = ai.defineTool(
    {
        name: 'getDocuments',
        description: 'Get a list of available documents and archives, such as AD/ART, Notulen, LPJ, and other official letters.',
        inputSchema: z.object({}),
        outputSchema: z.array(DocumentDataSchema),
    },
    async () => (await fetchDocuments()).documents
);


// == AI System Prompt & Model Configuration ==
// This is the main instruction and tool configuration for the AI.

const chatbotSystemPrompt = `You are an expert and friendly AI assistant named Sahabat/i AI, designed for the Pergerakan Mahasiswa Islam Indonesia (PMII).
You can answer general knowledge questions just like a regular assistant.
However, if a question is specifically about PMII, its events, its learning modules, its members, or its documents/archives, you MUST use the provided tools to get the information. For example, to answer "how many members are there?", you must use the getMembers tool. To answer "what modules are available?", you must use the getModules tool. To answer "show me the AD/ART document", you must use the getDocuments tool.
You should always be friendly and helpful.
You must answer in Bahasa Indonesia.
When presenting information from tools, format it clearly using lists or summaries, but do not just repeat the raw JSON output. Add context and present it in a conversational way.
Keep your answers concise and to the point.
If you don't know the answer to a specific PMII question and the tools don't provide it, say so honestly.
`;

const chatbotPrompt = ai.definePrompt({
    name: 'chatbotPrompt',
    model: 'googleai/gemini-2.0-flash',
    system: chatbotSystemPrompt,
    tools: [getEventsTool, getModulesTool, getMembersTool, getDocumentsTool],
});


// == Main Chat Function ==

export async function chat(history: Message[], prompt: string): Promise<Stream<string>> {
  const { stream } = ai.generateStream({
      prompt: {template: chatbotPrompt},
      history: history,
      input: prompt,
  });
  return stream;
}
