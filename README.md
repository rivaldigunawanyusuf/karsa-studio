# Karsa Studio

**Karsa Studio** is a full-featured, professional *Text-to-Diagram* editor released as **Open Source (Non-Commercial)**. This application is incredibly lightweight, blazingly fast, and processes all data entirely within the user's browser (100% Client-Side). The primary goal of this project is to assist developers, system architects, project managers, and anyone who needs to rapidly visualize ideas, architectures, and workflows by simply typing code, eliminating the need for manual drawing.

This application can be accessed directly at: **[karsa-studio.rivaldigunawanyusuf.com](https://karsa-studio.rivaldigunawanyusuf.com)**

## Key Features

- **100% Client-Side & Offline-First:** All diagram rendering is executed directly in your browser. Supported as a PWA (Progressive Web App), it can be used fully offline after the first load. Zero server load and zero data sent to external servers.
- **Exclusive Extension System:** Supports standard `.mermaid`, `.md`, and `.txt` files. It also introduces proprietary file extensions: `.krs` for saving single documents, and `.karsa` for saving multi-document projects.
- **Multi-language (i18n):** Natively supports 5 languages: English, Indonesian, Mandarin (中文), Japanese (日本語), and Russian (Русский), which can be switched in real-time.
- **Local Document Management:** You can create multiple diagram documents at once. Easily select multiple documents for Bulk Duplication or Bulk Deletion. All data is automatically saved to the `localStorage` in your browser.
- **Rich Templates:** Dozens of refined, industry-standard templates (Architecture, Flowcharts, ERDs, Gantt Charts, Mindmaps, etc.).
- **Dynamic Themes & Customization:** Supports Dark/Light Modes, font settings, layout engine adjustments, and custom styling features.
- **High-Quality Export:** Export diagrams with a single click to various formats such as SVG (Vector), High-Resolution PNG (up to 4x HD), PDF, or instantly copy the code.
- **Responsive and Cross-Device:** The interface is designed to be flexible and supports various screen sizes. Runs smoothly on both desktop and mobile devices.

---

## Local Installation & Running (Mac / Linux / Windows)

Since this application requires no backend, you can run it using a standard development server or deploy it to any static hosting service.

### Requirements
- [Node.js](https://nodejs.org/) (version 16 or higher)

### 1. Quick Start (Automated Script)
We have provided helper scripts in the root directory that automatically check for Node.js, install dependencies, find available ports, and start the local server.

**For Mac OS / Linux users:**
```bash
# Make the script executable (only required once)
chmod +x start.sh

# Run the script
./start.sh
```

**For Windows users:**
Simply double-click the `start.bat` file in your File Explorer, or run it via Command Prompt / PowerShell:
```cmd
start.bat
```

### 2. Manual Start (Step-by-Step)
If you prefer to run things manually or the automated scripts fail, follow these steps in your terminal (compatible with Mac, Linux, and Windows):

```bash
# 1. Enter the project folder
cd mermaid-studio

# 2. Install dependencies (only required the first time)
npm install

# 3. Run the development server
npm run dev

# 4. Open your browser and navigate to the URL provided in the terminal (usually http://localhost:5173)
```

---

## Keyboard Shortcuts

Karsa Studio supports standard keyboard shortcuts to speed up your workflow. The modifier key adapts automatically based on your Operating System:
- **Mac OS:** Use the `Cmd (⌘)` key.
- **Windows / Linux:** Use the `Ctrl` key.

| Action | Shortcut (Mac) | Shortcut (Windows/Linux) |
| :--- | :--- | :--- |
| **Save / Render Diagram** | `Cmd + S` | `Ctrl + S` |
| **Undo Code Edit** | `Cmd + Z` | `Ctrl + Z` |
| **Redo Code Edit** | `Cmd + Shift + Z` | `Ctrl + Y` or `Ctrl + Shift + Z` |
| **Find in Editor** | `Cmd + F` | `Ctrl + F` |
| **Replace in Editor** | `Cmd + Option + F` | `Ctrl + H` |

The application will run at `http://localhost:5173/`.

---

## Production Deployment (Very Easy)

Karsa is specifically designed as a **Static Site Application (SPA)**. You can host it for free without needing to rent expensive database servers or VPS.

1. Run the build process:
   ```bash
   npm run build
   ```
2. This will generate a `dist/` folder containing the static files (HTML, CSS, and compressed JS).
3. You can directly upload this `dist/` folder to your preferred static hosting service (e.g., Vercel, Netlify, GitHub Pages).
4. Don't forget to point your domain (karsa-studio.rivaldigunawanyusuf.com) to the hosting service.

When users visit your site, their browser will shoulder the workload (diagram rendering), ensuring your site is highly resilient against massive traffic spikes without overloading the server!

---

## Tech Stack

- **Frontend Build Tool:** Vite - Incredibly fast for development.
- **Diagram Engine:** JS-based Text-to-Diagram Engine (Client-side rendering).
- **Code Editor:** CodeMirror 6 - For a comfortable code typing experience (with syntax highlighting).
- **State Management:** Custom-built using `EventTarget` architecture (extremely lightweight) integrated with `localStorage`.
- **Image Export:** Utilizes HTML5 Canvas API and a PDF renderer module.
- **UI Design:** Vanilla CSS (Custom properties/Variables) and Glassmorphism UI for easy maintenance without heavy CSS frameworks.

---

## License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)**.

**This means:**
You are permitted to download, study, modify, and use Karsa for personal projects, internal non-profit tooling, open source contributions, or portfolios.
**HOWEVER, YOU ARE STRICTLY PROHIBITED** from using this application, or its source code, for commercial purposes, reselling it, or monetizing it (turning it into a paid product) in any form whatsoever. All commercial rights are solely retained by the original creator.

**Happy Creating!** Feel free to explore and build upon the design of Karsa.

---

## About This Project

Karsa Studio is a diagram editor (frontend interface) developed on top of the Mermaid.js ecosystem. This application utilizes Mermaid's rendering engine and script syntax to visualize diagrams dynamically.

This project was initially created for personal internal needs to simplify diagram creation with a customized interface.

Currently, the project is Open Source and open for anyone to use. You can access and use this application for free at `karsa-studio.rivaldigunawanyusuf.com`.
