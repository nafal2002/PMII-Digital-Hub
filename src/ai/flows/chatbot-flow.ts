
'use server';

/**
 * @fileOverview A simple, rule-based chatbot for PMII.
 * This chatbot provides predefined answers to common questions.
 */

import type { Message } from 'genkit';
import { getMembers } from './get-members';
import { getModules } from './get-modules';

const qaMap: { [key: string]: string } = {
  'halo': 'Assalamualaikum! Ada yang bisa saya bantu terkait PMII?',
  'hai': 'Assalamualaikum! Ada yang bisa saya bantu terkait PMII?',
  'ada kegiatan apa': 'Kegiatan terdekat adalah Pelatihan Kader Dasar (PKD) 2024. Informasi lebih lanjut bisa dilihat di halaman Kegiatan.',
  'modul apa saja': 'Ada banyak modul materi yang tersedia, seperti modul NDP, AD/ART, Manajemen Aksi, dan materi KOPRI. Semuanya bisa diunduh di halaman Materi.',
  'dokumen di arsip': 'Halaman Arsip berisi dokumen penting seperti AD/ART, Notulensi Rapat, LPJ Kegiatan, dan SK Pengurus. Silakan kunjungi halaman Arsip untuk mengunduhnya.',
  'apa itu mapaba': 'MAPABA adalah singkatan dari Masa Penerimaan Anggota Baru. Ini adalah gerbang awal untuk menjadi anggota PMII.',
  'apa itu pkd': 'PKD adalah singkatan dari Pelatihan Kader Dasar, yaitu jenjang kaderisasi formal kedua di PMII setelah MAPABA.',
  'apa itu ndp': 'NDP adalah singkatan dari Nilai Dasar Pergerakan, yaitu landasan ideologis dan filosofis PMII.',
  'apa itu aswaja': 'Aswaja (Ahlussunnah wal Jama\'ah) adalah paham keagamaan yang menjadi landasan ideologi PMII, merujuk pada pemikiran Imam Asy\'ari dan Imam Maturidi.',
  'apa itu kopri': 'KOPRI adalah singkatan dari Korps PMII Putri, badan semi-otonom yang berfungsi sebagai wadah kaderisasi dan pergerakan bagi kader putri PMII.',
  'siapa ketua umum': 'Ketua Umum PB PMII saat ini adalah Sahabat Muhammad Abdullah Syukri. Untuk informasi pengurus tingkat cabang, silakan cek dokumen SK di halaman Arsip.',
  'sejarah pmii': 'PMII didirikan pada 17 April 1960 di Surabaya. Sejarah lengkapnya bisa Anda temukan pada dokumen di halaman Materi atau Arsip.',
  'terima kasih': 'Sama-sama! Senang bisa membantu.',
};

async function getDynamicAnswer(question: string): Promise<string | null> {
    if (question.includes('berapa jumlah anggota')) {
        try {
            const { members } = await getMembers();
            const memberCount = members.length;
            return `Saat ini, PMII Digital Hub memiliki ${memberCount} anggota terdaftar. Anda bisa melihat daftarnya di halaman Keanggotaan.`;
        } catch (error) {
            console.error('Error fetching member count:', error);
            return 'Maaf, saya tidak dapat mengambil data jumlah anggota saat ini.';
        }
    } else if (question.includes('jumlah modul') || question.includes('ada berapa modul')) {
        try {
            const { modules } = await getModules();
            const moduleCount = modules.length;
            return `Terdapat ${moduleCount} modul yang tersedia di halaman Materi.`;
        } catch (error) {
            console.error('Error fetching module count:', error);
            return 'Maaf, saya tidak dapat mengambil data jumlah modul saat ini.';
        }
    }
    return null;
}


function getStaticAnswer(question: string): string | null {
  for (const key in qaMap) {
    if (question.includes(key)) {
      return qaMap[key];
    }
  }
  return null;
}


export async function chat(history: Message[]): Promise<string> {
  const lastUserMessage = history.findLast(m => m.role === 'user');
  
  if (lastUserMessage && lastUserMessage.content[0]?.text) {
    const userText = lastUserMessage.content[0].text.toLowerCase();

    const dynamicAnswer = await getDynamicAnswer(userText);
    if (dynamicAnswer) {
        return dynamicAnswer;
    }

    const staticAnswer = getStaticAnswer(userText);
    if (staticAnswer) {
        return staticAnswer;
    }

    return 'Maaf, saya belum mengerti pertanyaan itu. Silakan coba pertanyaan lain yang lebih sederhana.';
  }

  return 'Maaf, terjadi kesalahan. Silakan coba lagi.';
}
