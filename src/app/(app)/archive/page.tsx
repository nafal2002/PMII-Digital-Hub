import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { getDocuments } from "@/ai/flows/get-documents";

export default async function ArchivePage() {
  const { documents } = await getDocuments();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Dokumentasi & Arsip</h1>
        <p className="text-muted-foreground">Pusat unduhan dokumen, notulensi, dan surat-surat penting PMII.</p>
      </div>

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
              <Button variant="outline" className="w-full mt-auto">
                <Download className="mr-2 h-4 w-4" />
                Unduh Dokumen
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
