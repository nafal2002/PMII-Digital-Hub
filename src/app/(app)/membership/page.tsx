'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
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
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { MemberList } from "./member-list"

const formSchema = z.object({
  fullName: z.string().min(2, "Nama lengkap harus diisi."),
  nim: z.string().min(5, "NIM tidak valid."),
  faculty: z.string().min(2, "Fakultas harus diisi."),
  year: z.string().length(4, "Tahun angkatan tidak valid."),
  email: z.string().email("Email tidak valid."),
  whatsapp: z.string().min(10, "Nomor WhatsApp tidak valid."),
})

export default function MembershipPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            nim: "",
            faculty: "",
            year: "",
            email: "",
            whatsapp: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            const result = await addMember(values);
            if (result.success) {
                toast({
                    title: "Pendaftaran Berhasil!",
                    description: "Data Anda telah kami simpan. Selamat bergabung!",
                });
                form.reset();
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

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold font-headline">Data Keanggotaan</h1>
            <p className="text-muted-foreground">Formulir pendaftaran, daftar anggota, dan kartu anggota digital.</p>
        </div>
        <Tabs defaultValue="registration">
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
                                <FormField control={form.control} name="year" render={({ field }) => (
                                    <FormItem><FormLabel>Tahun Angkatan</FormLabel><FormControl><Input placeholder="Contoh: 2022" {...field} disabled={isLoading} /></FormControl><FormMessage /></FormItem>
                                )}/>
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
                        <CardDescription>Berikut adalah daftar anggota yang telah bergabung.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <MemberList />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="card">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Kartu Anggota Digital</CardTitle>
                        <CardDescription>Contoh kartu tanda anggota PMII.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center items-center">
                        <div className="w-full max-w-md bg-gradient-to-br from-primary via-green-500 to-green-600 text-primary-foreground rounded-xl p-6 shadow-lg space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-headline text-xl">KARTU ANGGOTA</h3>
                                    <p className="font-body text-sm opacity-90">Pergerakan Mahasiswa Islam Indonesia</p>
                                </div>
                                <Logo className="w-12 h-12" />
                            </div>
                            <div className="flex items-center gap-4 pt-4">
                                <Avatar className="w-20 h-20 border-4 border-white">
                                    <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="person portrait" />
                                    <AvatarFallback>SN</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-body text-xs">Nama</p>
                                    <h4 className="font-headline text-lg">SAHABAT NAMA</h4>
                                    <p className="font-body text-xs mt-1">NIM</p>
                                    <p className="font-body font-semibold">1234567890</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-body text-xs">Ketua Cabang</p>
                                <p className="font-headline mt-2">.....................</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  )
}
