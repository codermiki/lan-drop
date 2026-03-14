# LAN File Receiver

A responsive, local-network file receiving application. It runs a Node.js Express server on one PC to act as a receiver, and serves a modern React drag-and-drop interface so any device on the same LAN can easily send files to it.

All files are stored completely offline without any database.

## Prerequisites

- Node.js installed

## 1. Backend Setup

The backend handles receiving and storing files in the local filesystem.

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server (runs on port 3000):
   ```bash
   node server.js
   ```
   *The server will automatically create an `uploads/` folder and log when files are successfully saved.*

## 2. Frontend Setup

The frontend is a Vite-powered React application with a responsive drag and drop UI.

1. Open a **new, separate terminal tab** and navigate to the frontend directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend developer server on your local network:
   ```bash
   npm run dev
   ```

## LAN Usage (Connecting from other devices)

Because the project uses Vite configured with `host: true`, the React app will be accessible from anywhere on your immediate local network (LAN).

1. Find the URL listed in your terminal after starting the frontend (e.g., `http://192.168.1.15:5173`).
2. Type that EXACT URL into your smartphone, tablet, or another PC's browser.
3. Drag and drop (or tap and select) files on the web interface.
4. The files will be transferred over your local Wi-Fi and saved instantly to your Receiver PC's `server/uploads` folder!

## Features included
- **Zero Configuration LAN routing**: Just run the apps. The server automatically accepts CORS on all local IPs, and the React client automatically detects its host IP address for file uploads.
- **Sequential uploads**: Files are uploaded one by one to avoid network congestion.
- **Large file sizing**: The backend supports files up to 10GB using Multer's local disk buffer.
- **Beautiful modern UI**: Using Tailwind-inspired styling, frosted glass effects, lucide icons, and visual drag-and-drop transitions.
