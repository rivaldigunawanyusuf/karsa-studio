# Karsa Studio

<p align="center">
  <img src="public/favicon.svg" width="96" height="96" alt="Logo Karsa Studio" />
</p>

<p align="center">
  <strong>Studio Text-to-Diagram Modern, Sangat Cepat, & 100% Client-Side</strong>
</p>

<p align="center">
  <a href="README.md">English</a> •
  <a href="README.id.md">Bahasa Indonesia</a> •
  <a href="README.zh.md">中文 (Mandarin)</a> •
  <a href="README.ja.md">日本語 (Japanese)</a> •
  <a href="README.ru.md">Русский (Russian)</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Lisensi-CC%20BY--NC%204.0-blue.svg" alt="Lisensi: CC BY-NC 4.0" />
  <img src="https://img.shields.io/badge/Arsitektur-100%25%20Client--Side-brightgreen.svg" alt="100% Client-Side" />
  <img src="https://img.shields.io/badge/PWA-Offline--First-orange.svg" alt="PWA Offline First" />
  <img src="https://img.shields.io/badge/Mermaid.js-v12+-blueviolet.svg" alt="Mermaid.js v12+" />
  <img src="https://img.shields.io/badge/Editor-CodeMirror%206-informational.svg" alt="CodeMirror 6" />
</p>

---

**Karsa Studio** adalah aplikasi editor *Text-to-Diagram* profesional berfitur lengkap yang dirilis secara **Open Source (Non-Komersial)**. Seluruh proses kompilasi dan render berjalan 100% di dalam peramban (*browser*) Anda tanpa mengirim sebaris kode pun ke server pihak ketiga. Menggabungkan fleksibilitas diagram berbasis kode dengan kenyamanan navigasi kanvas interaktif layaknya Figma, Karsa Studio dirancang khusus untuk mempermudah *software engineer*, *system architect*, *product manager*, dan *technical writer* dalam merancang visualisasi ide, diagram arsitektur, dan alur sistem hanya dalam hitungan detik.

🌐 **Aplikasi Live:** [karsa-studio.rivaldigunawanyusuf.com](https://karsa-studio.rivaldigunawanyusuf.com)

---

## 🚀 Fitur Unggulan & Kemampuan Utama

### 🔒 100% Client-Side, Privasi Terjaga & Offline-First (PWA)
- **Nol Latensi Server:** Penguraian sintaks (*parsing*) dan perenderan diagram dieksekusi seketika menggunakan Web Worker dan JavaScript lokal peramban.
- **Keamanan Data Mutlak:** Diagram arsitektur rahasia, skema database perusahaan, dan logika bisnis Anda tidak pernah meninggalkan perangkat Anda.
- **Progressive Web App (PWA):** Dapat diinstal sebagai aplikasi *desktop* maupun *mobile*. Bekerja penuh secara *offline* tanpa memerlukan koneksi internet aktif setelah kunjungan pertama.

### 🎨 Kanvas Interaktif ala Figma
- **Pan Kanvas dengan Space + Drag:** Tahan tombol `Space` lalu geser (*drag*) mouse/pointer untuk menjelajahi kanvas secara leluasa, persis seperti navigasi di Figma atau Miro.
- **Zooming Cerdas & Responsif:** Perbesar/perkecil tampilan dengan mudah lewat `Ctrl/Cmd + Scroll`, gestur *pinch* pada trackpad, atau kontrol zoom di layar.
- **Navigasi Presisi Cepat:** Tombol ukuran aktual 1:1 (`Cmd/Ctrl + 1`) dan *Fit to View* / Pas ke Layar (`Cmd/Ctrl + 0` atau klik ganda pada kanvas).
- **Kustomisasi Latar Belakang Kanvas:** Pilihan tampilan titik-titik (*dots*), kisi-kisi (*grid*), polos (*plain*), atau transparan yang beradaptasi dengan mode warna.

### 💻 Editor Kode Canggih CodeMirror 6
- **Syntax Highlighting & Validasi Real-Time:** Pendeteksian error sintaks otomatis dengan indikator baris bermasalah serta pesan bantuan instan.
- **Pengguliran Mulus di Desktop & Mobile:** Kontainer scroll dengan batas viewport presisi, mendukung *mouse wheel*, *trackpad*, serta *momentum touch swipe* di perangkat ponsel dan tablet.
- **Bilah Alat Sisip Cepat (Quick Insert Toolbar):** Sisipkan Node, Simbol Keputusan (Belah Ketupat), Subgraph, Database, Lingkaran, Garis Putus-putus, dan Panah Tebal hanya dengan 1 klik.
- **Fitur Ketik Pro:** Multi-kursor (`Alt + Klik`), pelipatan blok kode (*code folding*), penutupan kurung otomatis, *toggle* komentar (`Cmd/Ctrl + /`), serta cari & ganti (*Find and Replace* `Cmd/Ctrl + F`).
- **Tata Letak Fleksibel:** Mode belah layar (*split-view*) dengan pemisah yang dapat digeser, orientasi horizontal/vertikal, serta tombol fokus satu-klik untuk mode *full editor* atau *full preview*.

### 📚 24 Template Diagram Standar Industri Bawaan
Tersedia 24 contoh diagram siap pakai yang dirancang dengan rapi dan dikelompokkan ke dalam 6 kategori:
1. **Flowchart & Proses:** Flowchart Standar, Alur Arsitektur (LR), Diagram Mesin Status (*State Machine*).
2. **Database & Pemrograman:** Relational Database ERD (PK/FK), Diagram Kelas OOP, Matriks Kebutuhan (*Requirements Traceability*), Format Byte Paket Jaringan.
3. **Interaksi & Sistem:** Diagram Sekuensial (Alur Autentikasi), Arsitektur Cloud, C4 System Context, Diagram Blok Bebas.
4. **Perencanaan & Roadmap:** Jadwal Proyek Gantt Chart, Lini Masa Sejarah Produk (*Timeline*), User Journey Map, Papan Tugas Kanban, Grafik Percabangan Git (Branch & Merge).
5. **Analitik & Data:** Diagram Lingkaran (*Pie Chart*), Grafik Metrik Bar & Garis XY, Matriks Prioritas Kuadran 2x2, Alur Sumber Daya Sankey, Grafik Radar/Spider Atribut, Diagram Hierarki Treemap.
6. **Ideasi:** Peta Konsep Mindmap dan Kanvas Kosong Pemula.

### 🎭 Mesin Tema Visual & Kustomisasi Gaya
- **Mode Gelap & Terang:** Transisi halus antara tema *dark glassmorphism* modern dan mode terang berdaya kontras tinggi.
- **Tema Bawaan Mermaid:** Mendukung tema Default, Neutral, Forest, Dark, dan Base.
- **Preset Gaya Tampilan:** Hand-drawn / Sketsa Manual, Minimalis, Modern, Neumorfik, Cyberpunk, Retro, Pastel, dan Kontras Tinggi.
- **Mesin Tata Letak Canggih:** Dukungan algoritma Dagre klasik serta ELK (*Eclipse Layout Kernel*) untuk grafik berstruktur kompleks.
- **Penyesuaian Palet Warna Lengkap:** Atur warna Elemen Utama, Sekunder, Tersier, Teks, Garis, Garis Tepi, Subgraph, dan Catatan (*Notes*) dengan pratinjau instan.

### 📤 Ekspor Multi-Format & Berbagi Tanpa Server
- **Ekspor Vektor & Raster:** Simpan diagram sebagai Vektor SVG beresolusi tinggi, gambar Ultra-HD PNG (hingga skala 4x jernih), serta dokumen PDF.
- **Salin Cepat ke Papan Klip (Clipboard):** Salin kode Mermaid murni, blok sintaks Markdown (siap tempel di Notion, GitHub, Obsidian), kode SVG, atau gambar PNG langsung ke clipboard.
- **Berbagi Tautan Tanpa Database:** Bagikan diagram melalui URL terkompresi menggunakan *hash algorithm* (`pako` zlib deflate). Penerima dapat membuka diagram lengkap beserta tema tanpa memerlukan backend atau registrasi akun.
- **Pencadangan & Pemulihan:** Simpan file individual berekstensi `.krs` / `.mmd`, atau ekspor seluruh ruang kerja multi-dokumen sebagai `.karsa` / `.json`.

### 🌐 Dukungan Penuh 5 Bahasa (i18n)
Antarmuka dan deskripsi template diterjemahkan secara komprehensif tanpa perlu muat ulang halaman:
- 🇮🇩 **Bahasa Indonesia**
- 🇬🇧 **English**
- 🇨🇳 **中文 (Mandarin)**
- 🇯🇵 **日本語 (Japanese)**
- 🇷🇺 **Русский (Russian)**

---

## ⌨️ Daftar Lengkap Pintasan Keyboard (Shortcuts)

Tombol kombinasi akan menyesuaikan secara otomatis dengan sistem operasi Anda (**⌘ Cmd** di macOS, **Ctrl** di Windows & Linux):

| Kategori | Tindakan | Pintasan Mac | Pintasan Windows / Linux |
| :--- | :--- | :--- | :--- |
| **Kanvas** | **Geser / Pan Kanvas** | `Space + Drag` | `Space + Drag` |
| **Kanvas** | **Perbesar / Perkecil (Zoom)** | `Cmd + =` / `Cmd + -` | `Ctrl + =` / `Ctrl + -` |
| **Kanvas** | **Pas ke Tampilan Layar** | `Cmd + 0` *(atau Dobel Klik)* | `Ctrl + 0` *(atau Dobel Klik)* |
| **Kanvas** | **Ukuran Asli (1:1)** | Tombol `1:1` di layar | Tombol `1:1` di layar |
| **Editor** | **Simpan Snapshot & Render** | `Cmd + S` | `Ctrl + S` |
| **Editor** | **Paksa Render Ulang** | `Cmd + Enter` | `Ctrl + Enter` |
| **Editor** | **Cari & Ganti (Find/Replace)**| `Cmd + F` | `Ctrl + F` |
| **Editor** | **Beralih Komentar (Toggle)** | `Cmd + /` | `Ctrl + /` |
| **Editor** | **Undo / Redo** | `Cmd + Z` / `Cmd + Shift + Z` | `Ctrl + Z` / `Ctrl + Y` |
| **Editor** | **Indentasi / Outdent** | `Tab` / `Shift + Tab` | `Tab` / `Shift + Tab` |
| **Editor** | **Kursor Ganda (Multi-Cursor)**| `Alt + Klik` | `Alt + Klik` |
| **Editor** | **Lipat / Buka Blok Kode** | `Cmd + Alt + [` | `Ctrl + Alt + [` |
| **Editor** | **Saran Otomatis (Autocomplete)**| `Ctrl + Space` | `Ctrl + Space` |
| **Aplikasi** | **Dokumen Baru** | `Alt + N` | `Alt + N` |
| **Aplikasi** | **Buka / Tutup Sidebar** | `Cmd + B` | `Ctrl + B` |
| **Aplikasi** | **Ekspor Cepat SVG** | `Cmd + Shift + E` | `Ctrl + Shift + E` |
| **Aplikasi** | **Panduan Pintasan Lengkap** | `?` | `?` |

---

## 🛠️ Instalasi & Pengembangan Lokal

Karena Karsa Studio tidak membutuhkan server backend maupun database, Anda dapat menjalankannya di lingkungan lokal dalam hitungan detik.

### Persyaratan
- [Node.js](https://nodejs.org/) (disarankan versi 18 ke atas)
- Manajer paket `npm`, `pnpm`, atau `yarn`

### 1. Menggunakan Skrip Otomatis

**macOS / Linux:**
```bash
# Berikan izin eksekusi skrip (hanya satu kali di awal)
chmod +x start.sh

# Jalankan skrip pembantu
./start.sh
```

**Windows:**
Klik dua kali file `start.bat` di File Explorer, atau jalankan melalui Command Prompt / PowerShell:
```cmd
start.bat
```

### 2. Instalasi Manual
```bash
# Klon repositori
git clone https://github.com/rivaldigunawanyusuf/karsa-studio.git
cd karsa-studio

# Pasang dependensi
npm install

# Jalankan server pengembangan Vite
npm run dev
```

Buka peramban Anda di alamat `http://localhost:5173/`.

---

## 📂 Arsitektur & Struktur Direktori Proyek

```
mermaid-studio/
├── index.html              # Antarmuka utama Single Page Application (SPA)
├── docs.html               # Panduan interaktif sintaks & dokumentasi Mermaid
├── nginx-security.conf     # Konfigurasi reverse proxy Nginx & header keamanan produksi
├── package.json            # Daftar dependensi & script build npm
├── vite.config.js          # Konfigurasi pipeline Vite & PWA Workbox cache
├── start.sh                # Skrip otomatis dev runner macOS / Linux
├── start.bat               # Skrip otomatis dev runner Windows
├── public/                 # Asset statis, logo SVG, dan manifest PWA
└── src/
    ├── main.js             # Pengendali aplikasi utama & pengkabelan event
    ├── styles/
    │   └── index.css       # Token desain sistem, Glassmorphism UI & responsivitas
    └── lib/
        ├── editor.js       # Pengaturan CodeMirror 6, linting, & ekstensi sintaks
        ├── exporter.js     # Mesin konversi ekspor SVG, PNG resolusi tinggi, & PDF
        ├── i18n.js         # Kamus translasi lengkap 5 bahasa & mesin lokalisasi
        ├── mermaid-lang.js # Gramatika lezer untuk dukungan sintaks Mermaid
        ├── renderer.js     # Pengontrol render Mermaid.js & tata letak ELK
        ├── share.js        # Logika enkoding URL terkompresi & berbagi diagram
        ├── store.js        # Manajemen state berbasis LocalStorage & EventTarget reaktif
        ├── templates.js    # Koleksi 24 template diagram standar industri
        ├── themes.js       # Palet warna visual, preset gaya, & opsi layout
        └── ui.js           # Notifikasi toast, modal, & pembantu antarmuka
```

---

## 🚀 Panduan Deployment ke Server Produksi

Karsa Studio dikompilasi sebagai **Aplikasi Web Statis (Static SPA)** yang sangat ringan dan teroptimasi:

```bash
# Kompilasi bundle produksi
npm run build
```

Perintah di atas akan menghasilkan berkas statis siap pakai di direktori `dist/`. Anda dapat langsung mengunggah folder `dist/` ke layanan hosting statis apa pun:
- **Cloudflare Pages**
- **Vercel**
- **Netlify**
- **GitHub Pages**
- **Server Nginx / Apache / Caddy Mandiri** (Gunakan template `nginx-security.conf` untuk menerapkan header keamanan esensial seperti CSP, HSTS, dan X-Content-Type-Options).

---

## 📄 Lisensi & Ketentuan Penggunaan

Proyek ini dilindungi di bawah lisensi **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)**.

- **Anda Diizinkan Untuk:** Mengunduh, membagikan, memodifikasi, dan menggunakan kode sumber ini untuk keperluan pribadi, alat bantu internal nirlaba, riset akademis, serta kontribusi komunitas open-source.
- **Dengan Ketentuan:** Anda wajib menyertakan atribusi / kredit pencipta asli. **DILARANG KERAS menggunakan materi ini untuk tujuan komersial, memperjualbelikannya, menyewakannya, atau memonetisasinya dalam bentuk apa pun.** Hak komersial sepenuhnya dipegang eksklusif oleh pencipta asli.

---

## 👤 Pembuat & Ucapan Terima Kasih

Dirancang dan dikembangkan dengan dedikasi oleh **Rivaldi Gunawan Yusuf**. Dibangun di atas karya luar biasa dari ekosistem [Mermaid.js](https://mermaid.js.org/) dan [CodeMirror](https://codemirror.net/).

Jika Anda memiliki masukan, saran fitur baru, atau pertanyaan, silakan buat issue atau hubungi melalui profil GitHub!
