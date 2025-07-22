import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";

const documents = [
  { title: "AD/ART PMII", description: "Anggaran Dasar dan Anggaran Rumah Tangga terbaru.", category: "Dasar Organisasi" },
  { title: "Notulen Rapat Pleno I", description: "Hasil rapat pleno pengurus cabang, Januari 2024.", category: "Notulensi" },
  { title: "LPJ Kegiatan PKD 2023", description: "Laporan pertanggungjawaban kegiatan Pelatihan Kader Dasar 2023.", category: "LPJ" },
  { title: "SK Pengurus Cabang", description: "Surat Keputusan pengesahan pengurus cabang periode 2023-2024.", category: "Surat Keputusan" },
  { title: "Panduan Administrasi", description: "Pedoman resmi terkait surat-menyurat dan administrasi.", category: "Panduan" },
  { title: "Sejarah dan NDP PMII", description: "Dokumen sejarah dan Nilai Dasar Pergerakan.", category: "Dasar Organisasi" },
];

export default function ArchivePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Dokumentasi & Arsip</h1>
        <p className="text-muted-foreground">Pusat unduhan dokumen, notulensi, dan surat-surat penting PMII.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {documents.map((doc, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader className="flex-row items-center gap-4 pb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="font-headline text-lg leading-tight">{doc.title}</CardTitle>
                <CardDescription>{doc.category}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between">
              <p className="text-sm mb-4 font-body text-muted-foreground">{doc.description}</p>
              <Button variant="outline" className="w-full mt-auto">
                <Download className="mr-2 h-4 w-4" />
                Unduh Dokumen
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
