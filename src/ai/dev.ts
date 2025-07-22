import { config } from 'dotenv';
config();

import '@/ai/flows/document-summarization.ts';
import '@/ai/flows/add-member.ts';
import '@/ai/flows/get-members.ts';
import '@/ai/flows/get-modules.ts';
import '@/ai/flows/add-module.ts';
import '@/ai/flows/update-module.ts';
import '@/ai/flows/delete-module.ts';
import '@/ai/flows/get-member-by-id.ts';
import '@/ai/flows/send-telegram-notification.ts';
