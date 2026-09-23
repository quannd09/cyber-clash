# Cyber Clash WebSocket Relay Server (Online 1)

High-speed WebSocket Relay Server supporting 1v1 matchmaking for **Cyber Clash: Zero-G Arena** using Room Codes.

---

## 🚀 Free Deployment Guide on Render.com

Render provides free Node.js Web Services supporting native WebSocket (`wss://`):

### Step 1: Push source code to GitHub
1. Create a repository on GitHub (or use your existing repo).
2. Push the `server/` directory to GitHub (including `server.js` and `package.json`).

### Step 2: Create Web Service on Render
1. Log in to [https://dashboard.render.com/](https://dashboard.render.com/).
2. Click **New +** -> Select **Web Service**.
3. Select your repository and click **Connect**.
4. Configure settings:
   - **Name**: `cyber-clash-server` (or any custom name)
   - **Region**: Singapore (`Southeast Asia`) or nearest region to you
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`
5. Click **Deploy Web Service**.

### Step 3: Get WebSocket URL
- Render assigns a domain such as:
  `https://cyber-clash-server.onrender.com`
- The corresponding WebSocket Relay URL is:
  `wss://cyber-clash-server.onrender.com`
- In Cyber Clash lobby under **ONLINE 1**, paste this URL into the **RELAY SERVER** input box (or set it in `network.js`) to allow players anywhere in the world to connect.

---

## 💻 Running Locally (Localhost)

To run the Node.js relay server locally:
```bash
cd server
npm install
npm start
```
Server runs at `ws://localhost:3000`.

Or with Python (no Node.js required):
```bash
python server/relay_server.py
```
Python server runs at `ws://localhost:3000`.
