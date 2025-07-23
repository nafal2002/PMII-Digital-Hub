import ArchiveClient from "./archive-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ArchivePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Dokumentasi & Arsip</h1>
        <p className="text-muted-foreground">Pusat unduhan dokumen, notulensi, dan surat-surat penting PMII.</p>
      </div>
      <ArchiveClient />
    </div>
  );
}
