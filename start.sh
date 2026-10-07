#!/bin/bash

# ==============================================================================
# Karsa - Startup Script
# ==============================================================================

# Get the directory where this script is located
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR" || exit 1

echo "========================================"
echo "[INFO] Starting Karsa..."
echo "========================================"

# Step 1: Check if Node.js is installed
echo "[INFO] Checking Node.js (npm) installation..."
if ! command -v npm &> /dev/null; then
    echo "[ERROR] npm not found!"
    echo "Please install Node.js first (https://nodejs.org)"
    exit 1
fi
echo "[OK] Node.js (npm) is available."

# Step 2: Check and Install Dependencies
echo "[INFO] Checking project dependencies..."
if [ ! -d "node_modules" ]; then
    echo "[INFO] node_modules folder not found. Installing dependencies now..."
    npm install
    if [ $? -ne 0 ]; then
        echo "[ERROR] Failed to install dependencies. Please check npm logs."
        exit 1
    fi
    echo "[OK] Dependencies installed successfully."
else
    echo "[OK] Dependencies are already installed."
fi

# Step 3: Find an available port
echo "[INFO] Finding an available port for the local server..."
PORT=5173
MAX_PORT=5183
while [ $PORT -le $MAX_PORT ]; do
    # Using lsof to check the port. macOS usually has lsof installed by default.
    if ! lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        break
    fi
    echo "[WARN] Port $PORT is in use. Trying the next port..."
    PORT=$((PORT + 1))
done

if [ $PORT -gt $MAX_PORT ]; then
    echo "[ERROR] Could not find an available port in the range 5173-$MAX_PORT."
    exit 1
fi

echo "[OK] Using port $PORT."

# Step 4: Run the Server
echo "========================================"
echo "[INFO] Starting local server at http://localhost:$PORT"
echo "[INFO] Press Ctrl+C to stop the server."
echo "========================================"

# Run vite dev server with the available port
npm run dev -- --port $PORT --strictPort
