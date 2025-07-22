'use client';

import { useState } from 'react';
import { summarizeDocument } from '@/ai/flows/document-summarization';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Terminal, Wand2 } from 'lucide-react';

export default function SummarizationClient() {
  const [documentText, setDocumentText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentText.trim()) {
      setError('Teks dokumen tidak boleh kosong.');
      return;
    }
    setError('');
    setIsLoading(true);
    setSummary('');

    try {
      const result = await summarizeDocument({ documentText });
      setSummary(result.summary);
    } catch (err) {
      setError('Gagal membuat ringkasan. Silakan coba lagi.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Tempelkan teks dokumen di sini..."
          value={documentText}
          onChange={(e) => setDocumentText(e.target.value)}
          className="min-h-[200px] font-body"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !documentText}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Ringkas
            </>
          )}
        </Button>
      </form>

      {error && (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Terjadi Kesalahan</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {summary && (
        <Card className="bg-primary/5">
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <Wand2 className="mr-2 text-primary" />
              Hasil Ringkasan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-body whitespace-pre-wrap">{summary}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
