
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SendHorizonal, Bot, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { chat } from '@/ai/flows/chatbot-flow';
import type { Message } from 'genkit';

// Define a simple, serializable message type for the client
interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

const initialBotMessage: ChatMessage = {
  role: 'model',
  content: 'Assalamualaikum! Saya Sahabat/i AI. Ada yang bisa saya bantu terkait PMII?'
};

export default function ChatbotPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([initialBotMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div');
      if (viewport) {
        viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
      }
    }
  };
  
  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    const genkitHistory: Message[] = newMessages
        .filter(m => m.content?.trim() !== '') // Filter out empty messages
        .map(m => ({ role: m.role, content: [{text: m.content}] }));

    try {
        const stream = await chat(genkitHistory);
        
        let isFirstChunk = true;
        let modelResponse = '';

        for await (const chunk of stream) {
            modelResponse += chunk;
            if (isFirstChunk) {
                setMessages(prev => [...prev, { role: 'model', content: modelResponse }]);
                isFirstChunk = false;
            } else {
                 setMessages(prev => {
                    const lastMessageIndex = prev.length - 1;
                    const updatedMessages = [...prev];
                    if (updatedMessages[lastMessageIndex]?.role === 'model') {
                        updatedMessages[lastMessageIndex] = { ...updatedMessages[lastMessageIndex], content: modelResponse };
                    }
                    return updatedMessages;
                });
            }
        }
    } catch (error) {
        console.error("Error fetching chatbot response:", error);
         setMessages(prev => [
            ...prev,
            { role: 'model', content: "Maaf, terjadi kesalahan. Silakan coba lagi." }
        ]);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  return (
    <>
      <div className={cn("fixed bottom-6 right-6 z-50 transition-transform duration-300 ease-in-out", isOpen ? "scale-0" : "scale-100")}>
        <Button
          size="lg"
          className="rounded-full w-16 h-16 shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <Bot className="h-8 w-8" />
          <span className="sr-only">Buka Chatbot</span>
        </Button>
      </div>

      <div className={cn(
        "fixed bottom-6 right-6 z-50 w-[calc(100%-3rem)] max-w-md transition-all duration-300 ease-in-out",
        isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
      )}>
        <Card className="flex flex-col h-[60vh] shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <div className="flex items-center gap-3">
              <Bot className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="font-headline text-lg">Sahabat/i AI</CardTitle>
                <CardDescription>Chatbot PMII</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Tutup Chatbot</span>
            </Button>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full" ref={scrollAreaRef}>
              <div className="p-4 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex gap-2 items-start',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.role === 'model' && (
                       <div className="p-2 bg-primary text-primary-foreground rounded-full">
                         <Bot className="w-5 h-5" />
                       </div>
                    )}
                    <div
                      className={cn(
                        'rounded-lg px-4 py-2 max-w-xs break-words whitespace-pre-wrap',
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      )}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                 {isLoading && messages[messages.length - 1]?.role === 'user' && (
                    <div className="flex gap-2 items-start justify-start">
                        <div className="p-2 bg-primary text-primary-foreground rounded-full">
                            <Bot className="w-5 h-5" />
                        </div>
                        <div className="rounded-lg px-4 py-2 max-w-xs bg-muted">
                            <Loader2 className="w-5 h-5 animate-spin"/>
                        </div>
                    </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <div className="border-t p-4">
            <div className="relative">
              <Input
                placeholder="Tanya sesuatu..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                disabled={isLoading}
                className="pr-12"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
              >
                <SendHorizonal className="h-4 w-4" />
                <span className="sr-only">Kirim</span>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
