'use client';

import { useEffect, useState, useRef } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpenCheck, Download, Video, Frown, BookDashed, Loader2, BookUp } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getModules, ModuleData } from '@/ai/flows/get-modules';
import { addModule } from '@/ai/flows/add-module';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  title: z.string().min(3, "Judul modul harus diisi."),
  category: z.string().min(3, "Kategori harus diisi."),
  description: z.string().min(10, "Deskripsi harus lebih dari 10 karakter."),
  // file: z.instanceof(File).optional(), // TODO: Add file upload handling
})

function ModuleList({ key, onModuleAdded }: { key: number, onModuleAdded: () => void }) {
  const [modules, setModules] = useState<ModuleData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
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

    fetchModules();
  }, [key, onModuleAdded]); // Re-fetch when key changes

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
          Saat ini belum ada modul kaderisasi yang ditambahkan. Silakan tambahkan melalui tab "Tambah Modul".
        </AlertDescription>
      </Alert>
    );
  }

  return (
     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <Card key={module.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline">{module.title}</CardTitle>
              <CardDescription>{module.category}</CardDescription>
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
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("list");
  const [listKey, setListKey] = useState(Date.now()); // To trigger re-fetch

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      description: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
        // TODO: Handle file upload and get URL
        const result = await addModule({
            title: values.title,
            category: values.category,
            description: values.description,
            // fileUrl: "URL_from_upload" 
        });

        if (result.success) {
            toast({
                title: "Modul Ditambahkan!",
                description: "Modul baru telah berhasil disimpan.",
            });
            form.reset();
            setListKey(Date.now()); // Trigger re-fetch in ModuleList
            setActiveTab("list");
        } else {
             toast({
                variant: "destructive",
                title: "Gagal Menambahkan!",
                description: "Terjadi kesalahan saat menyimpan modul.",
            });
        }
    } catch (error) {
         toast({
            variant: "destructive",
            title: "Gagal Menambahkan!",
            description: "Terjadi kesalahan sistem. Silakan coba lagi.",
        });
    } finally {
        setIsLoading(false);
    }
  }


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Kaderisasi & Modul Digital</h1>
        <p className="text-muted-foreground">Pusat materi pembelajaran dan modul kaderisasi PMII.</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Daftar Modul</TabsTrigger>
            <TabsTrigger value="add">Tambah Modul Baru</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center"><BookOpenCheck className="mr-3 text-primary"/>Modul Kaderisasi</CardTitle>
                    <CardDescription>Kumpulan modul untuk mendukung proses kaderisasi.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ModuleList key={listKey} onModuleAdded={() => setListKey(Date.now())} />
                </CardContent>
            </Card>
        </TabsContent>
         <TabsContent value="add">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Tambah Modul Baru</CardTitle>
                    <CardDescription>Isi detail modul untuk menambahkannya ke dalam daftar.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField control={form.control} name="title" render={({ field }) => (
                                <FormItem><FormLabel>Judul Modul</FormLabel><FormControl><Input placeholder="Contoh: NDP dan Aswaja" {...field} disabled={isLoading} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="category" render={({ field }) => (
                                <FormItem><FormLabel>Kategori Modul</FormLabel><FormControl><Input placeholder="Contoh: Ideologi" {...field} disabled={isLoading} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="description" render={({ field }) => (
                                <FormItem><FormLabel>Deskripsi Singkat</FormLabel><FormControl><Textarea placeholder="Jelaskan secara singkat isi dari modul ini..." {...field} disabled={isLoading} /></FormControl><FormMessage /></FormItem>
                            )}/>
                             {/* <FormField control={form.control} name="file" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>File Modul (PDF)</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="file" 
                                            accept="application/pdf"
                                            onChange={(e) => field.onChange(e.target.files?.[0])} 
                                            disabled={isLoading} 
                                        />
                                    </FormControl>
                                    <FormDescription>File akan diunggah ke penyimpanan.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                             )}/> */}
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BookUp className="mr-2 h-4 w-4" />}
                                Simpan Modul
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
         </TabsContent>
      </Tabs>


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
