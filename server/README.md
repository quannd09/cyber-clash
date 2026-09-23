# Cyber Clash WebSocket Relay Server (Online 1)

High-speed WebSocket Relay Server supporting 1v1 and 2v2 multiplayer matches for **Cyber Clash: Zero-G Arena** via room code matchmaking.

---

## 🚀 Deployment Guide on Render.com (100% Free)

Render provides free Node.js Web Services with native WebSocket support (`wss://`):

### Step 1: Push Source Code to GitHub
1. Create a repository on GitHub (or use your existing repository).
2. Push the `server/` directory to GitHub (including `server.js` and `package.json`).

### Step 2: Create Web Service on Render
1. Log in to [https://dashboard.render.com/](https://dashboard.render.com/).
2. Click **New +** in the top right -> Select **Web Service**.
3. Select your GitHub repository and click **Connect**.
4. Configure the settings:
   - **Name**: `cyber-clash-server` (or your preferred name)
   - **Region**: Singapore (`Southeast Asia`), Frankfurt, or Oregon (select the closest region for lowest ping)
   - **Branch**: `main`
   - **Root Directory**: `server` (if located inside the `server` subfolder)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`
5. Click **Deploy Web Service**.

### Step 3: Get Your WebSocket URL
- Within 1 - 2 minutes, Render will assign your service a domain:
  `https://cyber-clash-server.onrender.com`
- The corresponding secure WebSocket Relay URL is:
  `wss://cyber-clash-server.onrender.com`
- In Cyber Clash, inside the **ONLINE 1** lobby, simply paste this URL into the **SERVER URL** input field (or set as default in `network.js`), and players worldwide (including 4G/5G mobile) can connect and battle!

---

## 💻 Local Testing (Localhost)

To run locally on your machine:
```bash
cd server
npm install
npm start
```
The server will listen at `ws://localhost:3000`.

Or with Python (no Node.js required):
```bash
python server/relay_server.py
```
The Python server will listen at `ws://localhost:3000`.
