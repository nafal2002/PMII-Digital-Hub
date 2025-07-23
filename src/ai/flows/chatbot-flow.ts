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

// Define tools that the chatbot can use to answer questions
const getEventsTool = ai.defineTool(
  {
    name: 'getEvents',
    description: 'Get a list of upcoming and past events.',
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
    description: 'Get a list of available learning modules.',
    inputSchema: z.object({}),
    outputSchema: z.any(),
  },
  async () => getModules()
);

const chatbotSystemPrompt = `You are an expert and friendly assistant for the Pergerakan Mahasiswa Islam Indonesia (PMII).
Your name is Sahabat/i AI.
You can answer questions about PMII, its events, and learning modules.
You should be friendly and helpful.
When asked about events or modules, you should use the provided tools to get the information.
If you don't know the answer, you should say so.
Keep your answers concise and to the point.
You must answer in Bahasa Indonesia.
Analyze the user's question to determine what tool to use.
When using tool output, present the information in a clear and easy-to-read format. For example, by using lists.
Do not just repeat the tool output. Your response should be a complete sentence and add context.
`;

const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: z.object({
      history: z.array(z.custom<Message>()),
      prompt: z.string(),
    }),
    outputSchema: z.string(),
    stream: true,
  },
  async ({ history, prompt }) => {
    const llmResponse = await ai.generate({
      model: 'googleai/gemini-2.0-flash',
      history: history,
      prompt: prompt,
      tools: [getEventsTool, getModulesTool],
      system: chatbotSystemPrompt,
      stream: true
    });

    return llmResponse.stream();
  }
);


export async function chat(history: Message[], prompt: string): Promise<ReadableStream<string>> {
    const stream = await chatbotFlow({ history, prompt });

    return new ReadableStream({
        async start(controller) {
            for await (const chunk of stream) {
                controller.enqueue(chunk.output || '');
            }
            controller.close();
        }
    });
}
