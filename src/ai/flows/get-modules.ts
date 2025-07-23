'use server';

/**
 * @fileOverview A flow to retrieve all modules.
 *
 * - getModules - A function that handles fetching all modules.
 * - ModuleData - The type for a single module's data.
 * - GetModulesOutput - The return type for the getModules function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ModuleDataSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  fileUrl: z.string().optional(),
  status: z.string().optional(),
});
export type ModuleData = z.infer<typeof ModuleDataSchema>;

const GetModulesOutputSchema = z.object({
  modules: z.array(ModuleDataSchema),
});
export type GetModulesOutput = z.infer<typeof GetModulesOutputSchema>;


const localModules: ModuleData[] = [
  {
    id: "4",
    title: "Buku Menjadi Kader PMII",
    description: "Buku panduan lengkap untuk menjadi kader PMII yang berkualitas, mencakup materi dasar dan lanjutan.",
    category: "Panduan Kader",
    fileUrl: "/modules/Buku Menjadi Kader PMII.pdf",
  },
  {
    id: "1",
    title: "Nilai Dasar Pergerakan (NDP)",
    description: "Penjelasan mendalam mengenai landasan ideologis dan filosofis PMII sebagai pedoman pergerakan.",
    category: "Ideologi",
    fileUrl: "/modules/contoh-modul-1.pdf",
  },
  {
    id: "2",
    title: "Anggaran Dasar & Rumah Tangga (AD/ART)",
    description: "Dokumen konstitusional yang mengatur seluruh aspek organisasi, keanggotaan, dan hierarki PMII.",
    category: "Konstitusi",
    fileUrl: "/modules/contoh-modul-2.pdf",
  },
  {
    id: "3",
    title: "Manajemen Aksi & Advokasi",
    description: "Panduan praktis untuk merancang, mengorganisir, dan melaksanakan aksi serta advokasi kebijakan.",
    category: "Praktis",
    fileUrl: "", 
  },
  {
    id: "5",
    title: "Hasil Muspimnas Tulungagung 2022",
    description: "Kumpulan hasil dan keputusan dari Musyawarah Pimpinan Nasional PMII yang diselenggarakan di Tulungagung pada tahun 2022.",
    category: "Musyawarah Nasional",
    fileUrl: "/modules/HASIL MUSPIMNAS PMII TULUNGAGUNG 2022-1.pdf"
  },
  {
    id: "6",
    title: "Materi Teknik Persidangan",
    description: "Panduan dan materi mengenai teknik-teknik persidangan yang efektif untuk Pelatihan Kader Dasar (PKD).",
    category: "Praktis",
    fileUrl: "/modules/MATERI TEKNIK-PERSIDANGAN PDK.pdf"
  },
  {
    id: "7",
    title: "Modul MAPABA Proletariat",
    description: "Modul untuk Masa Penerimaan Anggota Baru (MAPABA) dengan fokus pada analisis dan kesadaran kelas proletariat.",
    category: "MAPABA",
    fileUrl: "/modules/MODUL MAPABA PROLETARIAT.pdf"
  },
  {
    id: "8",
    title: "Materi Nahdlatunnisa",
    description: "Materi khusus keperempuanan dari KOPRI PMII Kabupaten Bekasi, membahas peran dan tantangan kader putri.",
    category: "KOPRI",
    fileUrl: "/modules/Nahdlatunnisa - Kab Bekasi-1.pdf"
  },
  {
    id: "9",
    title: "Dasar-Dasar PMII",
    description: "Presentasi yang mencakup tiga pilar utama PMII: aspek historis, landasan konstitusi, dan paradigma pergerakan.",
    category: "Dasar Organisasi",
    fileUrl: "/modules/PMII (HISTORIS, KONSTITUSI, PARADIGMA).ppt"
  },
  {
    id: "10",
    title: "Materi Ke-KOPRI-an",
    description: "Presentasi dasar mengenai Korps PMII Putri (KOPRI), mencakup sejarah, peran, dan pedoman organisasi.",
    category: "KOPRI",
    fileUrl: "/modules/Ke-KOPRI-an.ppt"
  },
  {
    id: "11",
    title: "Dasar-Dasar Aswaja",
    description: "Presentasi mengenai Ahlussunnah wal Jama'ah (Aswaja) sebagai landasan ideologis dan amaliah warga PMII.",
    category: "Ideologi",
    fileUrl: "/modules/ASWAJA.ppt"
  }
];

export async function getModules(): Promise<GetModulesOutput> {
  return getModulesFlow();
}

const getModulesFlow = ai.defineFlow(
  {
    name: 'getModulesFlow',
    outputSchema: GetModulesOutputSchema,
  },
  async () => {
    return {
      modules: localModules,
    };
  }
);
