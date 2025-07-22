// src/app/(app)/membership/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getMemberById } from '@/ai/flows/get-member-by-id';
import { MemberData } from '@/ai/flows/get-members';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Frown, ArrowLeft, Mail, Phone, User, Hash, School, Calendar, CreditCard } from 'lucide-react';

export default function MemberProfilePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [member, setMember] = useState<MemberData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchMember = async () => {
      try {
        setIsLoading(true);
        setError('');
        const result = await getMemberById({ id });
        if (result.member) {
          setMember(result.member);
        } else {
          setError('Anggota dengan ID ini tidak ditemukan.');
        }
      } catch (err) {
        setError('Gagal memuat data anggota. Silakan coba lagi nanti.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  const InfoRow = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value?: string }) => (
    <div className="flex items-start gap-4">
      <Icon className="h-5 w-5 text-muted-foreground mt-1" />
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value || '-'}</p>
      </div>
    </div>
  );
  
  const handleCreateCard = () => {
    router.push(`/membership?tab=card&memberId=${id}`);
  };

  if (isLoading) {
    return <Card><CardContent className="p-6"><Skeleton className="h-64 w-full" /></CardContent></Card>;
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

  if (!member) {
    return null;
  }
  
  const fallbackInitial = member.fullName.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
  const avatarImageSrc = member.photoUrl 
      ? member.photoUrl 
      : `https://api.dicebear.com/8.x/initials/svg?seed=${member.fullName}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Kembali</span>
        </Button>
        <div>
            <h1 className="text-2xl font-bold font-headline">Profil Anggota</h1>
            <p className="text-muted-foreground">Detail informasi anggota terdaftar.</p>
        </div>
      </div>
      <Card>
        <CardHeader className="flex-col md:flex-row gap-6 items-center">
            <Avatar className="w-24 h-24 rounded-lg border-4 border-white shadow-md">
                <AvatarImage src={avatarImageSrc} data-ai-hint="person portrait" />
                <AvatarFallback className="rounded-md">{fallbackInitial}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left">
                <CardTitle className="font-headline text-2xl">{member.fullName}</CardTitle>
                <CardDescription>ID Anggota: <span className="font-mono">{member.id}</span></CardDescription>
            </div>
            <Button onClick={handleCreateCard}>
                <CreditCard className="mr-2 h-4 w-4" />
                Buat Kartu Digital
            </Button>
        </CardHeader>
        <CardContent>
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                <InfoRow icon={User} label="Nama Lengkap" value={member.fullName} />
                <InfoRow icon={Hash} label="NIM (Nomor Induk Mahasiswa)" value={member.nim} />
                <InfoRow icon={School} label="Fakultas" value={member.faculty} />
                <InfoRow icon={Calendar} label="Tahun Angkatan" value={member.year} />
                <InfoRow icon={Mail} label="Email" value={member.email} />
                <InfoRow icon={Phone} label="No. WhatsApp" value={member.whatsapp} />
            </div>
        </CardContent>
      </Card>
    </div>
  );
}