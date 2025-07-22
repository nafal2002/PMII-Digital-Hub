// src/app/(app)/membership/member-list.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getMembers, MemberData } from '@/ai/flows/get-members';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Frown, Users, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MemberList() {
  const [members, setMembers] = useState<MemberData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setIsLoading(true);
        setError('');
        const result = await getMembers();
        // Sort members by fullName alphabetically
        const sortedMembers = result.members.sort((a, b) => a.fullName.localeCompare(b.fullName));
        setMembers(sortedMembers);
      } catch (err) {
        setError('Gagal memuat data anggota. Silakan coba lagi nanti.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
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

  if (members.length === 0) {
    return (
        <Alert>
            <Users className="h-4 w-4" />
            <AlertTitle>Belum Ada Anggota</AlertTitle>
            <AlertDescription>
                Saat ini belum ada anggota yang terdaftar. Silakan daftar melalui tab Pendaftaran.
            </AlertDescription>
        </Alert>
    )
  }

  return (
    <div className="border rounded-md">
        <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Nama Lengkap</TableHead>
                <TableHead className="hidden md:table-cell">NIM</TableHead>
                <TableHead className="hidden lg:table-cell">Fakultas</TableHead>
                <TableHead>Angkatan</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {members.map((member) => (
                <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.fullName}</TableCell>
                    <TableCell className="hidden md:table-cell">{member.nim}</TableCell>
                    <TableCell className="hidden lg:table-cell">{member.faculty}</TableCell>
                    <TableCell>{member.year}</TableCell>
                    <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/membership/${member.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                Lihat Profil
                            </Link>
                        </Button>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
  );
}
