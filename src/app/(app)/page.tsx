import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb } from "lucide-react";

export default function Home() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Selamat Datang di PMII Digital Hub</CardTitle>
          <CardDescription>Pusat informasi, komunikasi, dan edukasi digital untuk Sahabat/i PMII.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="font-body">Gunakan platform ini untuk mengakses modul, melihat agenda kegiatan, dan berinteraksi dengan sesama kader.</p>
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Info & Pengumuman Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
              <Badge variant="default" className="mb-2 bg-primary">Kegiatan</Badge>
              <h3 className="font-semibold font-headline mb-1">Pelatihan Kader Dasar (PKD) 2024</h3>
              <p className="text-sm text-muted-foreground font-body">Pendaftaran PKD angkatan ke-XXI telah dibuka. Segera daftarkan diri Anda sebelum kuota terpenuhi. Info lebih lanjut di halaman kegiatan.</p>
              <p className="text-xs text-muted-foreground mt-2">Diposting: 2 hari yang lalu</p>
            </div>
            <div className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
              <Badge variant="secondary" className="mb-2 bg-accent text-accent-foreground">Pengumuman</Badge>
              <h3 className="font-semibold font-headline mb-1">Hasil Rapat Pleno Pengurus</h3>
              <p className="text-sm text-muted-foreground font-body">Notulensi hasil rapat pleno pengurus cabang tanggal 15 Juli 2024 kini tersedia di halaman arsip dokumen.</p>
              <p className="text-xs text-muted-foreground mt-2">Diposting: 5 hari yang lalu</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Kutipan Motivasi</CardTitle>
            <CardDescription>Semangat Pergerakan</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
            <Lightbulb className="w-12 h-12 text-accent mb-4" />
            <blockquote className="text-lg font-semibold italic font-body">
              "Dzikir, Fikir, dan Amal Shaleh."
            </blockquote>
            <p className="text-sm text-muted-foreground mt-2">- Motto PMII</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
