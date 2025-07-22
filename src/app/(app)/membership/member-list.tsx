// src/app/(app)/membership/member-list.tsx
'use client';

import { useEffect, useState } from 'react';
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
import { Frown, Users } from 'lucide-react';

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
        setMembers(result.members);
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
                <TableHead>NIM</TableHead>
                <TableHead className="hidden md:table-cell">Fakultas</TableHead>
                <TableHead className="hidden lg:table-cell">Email</TableHead>
                <TableHead>Angkatan</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {members.map((member) => (
                <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.fullName}</TableCell>
                    <TableCell>{member.nim}</TableCell>
                    <TableCell className="hidden md:table-cell">{member.faculty}</TableCell>
                    <TableCell className="hidden lg:table-cell">{member.email}</TableCell>
                    <TableCell>{member.year}</TableCell>
                </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
  );
}
