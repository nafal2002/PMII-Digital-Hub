'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpenCheck, Download, Video, Frown, BookDashed } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getModules, ModuleData } from '@/ai/flows/get-modules';

function ModuleList() {
  const [modules, setModules] = useState<ModuleData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      setIsLoading(true);
      setError('');
      const result = await getModules();
      setModules(result.modules);
    } catch (err) {
      setError('Gagal memuat data modul. Silakan coba lagi nanti.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <Frown className="h-4 w-4" />
        <AlertTitle>Terjadi Kesalahan</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (modules.length === 0) {
    return (
      <Alert>
        <BookDashed className="h-4 w-4" />
        <AlertTitle>Belum Ada Modul</AlertTitle>
        <AlertDescription>
          Saat ini belum ada modul kaderisasi yang ditambahkan. Silakan tambahkan secara manual melalui database.
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
              <CardDescription>Kumpulan modul untuk mendukung proses kaderisasi yang ditambahkan secara manual.</CardDescription>
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
