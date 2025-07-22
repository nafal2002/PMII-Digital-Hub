// src/components/digital-card.tsx
'use client';
import { forwardRef } from 'react';
import QRCode from 'react-qr-code';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Logo } from '@/components/icons';
import type { MemberData } from '@/ai/flows/get-members';

interface DigitalCardProps {
  member: MemberData;
  verificationUrl?: string;
}

export const DigitalCard = forwardRef<HTMLDivElement, DigitalCardProps>(
  ({ member, verificationUrl }, ref) => {
    
    const fallbackInitial = member.fullName.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
    
    const avatarImageSrc = member.photoUrl 
        ? member.photoUrl 
        : `https://api.dicebear.com/8.x/initials/svg?seed=${member.fullName}`;
    
    const qrCodeValue = verificationUrl ? verificationUrl : JSON.stringify({
      id: member.id,
      name: member.fullName,
      whatsapp: member.whatsapp
    });

    return (
      <div 
        ref={ref} 
        className="w-full max-w-sm bg-card text-card-foreground rounded-xl shadow-lg border-4 border-yellow-500 overflow-hidden"
      >
        <div className="p-4 bg-yellow-500 text-primary-foreground flex justify-between items-center">
             <div>
                <h3 className="font-headline text-lg font-bold text-gray-900">KARTU ANGGOTA</h3>
                <p className="font-body text-xs text-gray-800 opacity-90">Pergerakan Mahasiswa Islam Indonesia</p>
            </div>
            <Logo className="w-12 h-12 text-gray-900" />
        </div>
        <div className="p-4 flex gap-4">
             <Avatar className="w-20 h-20 rounded-md border-4 border-white shadow-md">
                <AvatarImage src={avatarImageSrc} data-ai-hint="person portrait" />
                <AvatarFallback>{fallbackInitial}</AvatarFallback>
            </Avatar>
            <div className="flex-grow overflow-hidden">
                <p className="font-headline font-bold text-base truncate">{member.fullName.toUpperCase()}</p>
                <p className="font-body text-sm text-muted-foreground">{member.nim}</p>
                <p className="font-body text-sm text-muted-foreground">{member.faculty} - {member.year}</p>
            </div>
        </div>
        <div className="bg-muted/50 p-4 flex gap-4 items-center">
            <div className="bg-white p-1 rounded-md">
                <QRCode value={qrCodeValue} size={64} />
            </div>
            <div className="text-xs text-muted-foreground">
                <p className="font-bold">ID Anggota:</p>
                <p className="font-mono">{member.id}</p>
                <p className="mt-1">Pindai untuk verifikasi keaslian kartu.</p>
            </div>
        </div>
      </div>
    );
  }
);

DigitalCard.displayName = 'DigitalCard';
