
'use server';

/**
 * @fileOverview A simple, rule-based chatbot for PMII.
 * This chatbot provides predefined answers to common questions.
 */

import type { Message } from 'genkit';

const qaMap: { [key: string]: string } = {
  'halo': 'Assalamualaikum! Ada yang bisa saya bantu terkait PMII?',
  'hai': 'Assalamualaikum! Ada yang bisa saya bantu terkait PMII?',
  'berapa jumlah anggota': 'Saat ini, PMII Digital Hub memiliki 12 anggota terdaftar. Anda bisa melihat daftarnya di halaman Keanggotaan.',
  'ada kegiatan apa': 'Kegiatan terdekat adalah Pelatihan Kader Dasar (PKD) 2024. Informasi lebih lanjut bisa dilihat di halaman Kegiatan.',
  'apa itu mapaba': 'MAPABA adalah singkatan dari Masa Penerimaan Anggota Baru. Ini adalah gerbang awal untuk menjadi anggota PMII.',
  'apa itu pkd': 'PKD adalah singkatan dari Pelatihan Kader Dasar, yaitu jenjang kaderisasi formal kedua di PMII setelah MAPABA.',
  'apa itu ndp': 'NDP adalah singkatan dari Nilai Dasar Pergerakan, yaitu landasan ideologis dan filosofis PMII.',
  'terima kasih': 'Sama-sama! Senang bisa membantu.',
};

function getAnswer(question: string): string {
  const lowerCaseQuestion = question.toLowerCase();
  for (const key in qaMap) {
    if (lowerCaseQuestion.includes(key)) {
      return qaMap[key];
    }
  }
  return 'Maaf, saya belum mengerti pertanyaan itu. Silakan coba pertanyaan lain yang lebih sederhana.';
}


export async function chat(history: Message[]): Promise<string> {
  const lastUserMessage = history.findLast(m => m.role === 'user');
  
  if (lastUserMessage && lastUserMessage.content[0]?.text) {
    const userText = lastUserMessage.content[0].text;
    return getAnswer(userText);
  }

  return 'Maaf, terjadi kesalahan. Silakan coba lagi.';
}
