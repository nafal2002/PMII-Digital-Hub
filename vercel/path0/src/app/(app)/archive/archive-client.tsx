'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Loader2 } from "lucide-react";
import { getDocuments, DocumentData } from "@/ai/flows/get-documents";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Frown } from 'lucide-react';

function ArchiveList() {
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const { documents } = await getDocuments();
        setDocuments(documents);
      } catch (err) {
        setError('Gagal memuat dokumen. Silakan coba lagi nanti.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDocuments();
  }, []);

  if (isLoading) {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
                <Card key={i} className="flex flex-col">
                    <CardHeader className="flex-row items-center gap-4 pb-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                            <FileText className="w-6 h-6 text-primary" />
                        </div>
                        <div className="w-full space-y-2">
                             <div className="h-5 w-3/4 bg-muted rounded animate-pulse"></div>
                             <div className="h-4 w-1/2 bg-muted rounded animate-pulse"></div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col justify-between">
                         <div className="space-y-2">
                             <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
                              <div className="h-4 w-5/6 bg-muted rounded animate-pulse"></div>
                         </div>
                        <Button variant="outline" className="w-full mt-4" disabled>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Memuat...
                        </Button>
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

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {documents.map((doc, index) => (
        <Card key={index} className="flex flex-col">
          <CardHeader className="flex-row items-center gap-4 pb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="font-headline text-lg leading-tight">{doc.title}</CardTitle>
              <CardDescription>{doc.category}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-between">
            <p className="text-sm mb-4 font-body text-muted-foreground">{doc.description}</p>
            <Button variant="outline" className="w-full mt-auto" disabled>
              <Download className="mr-2 h-4 w-4" />
              Unduh Dokumen
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}


export default function ArchiveClient() {
    return <ArchiveList />;
}
