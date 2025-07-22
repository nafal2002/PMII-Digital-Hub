'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Logo } from "@/components/icons"
import { useToast } from "@/hooks/use-toast"
import { addMember } from "@/ai/flows/add-member"
import { useState, useRef } from "react"
import { Loader2, Download, UserPlus } from "lucide-react"
import { MemberList } from "./member-list"
import { MemberData } from "@/ai/flows/get-members"
import html2canvas from "html2canvas"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  fullName: z.string().min(2, "Nama lengkap harus diisi."),
  nim: z.string().min(5, "NIM tidak valid."),
  faculty: z.string().min(2, "Fakultas harus diisi."),
  year: z.string().length(4, "Tahun angkatan tidak valid."),
  email: z.string().email("Email tidak valid."),
  whatsapp: z.string().min(10, "Nomor WhatsApp tidak valid."),
  photo: z.instanceof(File).optional()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, `Ukuran foto maksimal adalah 2MB.`)
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Hanya format .jpg, .jpeg, .png dan .webp yang didukung."
    ),
})

function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export default function MembershipPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [activeTab, setActiveTab] = useState("registration");
    const [selectedMemberForCard, setSelectedMemberForCard] = useState<MemberData | null>(null);
    const [key, setKey] = useState(Date.now()); // Key to re-render MemberList

    const cardRef = useRef<HTMLDivElement>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            nim: "",
            faculty: "",
            year: "",
            email: "",
            whatsapp: "",
            photo: undefined,
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            let photoUrl: string | undefined = undefined;
            if (values.photo) {
                photoUrl = await fileToDataUrl(values.photo);
            }

            const result = await addMember({
                fullName: values.fullName,
                nim: values.nim,
                faculty: values.faculty,
                year: values.year,
                email: values.email,
                whatsapp: values.whatsapp,
                photoUrl: photoUrl,
            });

            if (result.success) {
                toast({
                    title: "Pendaftaran Berhasil!",
                    description: "Data Anda telah kami simpan. Selamat bergabung!",
                });
                form.reset();
                setKey(Date.now()); // Trigger re-fetch in MemberList
            } else {
                 toast({
                    variant: "destructive",
                    title: "Pendaftaran Gagal!",
                    description: "Terjadi kesalahan saat menyimpan data. Silakan coba lagi.",
                });
            }
        } catch (error) {
             toast({
                variant: "destructive",
                title: "Pendaftaran Gagal!",
                description: "Terjadi kesalahan pada sistem. Silakan coba lagi nanti.",
            });
        } finally {
            setIsLoading(false);
        }
    }

    const handleSelectMemberForCard = (member: MemberData) => {
        setSelectedMemberForCard(member);
        setActiveTab("card");
    };

    const handleDownload = async () => {
      if (!cardRef.current) return;
      setIsDownloading(true);
      try {
        const canvas = await html2canvas(cardRef.current, { 
            useCORS: true, 
            allowTaint: true,
            backgroundColor: null,
            scale: 2 
        });
        const link = document.createElement('a');
        const fileName = selectedMemberForCard 
          ? `kartu-anggota-${selectedMemberForCard.fullName.toLowerCase().replace(/ /g, '-')}.png`
          : 'kartu-anggota-pmii.png';
        link.download = fileName;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (error) {
        console.error("Error downloading card:", error);
        toast({
            variant: "destructive",
            title: "Unduh Gagal!",
            description: "Tidak dapat mengunduh kartu. Silakan coba lagi.",
        });
      } finally {
        setIsDownloading(false);
      }
    };
    
    const cardData = selectedMemberForCard || {
        fullName: 'SAHABAT NAMA',
        nim: '1234567890',
        photoUrl: '',
    };
    
    const fallbackInitial = cardData.fullName.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
    
    const avatarImageSrc = cardData.photoUrl 
        ? cardData.photoUrl 
        : `https://api.dicebear.com/8.x/initials/svg?seed=${cardData.fullName}`;


  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold font-headline">Data Keanggotaan</h1>
            <p className="text-muted-foreground">Formulir pendaftaran, daftar anggota, dan kartu anggota digital.</p>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="registration">Pendaftaran</TabsTrigger>
                <TabsTrigger value="list">Daftar Anggota</TabsTrigger>
                <TabsTrigger value="card">Kartu Digital</TabsTrigger>
            </TabsList>
            <TabsContent value="registration">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Formulir Pendaftaran</CardTitle>
                        <CardDescription>Isi data di bawah ini untuk menjadi anggota PMII.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField control={form.control} name="fullName" render={({ field }) => (
                                    <FormItem><FormLabel>Nama Lengkap</FormLabel><FormControl><Input placeholder="Sahabat/i..." {...field} disabled={isLoading} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <FormField control={form.control} name="nim" render={({ field }) => (
                                        <FormItem><FormLabel>NIM</FormLabel><FormControl><Input placeholder="Nomor Induk Mahasiswa" {...field} disabled={isLoading} /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                    <FormField control={form.control} name="faculty" render={({ field }) => (
                                        <FormItem><FormLabel>Fakultas</FormLabel><FormControl><Input placeholder="Fakultas..." {...field} disabled={isLoading} /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                </div>
                                 <div className="grid md:grid-cols-2 gap-6">
                                    <FormField control={form.control} name="email" render={({ field }) => (
                                        <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="email@contoh.com" {...field} disabled={isLoading} /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                    <FormField control={form.control} name="whatsapp" render={({ field }) => (
                                        <FormItem><FormLabel>No. WhatsApp</FormLabel><FormControl><Input placeholder="08xxxxxxxx" {...field} disabled={isLoading} /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <FormField control={form.control} name="year" render={({ field }) => (
                                        <FormItem><FormLabel>Tahun Angkatan</FormLabel><FormControl><Input placeholder="Contoh: 2022" {...field} disabled={isLoading} /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                    <FormField
                                        control={form.control}
                                        name="photo"
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Foto Diri (Opsional)</FormLabel>
                                            <FormControl>
                                            <Input 
                                                type="file" 
                                                accept="image/png, image/jpeg, image/jpg, image/webp"
                                                onChange={(e) => field.onChange(e.target.files?.[0])} 
                                                disabled={isLoading} 
                                            />
                                            </FormControl>
                                            <FormDescription>
                                                Ukuran maks 2MB. Format: JPG, PNG, atau WebP.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                </div>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Daftar
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="list">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Daftar Anggota Terdaftar</CardTitle>
                        <CardDescription>Berikut adalah daftar anggota yang telah bergabung. Pilih anggota untuk membuat kartu digital.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <MemberList key={key} onSelectMember={handleSelectMemberForCard} />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="card">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Kartu Anggota Digital</CardTitle>
                         {selectedMemberForCard ? (
                            <CardDescription>
                                Pratinjau kartu untuk <span className="font-semibold">{selectedMemberForCard.fullName}</span>. Klik tombol di bawah untuk mengunduh.
                            </CardDescription>
                        ) : (
                             <CardDescription>
                                Pilih seorang anggota dari tab "Daftar Anggota" untuk membuat kartu mereka.
                            </CardDescription>
                        )}
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center gap-6">
                       {selectedMemberForCard ? (
                        <>
                            <div ref={cardRef} className="w-full max-w-md bg-gradient-to-br from-primary via-green-500 to-green-600 text-primary-foreground rounded-xl p-6 shadow-lg space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-headline text-xl">KARTU ANGGOTA</h3>
                                        <p className="font-body text-sm opacity-90">Pergerakan Mahasiswa Islam Indonesia</p>
                                    </div>
                                    <Logo className="w-12 h-12" />
                                </div>
                                <div className="flex items-center gap-4 pt-4">
                                    <Avatar className="w-20 h-20 border-4 border-white">
                                        <AvatarImage src={avatarImageSrc} data-ai-hint="person portrait" />
                                        <AvatarFallback>{fallbackInitial}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-body text-xs">Nama</p>
                                        <h4 className="font-headline text-lg">{cardData.fullName.toUpperCase()}</h4>
                                        <p className="font-body text-xs mt-1">NIM</p>
                                        <p className="font-body font-semibold">{cardData.nim}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-body text-xs">Ketua Cabang</p>
                                    <p className="font-headline mt-2">.....................</p>
                                </div>
                            </div>
                            <Button onClick={handleDownload} disabled={isDownloading}>
                                {isDownloading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Download className="mr-2 h-4 w-4" />
                                )}
                                Unduh Kartu
                            </Button>
                        </>
                       ) : (
                        <Alert>
                            <UserPlus className="h-4 w-4" />
                            <AlertTitle>Pilih Anggota</AlertTitle>
                            <AlertDescription>
                                Silakan kembali ke tab "Daftar Anggota" dan pilih salah satu anggota untuk dibuatkan kartu.
                            </AlertDescription>
                        </Alert>
                       )}
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  )
}
