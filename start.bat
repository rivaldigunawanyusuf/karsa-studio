@echo off
setlocal enabledelayedexpansion

:: Karsa Studio - Windows Start Script

echo =========================================
echo       Memulai Karsa Studio (Windows)
echo =========================================
echo.

:: 1. Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js tidak ditemukan!
    echo Silakan install Node.js dari https://nodejs.org/ terlebih dahulu.
    pause
    exit /b 1
)

:: 2. Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm tidak ditemukan!
    pause
    exit /b 1
)

:: 3. Check node_modules and install if necessary
if not exist "node_modules\" (
    echo [INFO] Menyiapkan dependensi untuk pertama kali...
    echo [INFO] Menjalankan: npm install
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Gagal menginstal dependensi.
        pause
        exit /b 1
    )
    echo [INFO] Dependensi berhasil diinstal.
    echo.
)

:: 4. Start the development server
echo [INFO] Menjalankan local server...
echo [INFO] Server berjalan. Tekan CTRL+C untuk berhenti.
echo.
call npm run dev
