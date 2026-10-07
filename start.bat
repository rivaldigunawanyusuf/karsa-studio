@echo off
setlocal enabledelayedexpansion

:: Karsa Studio - Windows Start Script

echo =========================================
echo       Starting Karsa Studio (Windows)
echo =========================================
echo.

:: 1. Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js not found!
    echo Please install Node.js from https://nodejs.org/ first.
    pause
    exit /b 1
)

:: 2. Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm not found!
    pause
    exit /b 1
)

:: 3. Check node_modules and install if necessary
if not exist "node_modules\" (
    echo [INFO] Setting up dependencies for the first time...
    echo [INFO] Running: npm install
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install dependencies.
        pause
        exit /b 1
    )
    echo [INFO] Dependencies installed successfully.
    echo.
)

:: 4. Start the development server
echo [INFO] Starting local server...
echo [INFO] Server is running. Press CTRL+C to stop.
echo.
call npm run dev
