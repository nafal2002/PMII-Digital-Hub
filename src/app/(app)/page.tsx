
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, ArrowRight, Users, BookOpen, Calendar, FileArchive, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { MemberData } from "@/ai/flows/get-members";

const quickStats = [
  { title: "Materi", value: "11 Modul", icon: BookOpen, href: "/modules" },
  { title: "Kegiatan", value: "1 Agenda", icon: Calendar, href: "/events" },
  { title: "Arsip", value: "6 Dokumen", icon: FileArchive, href: "/archive" },
];

const announcements = [
    {
        badge: "Kegiatan",
        title: "Pelatihan Kader Dasar (PKD) 2024",
        description: "Pendaftaran PKD angkatan ke-XXI telah dibuka. Segera daftarkan diri Anda sebelum kuota terpenuhi.",
        href: "/events",
        cta: "Lihat Detail Kegiatan"
    },
    {
        badge: "Pengumuman",
        title: "Hasil Rapat Pleno Pengurus",
        description: "Notulensi hasil rapat pleno pengurus cabang tanggal 15 Juli 2024 kini tersedia di halaman arsip dokumen.",
        href: "/archive",
        cta: "Buka Arsip"
    }
];

export default function Home() {
    const [memberCount, setMemberCount] = useState<number | null>(null);

    useEffect(() => {
        const fetchMemberCount = async () => {
            try {
                const response = await fetch('/api/members');
                 if (!response.ok) {
                    throw new Error('Gagal mengambil data anggota');
                }
                const data : { members: MemberData[] } = await response.json();
                setMemberCount(data.members.length);
            } catch (error) {
                console.error("Failed to fetch member count:", error);
                setMemberCount(0); // Default to 0 on error
            }
        };
        fetchMemberCount();
    }, []);

  return (
    <div className="grid gap-6">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center">
                    <Zap className="h-6 w-6 mr-3 text-yellow-500" />
                    Selamat Datang di PMII Digital Hub
                </CardTitle>
                <CardDescription>
                    Pusat informasi, komunikasi, dan manajemen digital untuk seluruh kader PMII. Jelajahi berbagai fitur yang tersedia untuk mendukung pergerakan.
                </CardDescription>
            </CardHeader>
        </Card>

       <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="lg:col-span-1">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Anggota</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {memberCount !== null ? (
                        <div className="text-2xl font-bold">{memberCount}</div>
                    ) : (
                        <div className="h-8 w-1/3 bg-muted rounded-md animate-pulse"></div>
                    )}
                    <p className="text-xs text-muted-foreground">Anggota Terdaftar</p>
                </CardContent>
            </Card>
            {quickStats.map((stat, index) => (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground">Tersedia di sistem</p>
                    </CardContent>
                    <CardFooter className="pt-0 pb-4">
                        <Button size="sm" variant="outline" className="w-full" asChild>
                            <Link href={stat.href}>
                                Buka Halaman
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Info & Pengumuman Terbaru</CardTitle>
                    <CardDescription>Informasi penting seputar kegiatan dan organisasi.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {announcements.map((item, index) => (
                        <div key={index} className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <Badge variant={item.badge === 'Kegiatan' ? 'default' : 'secondary'} className={`mb-2 ${item.badge === 'Kegiatan' ? 'bg-primary' : 'bg-accent text-accent-foreground'}`}>{item.badge}</Badge>
                                <h3 className="font-semibold font-headline mb-1">{item.title}</h3>
                                <p className="text-sm text-muted-foreground font-body">{item.description}</p>
                            </div>
                             <Button variant="ghost" size="sm" asChild className="shrink-0 self-start sm:self-center">
                                <Link href={item.href}>
                                    {item.cta} <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline">Kutipan Motivasi</CardTitle>
            <CardDescription>Trilogi PMII</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center justify-center flex-grow">
            <Lightbulb className="w-12 h-12 text-yellow-500 mb-4" />
            <blockquote className="text-lg font-semibold italic font-body">
              "Dzikir, Fikir, dan Amal Shaleh."
            </blockquote>
          </CardContent>
           <CardFooter>
                <p className="text-xs text-muted-foreground mx-auto">- Motto PMII</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
