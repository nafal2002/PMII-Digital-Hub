
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
        description: "Pendaftaran PKD angkatan ke-XXI telah dibuka. Segera daftarkan diri Anda sebelum kuota terpenuhi."
    }
];

const pastEvents = [
  { name: 'PKD 2023' },
  { name: 'Seminar Kebangsaan' },
  { name: 'Aksi Sosial' },
  { name: 'Rapat Anggota' },
];

const modules = [
  {
    title: "Buku Menjadi Kader PMII",
    description: "Buku panduan lengkap untuk menjadi kader PMII yang berkualitas, mencakup materi dasar dan lanjutan.",
    category: "Panduan Kader",
  },
  {
    title: "Nilai Dasar Pergerakan (NDP)",
    description: "Penjelasan mendalam mengenai landasan ideologis dan filosofis PMII sebagai pedoman pergerakan.",
    category: "Ideologi",
  },
  {
    title: "Anggaran Dasar & Rumah Tangga (AD/ART)",
    description: "Dokumen konstitusional yang mengatur seluruh aspek organisasi, keanggotaan, dan hierarki PMII.",
    category: "Konstitusi",
  },
  {
    title: "Manajemen Aksi & Advokasi",
    description: "Panduan praktis untuk merancang, mengorganisir, dan melaksanakan aksi serta advokasi kebijakan.",
    category: "Praktis",
  },
  {
    title: "Hasil Muspimnas Tulungagung 2022",
    description: "Kumpulan hasil dan keputusan dari Musyawarah Pimpinan Nasional PMII yang diselenggarakan di Tulungagung pada tahun 2022.",
    category: "Musyawarah Nasional",
  },
  {
    title: "Materi Teknik Persidangan",
    description: "Panduan dan materi mengenai teknik-teknik persidangan yang efektif untuk Pelatihan Kader Dasar (PKD).",
    category: "Praktis",
  },
  {
    title: "Modul MAPABA Proletariat",
    description: "Modul untuk Masa Penerimaan Anggota Baru (MAPABA) dengan fokus pada analisis dan kesadaran kelas proletariat.",
    category: "MAPABA",
  },
  {
    title: "Materi Nahdlatunnisa",
    description: "Materi khusus keperempuanan dari KOPRI PMII Kabupaten Bekasi, membahas peran dan tantangan kader putri.",
    category: "KOPRI",
  },
  {
    title: "Dasar-Dasar PMII",
    description: "Presentasi yang mencakup tiga pilar utama PMII: aspek historis, landasan konstitusi, dan paradigma pergerakan.",
    category: "Dasar Organisasi",
  },
  {
    title: "Materi Ke-KOPRI-an",
    description: "Presentasi dasar mengenai Korps PMII Putri (KOPRI), mencakup sejarah, peran, dan pedoman organisasi.",
    category: "KOPRI",
  },
  {
    title: "Dasar-Dasar Aswaja",
    description: "Presentasi mengenai Ahlussunnah wal Jama'ah (Aswaja) sebagai landasan ideologis dan amaliah warga PMII.",
    category: "Ideologi",
  }
];

const documents = [
  { title: "AD/ART PMII", description: "Anggaran Dasar dan Anggaran Rumah Tangga terbaru.", category: "Dasar Organisasi" },
  { title: "Notulen Rapat Pleno I", description: "Hasil rapat pleno pengurus cabang, Januari 2024.", category: "Notulensi" },
  { title: "LPJ Kegiatan PKD 2023", description: "Laporan pertanggungjawaban kegiatan Pelatihan Kader Dasar 2023.", category: "LPJ" },
  { title: "SK Pengurus Cabang", description: "Surat Keputusan pengesahan pengurus cabang periode 2023-2024.", category: "Surat Keputusan" },
  { title: "Panduan Administrasi", description: "Pedoman resmi terkait surat-menyurat dan administrasi.", category: "Panduan" },
  { title: "Sejarah dan NDP PMII", description: "Dokumen sejarah dan Nilai Dasar Pergerakan.", category: "Dasar Organisasi" },
];

const members = [
    // This is sample data. In a real application, this would come from a database.
    { fullName: "Ahmad Zaini", nim: "12345", faculty: "Teknik", year: "2021" },
    { fullName: "Siti Fatimah", nim: "67890", faculty: "Hukum", year: "2022" },
];


// == AI System Prompt & Model Configuration ==

const chatbotSystemPrompt = `You are an expert and friendly AI assistant named Sahabat/i AI, designed for the Pergerakan Mahasiswa Islam Indonesia (PMII).
You can answer general knowledge questions just like a regular assistant.
However, if a question is specifically about PMII, its events, its learning modules, its members, or its documents/archives, you MUST use the provided information below to answer.

You must answer in Bahasa Indonesia.
When presenting information, format it clearly using lists or summaries. Add context and present it in a conversational way.
Keep your answers concise and to the point.
If you don't know the answer to a specific PMII question from the context below, say so honestly.

Here is the information you have about PMII:

## Acara Akan Datang
{{#each upcomingEvents}}
- **{{name}}**: {{description}}
{{/each}}

## Acara yang Lalu
{{#each pastEvents}}
- {{name}}
{{/each}}

## Modul Kaderisasi (Total: {{modules.length}} modul)
{{#each modules}}
- **{{title}}** (Kategori: {{category}}): {{description}}
{{/each}}

## Dokumen & Arsip (Total: {{documents.length}} dokumen)
{{#each documents}}
- **{{title}}** (Kategori: {{category}}): {{description}}
{{/each}}

## Data Anggota
- Total Anggota Terdaftar: {{members.length}} orang.
`;

const chatbotPrompt = ai.definePrompt({
    name: 'chatbotPrompt',
    model: 'googleai/gemini-2.0-flash',
    system: chatbotSystemPrompt,
    input: {
        schema: z.object({
            history: z.array(z.custom<Message>()),
            upcomingEvents: z.any(),
            pastEvents: z.any(),
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
            pastEvents,
            modules,
            documents,
            members,
        }
      },
      history: history.filter(m => m.content?.[0]?.text?.trim() !== ''), // Ensure we dont send empty parts
  });

  return stream;
}
