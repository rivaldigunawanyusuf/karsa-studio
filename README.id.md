# Karsa Studio

**Karsa Studio** adalah aplikasi editor *Text-to-Diagram* profesional berfitur lengkap yang dirilis secara **Open Source (Non-Commercial)**. Aplikasi ini sangat ringan, sangat cepat, dan memproses seluruh data sepenuhnya di *browser* pengguna (100% Client-Side). Tujuan utama dibuatnya proyek ini adalah untuk membantu para pengembang, desainer arsitektur sistem, manajer proyek, dan siapa saja yang perlu memvisualisasikan ide, arsitektur, dan alur kerja secara cepat hanya dengan mengetik kode, tanpa perlu menggambar manual.

Aplikasi ini dapat diakses secara langsung di: **[karsa-studio.rivaldigunawanyusuf.com](https://karsa-studio.rivaldigunawanyusuf.com)**

## Fitur Unggulan

- **100% Client-Side & Offline-First:** Semua *rendering* diagram dilakukan langsung di peramban pengguna. Berjalan sempurna sebagai PWA (Progressive Web App), sehingga dapat digunakan 100% *offline* setelah dibuka pertama kali. Beban server nyaris 0!
- **Sistem Ekstensi Eksklusif:** Mendukung impor *file* standar `.mermaid`, `.md`, dan `.txt`. Proyek ini juga menggunakan ekstensi khusus: `.krs` untuk dokumen tunggal, dan `.karsa` untuk menyimpan keseluruhan *project* multi-dokumen.
- **Multi-bahasa (i18n):** Tersedia 5 bahasa secara bawaan: Bahasa Inggris, Bahasa Indonesia, Mandarin (中文), Jepang (日本語), dan Rusia (Русский), yang dapat diubah *real-time* tanpa perlu memuat ulang halaman.
- **Manajemen Dokumen Lokal:** Anda dapat membuat banyak dokumen diagram sekaligus. Tersedia opsi seleksi ganda untuk Duplikasi atau Penghapusan Massal. Semua data disimpan secara otomatis ke dalam `localStorage` di peramban Anda. Tidak ada data sensitif yang dikirim ke server.
- **Kaya Template:** Puluhan *template* standar industri yang telah dirapikan (Arsitektur, *Flowchart*, ERD, *Gantt Chart*, *Mindmap*, dll).
- **Tema Dinamis & Kustomisasi:** Mendukung Mode Gelap/Terang, pengaturan font, *layout engine*, serta fitur *custom styling* (preset warna).
- **Ekspor Berkualitas Tinggi:** Ekspor diagram dengan satu klik ke berbagai format seperti SVG (Vektor), PNG Resolusi Tinggi (hingga 4x HD), PDF, atau salin (*copy*) kodenya dengan instan.
- **Responsif dan Lintas Perangkat:** Antarmuka dirancang fleksibel untuk mendukung berbagai ukuran layar. Dapat dibuka dengan lancar di perangkat *desktop* maupun *mobile*.

---

## Instalasi & Menjalankan Aplikasi Lokal (Mac / Linux / Windows)

Karena aplikasi ini tidak memerlukan *backend*, Anda dapat menjalankannya dengan *development server* biasa atau mengunggahnya (*deploy*) ke layanan *hosting* statis.

### Persyaratan
- [Node.js](https://nodejs.org/) (versi 16 ke atas)

### 1. Cara Cepat (Skrip Otomatis)
Kami telah menyediakan skrip bantuan di direktori proyek yang secara otomatis akan mengecek ketersediaan Node.js, menginstal dependensi, mencari port yang kosong, dan menjalankan server lokal.

**Untuk Pengguna Mac OS / Linux:**
```bash
# Beri hak akses eksekusi pada skrip (hanya sekali)
chmod +x start.sh

# Jalankan skrip
./start.sh
```

**Untuk Pengguna Windows:**
Cukup klik ganda (double-click) file `start.bat` di File Explorer Anda, atau jalankan melalui Command Prompt / PowerShell:
```cmd
start.bat
```

### 2. Cara Manual (Langkah demi Langkah)
Jika Anda lebih suka menjalankannya secara manual atau jika skrip otomatis gagal, ikuti langkah-langkah berikut di terminal Anda (kompatibel untuk Mac, Linux, dan Windows):

```bash
# 1. Masuk ke folder proyek
cd mermaid-studio

# 2. Install dependensi (hanya perlu pertama kali saja)
npm install

# 3. Jalankan server lokal
npm run dev

# 4. Buka browser Anda dan kunjungi URL yang tampil di terminal (biasanya http://localhost:5173)
```

---

## Jalan Pintas (Keyboard Shortcuts)

Karsa Studio mendukung berbagai kombinasi tombol *keyboard* standar untuk mempercepat pekerjaan Anda. Tombol modifikator akan beradaptasi secara otomatis tergantung Sistem Operasi Anda:
- **Mac OS:** Gunakan tombol `Cmd (⌘)`.
- **Windows / Linux:** Gunakan tombol `Ctrl`.

| Aksi | Shortcut (Mac) | Shortcut (Windows/Linux) |
| :--- | :--- | :--- |
| **Simpan / Render Diagram** | `Cmd + S` | `Ctrl + S` |
| **Undo (Batal Edit)** | `Cmd + Z` | `Ctrl + Z` |
| **Redo (Ulangi Edit)** | `Cmd + Shift + Z` | `Ctrl + Y` atau `Ctrl + Shift + Z` |
| **Cari di dalam Editor** | `Cmd + F` | `Ctrl + F` |
| **Timpa / Replace di Editor** | `Cmd + Option + F` | `Ctrl + H` |

Aplikasi akan berjalan di `http://localhost:5173/`.

---

## Deployment ke Production (Sangat Mudah)

Karsa dirancang khusus sebagai **Static Site Application (SPA)**. Anda dapat mengunggahnya (*host*) secara gratis tanpa perlu menyewa *server database* atau VPS yang mahal.

1. Jalankan proses *build*:
   ```bash
   npm run build
   ```
2. Ini akan menghasilkan folder `dist/` yang berisi kumpulan _file_ statis (HTML, CSS, dan JS yang telah dikompresi).
3. Anda dapat langsung mengunggah folder `dist/` ini ke layanan *hosting* statis pilihan Anda.
4. Jangan lupa arahkan domain Anda (karsa-studio.rivaldigunawanyusuf.com) ke layanan *hosting* tersebut.

Ketika pengguna mengunjungi situs Anda, peramban mereka yang akan memikul beban kerja (*rendering* diagram), memastikan situs Anda sangat kuat menahan lonjakan *traffic* tinggi tanpa membuat server terbebani!

---

## Tech Stack (Teknologi yang Digunakan)

- **Frontend Build Tool:** Vite - Sangat cepat untuk proses *development*.
- **Diagram Engine:** Text-to-Diagram Engine berbasis JS (Client-side rendering).
- **Code Editor:** CodeMirror 6 - Untuk pengalaman mengetik kode yang nyaman (dengan *syntax highlighting*).
- **State Management:** Dibangun sendiri menggunakan arsitektur `EventTarget` (sangat ringan) terintegrasi dengan `localStorage`.
- **Ekspor Gambar:** Menggunakan HTML5 Canvas API dan modul PDF renderer.
- **Desain UI:** CSS *Vanilla* (*Custom properties/Variables*) dan *Glassmorphism UI* agar mudah di-*maintain* tanpa framework CSS yang berat.

---

## Lisensi

Proyek ini menggunakan lisensi **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)**. 

**Artinya:**
Anda diizinkan untuk mengunduh, mempelajari, memodifikasi, dan menggunakan Karsa untuk proyek pribadi, alat bantu internal non-profit, kontribusi *open source*, atau portofolio.
**NAMUN, ANDA DILARANG KERAS** menggunakan aplikasi ini, atau *source code*-nya, untuk tujuan komersial, dijual kembali, atau dimonetisasi (dijadikan produk berbayar) dalam bentuk apa pun. Hak komersial sepenuhnya dipegang oleh pembuat asli.

**Selamat Berkarya!** Jangan ragu untuk mempelajari dan mengembangkan rancangan Karsa.

---

## Tentang Proyek Ini

Karsa Studio adalah editor diagram (frontend interface) yang dikembangkan di atas ekosistem Mermaid.js. Aplikasi ini memanfaatkan mesin perender dan sintaks skrip dari Mermaid untuk memvisualisasikan diagram secara langsung.

Proyek ini pada awalnya dibuat untuk kebutuhan internal pribadi guna mempermudah pembuatan diagram dengan antarmuka yang dikustomisasi.

Saat ini, proyek bersifat Open Source dan terbuka untuk digunakan oleh siapa saja. Anda dapat mengakses dan menggunakan aplikasi ini secara gratis di `karsa-studio.rivaldigunawanyusuf.com`.
