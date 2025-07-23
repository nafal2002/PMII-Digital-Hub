
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
  'modul apa saja': 'Ada banyak modul kaderisasi yang tersedia, seperti modul NDP, AD/ART, Manajemen Aksi, dan materi KOPRI. Semuanya bisa diunduh di halaman Kaderisasi.',
  'dokumen di arsip': 'Halaman Arsip berisi dokumen penting seperti AD/ART, Notulensi Rapat, LPJ Kegiatan, dan SK Pengurus. Silakan kunjungi halaman Arsip untuk mengunduhnya.',
  'apa itu mapaba': 'MAPABA adalah singkatan dari Masa Penerimaan Anggota Baru. Ini adalah gerbang awal untuk menjadi anggota PMII.',
  'apa itu pkd': 'PKD adalah singkatan dari Pelatihan Kader Dasar, yaitu jenjang kaderisasi formal kedua di PMII setelah MAPABA.',
  'apa itu ndp': 'NDP adalah singkatan dari Nilai Dasar Pergerakan, yaitu landasan ideologis dan filosofis PMII.',
  'apa itu aswaja': 'Aswaja (Ahlussunnah wal Jama\'ah) adalah paham keagamaan yang menjadi landasan ideologi PMII, merujuk pada pemikiran Imam Asy\'ari dan Imam Maturidi.',
  'apa itu kopri': 'KOPRI adalah singkatan dari Korps PMII Putri, badan semi-otonom yang berfungsi sebagai wadah kaderisasi dan pergerakan bagi kader putri PMII.',
  'siapa ketua umum': 'Ketua Umum PB PMII saat ini adalah Sahabat Muhammad Abdullah Syukri. Untuk informasi pengurus tingkat cabang, silakan cek dokumen SK di halaman Arsip.',
  'sejarah pmii': 'PMII didirikan pada 17 April 1960 di Surabaya. Sejarah lengkapnya bisa Anda temukan pada dokumen di halaman Kaderisasi atau Arsip.',
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
