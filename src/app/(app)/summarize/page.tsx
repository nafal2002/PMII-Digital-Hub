import SummarizationClient from "./summarization-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SummarizePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Ringkasan Dokumen (AI)</h1>
        <p className="text-muted-foreground">
          Punya dokumen panjang seperti notulensi rapat atau LPJ? Alat ini membantu Anda membuat rangkumannya secara otomatis.
        </p>
      </div>
      <Card>
        <CardHeader>
            <CardTitle className="font-headline">Alat Ringkasan Otomatis</CardTitle>
            <CardDescription>
                Salin teks dari dokumen Anda (misalnya: .pdf, .docx), tempel di bawah, dan biarkan AI membuat ringkasan poin-poin pentingnya untuk Anda.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <SummarizationClient />
        </CardContent>
      </Card>
    </div>
  );
}
