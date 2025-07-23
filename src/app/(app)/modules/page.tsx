'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpenCheck, Download, Video, BookDashed } from "lucide-react";
import type { ModuleData } from '@/ai/flows/get-modules';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// --- DATA MODUL LOKAL ---
// Untuk menambah modul baru:
// 1. Letakkan file PDF di folder `public/modules/`.
// 2. Tambahkan entri baru di array `localModules` di bawah ini.
//    - `id` bisa diisi dengan nomor urut atau judul singkat.
//    - `fileUrl` harus diawali dengan `/modules/` diikuti nama file PDF Anda.
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
    fileUrl: "", // Biarkan kosong jika file belum ada, tombol unduh akan nonaktif
  },
];
// -------------------------

function ModuleList() {
  const modules = localModules;

  if (modules.length === 0) {
    return (
      <Alert>
        <BookDashed className="h-4 w-4" />
        <AlertTitle>Belum Ada Modul</AlertTitle>
        <AlertDescription>
          Saat ini belum ada modul kaderisasi yang ditambahkan. Silakan tambahkan secara manual di dalam kode.
        </AlertDescription>
      </Alert>
    );
  }

  return (
     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <Card key={module.id} className="flex flex-col">
             <CardHeader>
              <div>
                <CardTitle className="font-headline">{module.title}</CardTitle>
                <CardDescription>{module.category}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              <p className="text-sm mb-4 font-body flex-grow">{module.description}</p>
              <Button asChild variant="outline" className="w-full mt-auto" disabled={!module.fileUrl}>
                  <a href={module.fileUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                  </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
  );
};


export default function ModulesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Kaderisasi & Modul Digital</h1>
        <p className="text-muted-foreground">Pusat materi pembelajaran dan modul kaderisasi PMII.</p>
      </div>
      
      <Card>
          <CardHeader>
              <CardTitle className="font-headline flex items-center"><BookOpenCheck className="mr-3 text-primary"/>Modul Kaderisasi</CardTitle>
              <CardDescription>Kumpulan modul untuk mendukung proses kaderisasi yang dikelola secara lokal.</CardDescription>
          </CardHeader>
          <CardContent>
              <ModuleList />
          </CardContent>
      </Card>

      <section>
        <h2 className="text-2xl font-semibold font-headline mb-4 flex items-center"><Video className="mr-3 text-primary"/>Video Pembelajaran</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="flex flex-col sm:flex-row items-center p-4 gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                  <Video className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-semibold font-headline">Kajian Sejarah PMII</h3>
                  <p className="text-sm text-muted-foreground font-body">Video dokumenter perjalanan PMII dari masa ke masa.</p>
              </div>
              <Button variant="outline" className="mt-2 sm:mt-0">Tonton Video</Button>
          </Card>
           <Card className="flex flex-col sm:flex-row items-center p-4 gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                  <Video className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-semibold font-headline">Dasar-dasar Aswaja An-Nahdliyah</h3>
                  <p className="text-sm text-muted-foreground font-body">Penjelasan fundamental tentang ideologi Aswaja.</p>
              </div>
              <Button variant="outline" className="mt-2 sm:mt-0">Tonton Video</Button>
          </Card>
        </div>
      </section>
    </div>
  )
}
