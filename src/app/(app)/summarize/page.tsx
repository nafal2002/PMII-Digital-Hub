import SummarizationClient from "./summarization-client";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SummarizePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Ringkasan Dokumen (AI)</h1>
        <p className="text-muted-foreground">
          Gunakan alat bantu AI untuk merangkum dan memahami konteks dokumen PMII dengan cepat.
        </p>
      </div>
      <Card>
        <CardHeader>
            <CardTitle className="font-headline">Alat Ringkasan Dokumen</CardTitle>
            <CardDescription>
                Salin dan tempel teks dari dokumen Anda ke dalam kotak di bawah ini, lalu klik "Ringkas" untuk mendapatkan rangkumannya.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <SummarizationClient />
        </CardContent>
      </Card>
    </div>
  );
}
