'use server';

/**
 * @fileOverview A chatbot flow that can answer questions about PMII.
 *
 * This flow uses tools to access information about events and modules.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getEvents } from './get-events';
import { getModules } from './get-modules';
import type { Message } from 'genkit';

const getEventsTool = ai.defineTool(
  {
    name: 'getEvents',
    description: 'Get a list of upcoming and past events for PMII.',
    inputSchema: z.object({
      type: z.enum(['past', 'upcoming']).describe('The type of events to get.'),
    }),
    outputSchema: z.any(),
  },
  async (input) => getEvents(input)
);

const getModulesTool = ai.defineTool(
  {
    name: 'getModules',
    description: 'Get a list of available learning modules for PMII.',
    inputSchema: z.object({}),
    outputSchema: z.any(),
  },
  async () => getModules()
);

const chatbotSystemPrompt = `You are an expert and friendly AI assistant named Sahabat/i AI, designed for the Pergerakan Mahasiswa Islam Indonesia (PMII).
You can answer general knowledge questions just like a regular assistant.
However, if a question is specifically about PMII, its events, or its learning modules, you MUST use the provided tools to get the information.
You should always be friendly and helpful.
You must answer in Bahasa Indonesia.
When presenting information from tools, format it clearly using lists, but do not just repeat the raw output. Add context and present it in a conversational way.
Keep your answers concise and to the point.
If you don't know the answer to a specific PMII question and the tools don't provide it, say so honestly.
`;

export async function chat(history: Message[], prompt: string) {
    const { stream } = ai.generateStream({
      model: 'googleai/gemini-2.0-flash',
      history: history,
      prompt: prompt,
      tools: [getEventsTool, getModulesTool],
      system: chatbotSystemPrompt,
    });
    return stream;
}
