# CYBER CLASH: ZERO-G & 2V2 ARENA ⚡
> **Fast-Paced 2D Cyberpunk Fighter in Zero-Gravity and 2v2 Gravity Platformer**  
> *Supports Local 2-Player, 2v2 Bot Practice, and 4-Player Online Rooms (WebSocket Relay & WebRTC P2P).*

---

## 🌟 Key Features

- **Zero-G & Gravity Platformer Physics:**
  - **Zero-G Mode (1v1):** Omni-directional thrusters, inertia drifting, and **Wall Bounce Boost** for high-speed counterattacks.
  - **Gravity Platformer Mode (2v2):** Realistic gravity, double jump, platform collision, and drop-through soft platforms (`Down`).
- **15 Unique Fighters:**
  - **Saitama (One Punch Man):** Massive 535 HP, Serious Consecutive Punches, Serious Punch Death Ultimate with screen shake & sonic boom.
  - **Megumi Fushiguro (Jujutsu Kaisen):** Ten Shadows Technique, Homing Divine Dog Totality (active tracking pursuit, stun & damage), and Mahoraga Cleave Ultimate.
  - **Kuriyama Mirai (Kyoukai no Kanata):** Blood manipulation, Blood Crescent projectile with lifesteal, and Blood Cataclysm Giant Sword Ultimate.
  - **Original & Anime Legends:** Tsukishiro Yanagi, Verina Airgid, Nicole Demara, Trigger, Vivian Banshee, Jotaro Kujo, Son Goku, Giorno Giovanna, Naoya Zen'in, Monkey D. Luffy, Satoru Gojo, Ryomen Sukuna.
- **2v2 Brawl Mode & Dedicated Maps:**
  - **Brawlhaven:** Sky island fortress with floating high-tier platforms.
  - **Great Hall:** Multi-tier citadel throne room with left/right balconies and high throne spire.
  - **Team Play:** Friendly fire is disabled between teammates (`Team Blue` vs `Team Red`).
  - **Ban & Pick Phase:** Choose characters for all 4 slots, toggle AI Bots, and set team bans.
- **Deep Combat Mechanics:**
  - **Perfect Parry:** Block right before impact to stun melee foes or reflect plasma shots back at x1.3 speed.
  - **Blade Clash:** Simultaneous melee strikes nullify damage and trigger a concussive shockwave.
  - **Anti-Spam Penalty:** Excessive inputs trigger a brief cooldown.
- **Game Modes:**
  - **Single-Player (VS Bot):** 4 difficulty levels: `Easy`, `Normal`, `Master`, `🔥 Impossible (God AI)`.
  - **Local 2-Player (1v1):** 2 players on a single keyboard or dual gamepads.
  - **2v2 Arena:** Local practice with bots or 4-player online matches.
  - **Online 1 (WebSocket Relay Server):** 100% English backend relay supporting up to 4 players per room (`server/server.js`).
  - **Online 2 (WebRTC P2P):** Direct peer-to-peer room connections.

---

## 🕹️ Controls

### Local Mode (1v1 & 2v2 Practice)

| Action | Player 1 (Team Blue) | Player 2 / Slot 2 | Gamepad |
| :--- | :--- | :--- | :--- |
| **Move / Thrust** | `W`, `A`, `S`, `D` | `↑`, `←`, `↓`, `→` | Left Analog / D-Pad |
| **Jump / Double Jump (2v2)** | `W` (or `Up`) | `↑` (or `Up`) | A / Cross |
| **Drop Platform (2v2)** | `S` (or `Down`) | `↓` (or `Down`) | Down + Jump |
| **Normal Attack** | `F` | `Num 1` or `J` | X / Square |
| **Shield / Parry** | `H` | `Num 3` or `L` | B / Circle |
| **Special Skill** | `R` | `Num 5` or `I` | Y / Triangle |
| **Dash / Boost** | `Left Shift` or `C` | `Num 0`, `U` or `R-Ctrl` | Left Bumper (LB / L1) |
| **Ultimate Overdrive** | `Space` (100% Overdrive) | `Enter` or `O` (100% Overdrive) | Right Trigger (RT / R1) |

---

## 🚀 Running Locally

### Option 1: Quick Launch (Windows)
Double-click `open_game.bat`. The game will launch automatically at `http://localhost:8000`.

### Option 2: Python HTTP Server
```bash
py -m http.server 8000
```
Open `http://localhost:8000` in your web browser.

### Option 3: WebSocket Relay Server (Online 1)
```bash
cd server
npm install
npm start
```
Default server port is `3000`. Connect clients via `ws://localhost:3000` or deployed URL on Render.

---

## 📁 Project Structure

```
cyber-clash/
├── assets/            # Character sprites, avatars, backgrounds, audio effects
│   ├── saitama/       # Saitama avatar & idle sprite
│   ├── megumi/        # Megumi avatar & idle sprite
│   ├── mirai/         # Kuriyama Mirai avatar & idle sprite
│   ├── brawlhaven.png # Brawlhaven arena background
│   └── great_hall.png # Great Hall arena background
├── js/
│   ├── assets.js      # Asset preloading (sprites, avatars, arena maps)
│   ├── audio.js       # Web Audio API sound synthesizer
│   ├── bot.js         # AI Bot Controller with gravity jump & platform drop-through
│   ├── combat.js      # Multi-player combat resolver, friendly fire filter, projectiles
│   ├── cyborg.js      # 15 fighters stats, passives, skills & ultimates
│   ├── input.js       # Anti-ghosting keyboard & Gamepad API handler
│   ├── main.js        # Main 60 FPS loop, 1v1 and 2v2 game state management
│   ├── maps.js        # 2v2 Map & Terrain Platform system (Brawlhaven & Great Hall)
│   ├── network.js     # Dual-engine multiplayer networking (WebSocket & WebRTC)
│   ├── particles.js   # VFX particle systems
│   ├── peerjs.min.js  # Bundled PeerJS library
│   ├── physics.js     # Zero-G inertia & Gravity Platformer physics
│   ├── renderer.js    # Canvas rendering, 1v1 and 2v2 HUD, ultimate VFX
│   └── ui.js          # Selection UI, 2v2 lobby panel, ban-pick phase
├── server/
│   ├── package.json   # Server dependencies (ws)
│   └── server.js      # 100% English WebSocket relay server for 1v1 & 2v2
├── index.html         # Main HTML document & UI modals
├── style.css          # Cyberpunk neon glassmorphism UI styles
└── README.md          # Game documentation
```
