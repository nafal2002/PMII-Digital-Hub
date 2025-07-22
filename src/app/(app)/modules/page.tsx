'use client';

import { useEffect, useState, useRef, type ComponentProps } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpenCheck, Download, Video, Frown, BookDashed, Loader2, BookUp, MoreVertical, Edit, Trash2 } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getModules, ModuleData } from '@/ai/flows/get-modules';
import { addModule } from '@/ai/flows/add-module';
import { updateModule, UpdateModuleInput } from '@/ai/flows/update-module';
import { deleteModule } from '@/ai/flows/delete-module';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"


const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf"];

const fileSchema = z.instanceof(File).optional()
  .refine((file) => !file || file.size <= MAX_FILE_SIZE, `Ukuran file maksimal adalah 5MB.`)
  .refine(
    (file) => !file || ACCEPTED_FILE_TYPES.includes(file.type),
    "Hanya format .pdf yang didukung."
  );

const addFormSchema = z.object({
  title: z.string().min(3, "Judul modul harus diisi."),
  category: z.string().min(3, "Kategori harus diisi."),
  description: z.string().min(10, "Deskripsi harus lebih dari 10 karakter."),
  file: fileSchema,
})

const editFormSchema = z.object({
  title: z.string().min(3, "Judul modul harus diisi."),
  category: z.string().min(3, "Kategori harus diisi."),
  description: z.string().min(10, "Deskripsi harus lebih dari 10 karakter."),
  file: fileSchema,
});

type EditFormValues = z.infer<typeof editFormSchema>;

function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function EditModuleDialog({ module, onEdited, ...props }: { module: ModuleData, onEdited: () => void } & ComponentProps<typeof Dialog>) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<EditFormValues>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      title: module.title,
      category: module.category,
      description: module.description,
    },
  });

  async function onSubmit(values: EditFormValues) {
    setIsLoading(true);
    try {
      let fileDataUri: string | undefined = undefined;
      if (values.file) {
        fileDataUri = await fileToDataUrl(values.file);
      }

      const result = await updateModule({
        id: module.id,
        title: values.title,
        category: values.category,
        description: values.description,
        fileDataUri: fileDataUri,
        currentFileUrl: module.fileUrl,
      });

      if (result.success) {
        toast({ title: "Modul Diperbarui", description: "Perubahan modul telah disimpan." });
        onEdited();
      } else {
        toast({ variant: "destructive", title: "Gagal Memperbarui", description: "Tidak dapat menyimpan perubahan." });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Gagal Memperbarui", description: "Terjadi kesalahan sistem." });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ubah Modul</DialogTitle>
          <DialogDescription>Lakukan perubahan pada detail modul di bawah ini.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Judul Modul</FormLabel><FormControl><Input {...field} disabled={isLoading} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem><FormLabel>Kategori Modul</FormLabel><FormControl><Input {...field} disabled={isLoading} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Deskripsi Singkat</FormLabel><FormControl><Textarea {...field} disabled={isLoading} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
              <FormItem>
                  <FormLabel>Ganti File Modul (PDF)</FormLabel>
                  <FormControl>
                      <Input 
                          type="file" 
                          accept="application/pdf"
                          onChange={(e) => field.onChange(e.target.files?.[0])} 
                          disabled={isLoading} 
                      />
                  </FormControl>
                  <FormDescription>Biarkan kosong jika tidak ingin mengganti file yang sudah ada.</FormDescription>
                  <FormMessage />
              </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
               <Button type="button" variant="ghost" onClick={() => props.onOpenChange?.(false)} disabled={isLoading}>Batal</Button>
               <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan Perubahan
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


function ModuleList({ onModuleChange }: { onModuleChange: () => void }) {
  const { toast } = useToast();
  const [modules, setModules] = useState<ModuleData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<ModuleData | null>(null);


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

  const handleEditOpen = (module: ModuleData) => {
    setSelectedModule(module);
    setIsEditDialogOpen(true);
  }

  const handleDeleteOpen = (module: ModuleData) => {
    setSelectedModule(module);
    setIsDeleteDialogOpen(true);
  }

  const handleDeleteConfirm = async () => {
    if (!selectedModule) return;
    try {
      // If there's a file, delete it from storage first
      if (selectedModule.fileUrl) {
          await deleteFileFromUrl(selectedModule.fileUrl);
      }
      const result = await deleteModule({ id: selectedModule.id });
      if (result.success) {
        toast({ title: "Modul Dihapus", description: "Modul telah berhasil dihapus." });
        onModuleChange(); // This will trigger a re-fetch in the parent component
        fetchModules(); // also refetch here
      } else {
        toast({ variant: "destructive", title: "Gagal Menghapus", description: "Tidak dapat menghapus modul." });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Gagal Menghapus", description: "Terjadi kesalahan sistem." });
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
          Saat ini belum ada modul kaderisasi yang ditambahkan. Silakan tambahkan melalui tab "Tambah Modul".
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <Card key={module.id} className="flex flex-col">
             <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="font-headline">{module.title}</CardTitle>
                <CardDescription>{module.category}</CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEditOpen(module)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Ubah
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDeleteOpen(module)} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Hapus
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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

       {/* Edit Dialog */}
      {selectedModule && (
        <EditModuleDialog
          module={selectedModule}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onEdited={() => {
            setIsEditDialogOpen(false);
            onModuleChange();
            fetchModules();
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Anda Yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus modul dan file terkait secara permanen dari server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};


export default function ModulesPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("list");
  const [listKey, setListKey] = useState(Date.now());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof addFormSchema>>({
    resolver: zodResolver(addFormSchema),
    defaultValues: {
      title: "",
      category: "",
      description: "",
      file: undefined,
    },
  })

  async function onSubmit(values: z.infer<typeof addFormSchema>) {
    setIsLoading(true);
    try {
        let fileDataUri: string | undefined = undefined;
        if (values.file) {
            fileDataUri = await fileToDataUrl(values.file);
        }

        const result = await addModule({
            title: values.title,
            category: values.category,
            description: values.description,
            fileDataUri: fileDataUri,
        });

        if (result.success) {
            toast({
                title: "Modul Ditambahkan!",
                description: "Modul baru telah berhasil disimpan.",
            });
            form.reset();
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
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
                    <ModuleList key={listKey} onModuleChange={() => setListKey(Date.now())} />
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
                             <FormField control={form.control} name="file" render={({ field: { onChange, value, ...rest } }) => (
                                <FormItem>
                                    <FormLabel>File Modul (PDF)</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...rest}
                                            type="file" 
                                            accept="application/pdf"
                                            ref={fileInputRef}
                                            onChange={(e) => onChange(e.target.files?.[0])} 
                                            disabled={isLoading} 
                                        />
                                    </FormControl>
                                    <FormDescription>File PDF, ukuran maksimal 5MB.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                             )}/>
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
