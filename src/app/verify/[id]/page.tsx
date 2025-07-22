// src/app/verify/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getMemberById } from '@/ai/flows/get-member-by-id';
import { MemberData } from '@/ai/flows/get-members';
import { DigitalCard } from '@/components/digital-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Frown, Search } from 'lucide-react';
import { Logo } from '@/components/icons';

export default function VerifyPage({ params }: { params: { id: string } }) {
  const [member, setMember] = useState<MemberData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [originUrl, setOriginUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
        setOriginUrl(window.location.origin);
    }
    
    const fetchMember = async () => {
      if (!params.id) {
        setError('ID Anggota tidak valid.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError('');
        const result = await getMemberById({ id: params.id });
        if (result.member) {
          setMember(result.member);
        } else {
          setError('Anggota dengan ID ini tidak ditemukan.');
        }
      } catch (err) {
        setError('Gagal memverifikasi data anggota. Silakan coba lagi nanti.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMember();
  }, [params.id]);

  return (
    <div className="min-h-screen bg-muted/40 flex flex-col items-center justify-center p-4">
        <div className="flex items-center gap-3 mb-8">
            <Logo className="size-10 text-primary" />
            <div>
                <h1 className="text-2xl font-bold font-headline">Verifikasi Kartu Anggota</h1>
                <p className="text-muted-foreground">PMII Digital Hub</p>
            </div>
        </div>

        <div className="w-full max-w-sm">
            {isLoading && (
                <div className="space-y-4">
                    <Skeleton className="h-56 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            )}
            {error && !isLoading && (
                 <Alert variant="destructive">
                    <Frown className="h-4 w-4" />
                    <AlertTitle>Verifikasi Gagal</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            {!isLoading && !error && member && (
                <div className='flex flex-col items-center gap-4'>
                    <Alert variant="default" className="border-primary/50 bg-primary/10">
                        <Search className="h-4 w-4" />
                        <AlertTitle className='text-primary'>Kartu Terverifikasi</AlertTitle>
                        <AlertDescription className='text-primary/80'>
                            Kartu anggota ini asli dan terdaftar dalam sistem PMII Digital Hub.
                        </AlertDescription>
                    </Alert>
                    <DigitalCard member={member} verificationUrl={`${originUrl}/verify/${member.id}`} />
                </div>
            )}
        </div>
    </div>
  );
}
