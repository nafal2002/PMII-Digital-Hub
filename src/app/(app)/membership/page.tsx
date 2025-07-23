
import { Suspense } from 'react';
import MembershipClient from './membership-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function MembershipSkeleton() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Data Keanggotaan</h1>
                <p className="text-muted-foreground">Formulir pendaftaran, daftar anggota, dan kartu anggota digital.</p>
            </div>
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64 mt-2" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}


export default function MembershipPage() {
  return (
    <Suspense fallback={<MembershipSkeleton />}>
      <MembershipClient />
    </Suspense>
  );
}
