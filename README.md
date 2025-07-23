
#  PMII Digital Hub

![PMII Digital Hub Banner](https://placehold.co/1200x628/1F8A4D/FFFFFF.png?text=PMII+Digital+Hub)

Selamat datang di **PMII Digital Hub**, sebuah platform digital terpusat yang dirancang untuk menjadi pusat informasi, komunikasi, dokumentasi, dan edukasi bagi seluruh kader Pergerakan Mahasiswa Islam Indonesia (PMII).

Aplikasi ini dibangun menggunakan Next.js dan Firebase, dengan memanfaatkan kekuatan AI dari Google (Genkit) untuk menyediakan fitur-fitur cerdas dan interaktif.

---

## ✨ Fitur Utama

- **Beranda Dinamis**: Dasbor utama dengan statistik penting seperti jumlah anggota, ringkasan materi, dan pengumuman terbaru.
- **Manajemen Keanggotaan**:
  - Formulir pendaftaran untuk anggota baru.
  - Daftar lengkap anggota yang terdaftar dengan profil detail.
  - Pembuatan kartu anggota digital dengan QR Code untuk verifikasi.
- **Pusat Materi (Kaderisasi)**: Kumpulan modul, buku panduan, dan materi penting lainnya yang dapat diunduh oleh para kader.
- **Arsip Dokumen**: Tempat terpusat untuk menyimpan dan mengunduh dokumen-dokumen penting organisasi seperti AD/ART, notulensi, LPJ, dan SK.
- **Kalender Kegiatan**: Agenda dan jadwal kegiatan organisasi yang akan datang, lengkap dengan galeri dokumentasi acara yang telah berlalu.
- **Chatbot AI "Sahabat/i AI"**: Asisten virtual yang siap menjawab pertanyaan-pertanyaan umum seputar PMII, didukung oleh Google AI.
- **Verifikasi Kartu Digital**: Halaman publik untuk memverifikasi keaslian kartu anggota melalui pemindaian QR Code.

---

## 🚀 Tumpukan Teknologi

Proyek ini dibangun dengan tumpukan teknologi modern yang tangguh dan skalabel:

- **Framework**: [Next.js](https://nextjs.org/) (dengan App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
- **Backend & Database**: [Firebase](https://firebase.google.com/) (Firestore & Storage)
- **Fitur AI**: [Genkit (Google AI)](https://firebase.google.com/docs/genkit)
- **Deployment**: [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)

---

## 🛠️ Memulai (Lokal)

Untuk menjalankan proyek ini di lingkungan lokal Anda, ikuti langkah-langkah berikut:

1.  **Clone Repositori**
    ```bash
    git clone [URL_REPOSITORI_ANDA]
    cd [NAMA_FOLDER_PROYEK]
    ```

2.  **Install Dependensi**
    Pastikan Anda memiliki Node.js dan npm terinstal.
    ```bash
    npm install
    ```

3.  **Konfigurasi Firebase**
    - Buat proyek baru di [Firebase Console](https://console.firebase.google.com/).
    - Dapatkan konfigurasi Firebase Anda dan letakkan di `src/lib/firebase.ts`.
    - Aktifkan **Firestore** dan **Storage**.
    - Atur Aturan Keamanan (Security Rules) sesuai kebutuhan Anda.

4.  **Konfigurasi Variabel Lingkungan**
    Buat file `.env.local` di root proyek dan tambahkan variabel yang diperlukan (jika ada, misalnya untuk API key).

5.  **Jalankan Server Development**
    ```bash
    npm run dev
    ```
    Aplikasi akan berjalan di `http://localhost:9002`.

---

## 🤝 Kontribusi

Kontribusi dari Anda sangat kami harapkan! Jika Anda menemukan bug atau memiliki ide untuk fitur baru, silakan buka *Issue* atau kirimkan *Pull Request*.

Terima kasih telah menjadi bagian dari pergerakan digital ini!
**Taqwa, Intelektualitas, Profesionalitas.**
