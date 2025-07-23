// src/ai/flows/get-documents.ts
'use server';

/**
 * @fileOverview A flow to get a list of documents.
 *
 * - getDocuments - A function that handles fetching documents.
 * - DocumentData - The type for a single document's data.
 * - GetDocumentsOutput - The return type for the getDocuments function.
 */

import { z } from 'genkit';
import { ai } from '@/ai/genkit';

const DocumentDataSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.string(),
});
export type DocumentData = z.infer<typeof DocumentDataSchema>;

const GetDocumentsOutputSchema = z.object({
  documents: z.array(DocumentDataSchema),
});
export type GetDocumentsOutput = z.infer<typeof GetDocumentsOutputSchema>;

// Static data for documents as the app doesn't have a database for them yet.
const documents: DocumentData[] = [
  { title: "AD/ART PMII", description: "Anggaran Dasar dan Anggaran Rumah Tangga terbaru.", category: "Dasar Organisasi" },
  { title: "Notulen Rapat Pleno I", description: "Hasil rapat pleno pengurus cabang, Januari 2024.", category: "Notulensi" },
  { title: "LPJ Kegiatan PKD 2023", description: "Laporan pertanggungjawaban kegiatan Pelatihan Kader Dasar 2023.", category: "LPJ" },
  { title: "SK Pengurus Cabang", description: "Surat Keputusan pengesahan pengurus cabang periode 2023-2024.", category: "Surat Keputusan" },
  { title: "Panduan Administrasi", description: "Pedoman resmi terkait surat-menyurat dan administrasi.", category: "Panduan" },
  { title: "Sejarah dan NDP PMII", description: "Dokumen sejarah dan Nilai Dasar Pergerakan.", category: "Dasar Organisasi" },
];

export async function getDocuments(): Promise<GetDocumentsOutput> {
  return getDocumentsFlow();
}

const getDocumentsFlow = ai.defineFlow(
  {
    name: 'getDocumentsFlow',
    outputSchema: GetDocumentsOutputSchema,
  },
  async () => {
    return { documents };
  }
);
