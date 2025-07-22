'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import Image from "next/image";
import { useState } from "react";

const pastEvents = [
    { src: "https://placehold.co/600x400.png", alt: "PKD 2023", hint: "student meeting" },
    { src: "https://placehold.co/600x400.png", alt: "Seminar Kebangsaan", hint: "conference presentation" },
    { src: "https://placehold.co/600x400.png", alt: "Aksi Sosial", hint: "community volunteering" },
    { src: "https://placehold.co/600x400.png", alt: "Rapat Anggota", hint: "group discussion" },
]

export default function EventsPage() {
    const [date, setDate] = useState<Date | undefined>(new Date());

    return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold font-headline">Kegiatan & Agenda</h1>
            <p className="text-muted-foreground">Kalender acara, pendaftaran, dan dokumentasi kegiatan PMII.</p>
        </div>
        <Tabs defaultValue="calendar">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="calendar">Kalender Kegiatan</TabsTrigger>
                <TabsTrigger value="documentation">Dokumentasi</TabsTrigger>
            </TabsList>
            <TabsContent value="calendar">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Kalender Kegiatan</CardTitle>
                        <CardDescription>Jadwal acara dan kegiatan yang akan datang.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border"
                            disabled={(date) => date < new Date("1900-01-01")}
                        />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="documentation">
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Dokumentasi Kegiatan</CardTitle>
                        <CardDescription>Galeri foto dan video dari acara-acara yang telah berlangsung.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {pastEvents.map((event, index) => (
                                <div key={index} className="overflow-hidden rounded-lg">
                                    <Image
                                        src={event.src}
                                        alt={event.alt}
                                        width={600}
                                        height={400}
                                        data-ai-hint={event.hint}
                                        className="h-auto w-full object-cover transition-transform hover:scale-105"
                                    />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
    )
}
