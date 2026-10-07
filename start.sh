#!/bin/bash

# ==============================================================================
# Karsa - Startup Script
# ==============================================================================

# Dapatkan direktori di mana script ini berada
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR" || exit 1

echo "========================================"
echo "[INFO] Memulai Karsa..."
echo "========================================"

# Step 1: Cek apakah Node.js terinstal
echo "[INFO] Mengecek instalasi Node.js (npm)..."
if ! command -v npm &> /dev/null; then
    echo "[ERROR] npm tidak ditemukan!"
    echo "Harap install Node.js terlebih dahulu (https://nodejs.org)"
    exit 1
fi
echo "[OK] Node.js (npm) tersedia."

# Step 2: Cek dan Install Dependensi
echo "[INFO] Mengecek dependensi proyek..."
if [ ! -d "node_modules" ]; then
    echo "[INFO] Folder node_modules tidak ditemukan. Menginstal dependensi sekarang..."
    npm install
    if [ $? -ne 0 ]; then
        echo "[ERROR] Gagal menginstal dependensi. Silakan periksa log npm."
        exit 1
    fi
    echo "[OK] Dependensi berhasil diinstal."
else
    echo "[OK] Dependensi sudah terinstal."
fi

# Step 3: Mencari port yang tersedia
echo "[INFO] Mencari port yang tersedia untuk server lokal..."
PORT=5173
MAX_PORT=5183
while [ $PORT -le $MAX_PORT ]; do
    # Menggunakan lsof atau nc untuk mengecek port. macOS biasanya memiliki lsof terinstal secara default.
    if ! lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        break
    fi
    echo "[WARN] Port $PORT sedang digunakan. Mencoba port berikutnya..."
    PORT=$((PORT + 1))
done

if [ $PORT -gt $MAX_PORT ]; then
    echo "[ERROR] Tidak dapat menemukan port yang kosong dalam rentang 5173-$MAX_PORT."
    exit 1
fi

echo "[OK] Menggunakan port $PORT."

# Step 4: Menjalankan Server
echo "========================================"
echo "[INFO] Menjalankan server lokal pada http://localhost:$PORT"
echo "[INFO] Tekan Ctrl+C untuk menghentikan server."
echo "========================================"

# Jalankan vite dev server dengan port yang tersedia
npm run dev -- --port $PORT --strictPort
