import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpenCheck, Download, Video } from "lucide-react";

const modules = [
  { title: "Modul MAPABA", description: "Materi dasar untuk Masa Penerimaan Anggota Baru.", category: "Kaderisasi Formal" },
  { title: "Modul PKD", description: "Materi untuk Pelatihan Kader Dasar.", category: "Kaderisasi Formal" },
  { title: "Modul PKL", description: "Materi lanjutan untuk Pelatihan Kader Lanjut.", category: "Kaderisasi Formal" },
  { title: "Materi Aswaja", description: "Kumpulan materi Ahlussunnah Wal Jamaah.", category: "Materi Pendukung" },
  { title: "Modul Ke-SLO-an", description: "Modul khusus dari Lembaga SLO.", category: "Modul Khusus" },
];

const videos = [
    { title: "Kajian Sejarah PMII", description: "Video dokumenter perjalanan PMII dari masa ke masa." },
    { title: "Dasar-dasar Aswaja An-Nahdliyah", description: "Penjelasan fundamental tentang ideologi Aswaja." },
];

export default function ModulesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Kaderisasi & Modul Digital</h1>
        <p className="text-muted-foreground">Pusat materi pembelajaran dan modul kaderisasi PMII.</p>
      </div>

      <section>
        <h2 className="text-2xl font-semibold font-headline mb-4 flex items-center"><BookOpenCheck className="mr-3 text-primary"/>Modul Kaderisasi</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="font-headline">{module.title}</CardTitle>
                <CardDescription>{module.category}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col justify-between h-full">
                <p className="text-sm mb-4 font-body">{module.description}</p>
                <Button className="w-full mt-auto">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold font-headline mb-4 flex items-center"><Video className="mr-3 text-primary"/>Video Pembelajaran</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {videos.map((video, index) => (
             <Card key={index} className="flex flex-col sm:flex-row items-center p-4 gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                    <Video className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-semibold font-headline">{video.title}</h3>
                    <p className="text-sm text-muted-foreground font-body">{video.description}</p>
                </div>
                <Button variant="outline" className="mt-2 sm:mt-0">Tonton Video</Button>
             </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
