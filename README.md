# CYBER CLASH: ZERO-G ARENA ⚡
> **Fast-Paced 2D Cyberpunk Fighter in Zero-Gravity**  
> *Supports Local 2-Player on a single machine & Online 1v1 via WebRTC P2P (Zero Backend).*

---

## 🌟 Key Features

- **Zero-G Physics & Momentum:** Omni-directional thrusters, inertia drifting, and **Wall Bounce Boost** for high-speed counterattacks.
- **Diverse Roster of Unique Fighters:** Multiple distinct anime & cyberpunk characters, featuring specialized combat archetypes (Melee & Ranged), unique skill kits, and devastating Ultimates.
- **Deep Combat Mechanics:**
  - **Perfect Parry:** Block right before impact to stun melee foes or reflect plasma shots back at x1.3 speed.
  - **Blade Clash:** Simultaneous melee strikes nullify damage and trigger a concussive shockwave.
  - **Anti-Spam Penalty:** Excessive inputs (over 6 attacks within 3 seconds) trigger a brief 1-second cooldown.
- **Game Modes:**
  - **Local:** 2 players on a single keyboard or dual gamepads.
  - **Online:** Direct WebRTC P2P connection via 4-character room codes (`CLASH-XXXX`). No external server required.
  - **Background Ticker:** Powered by a Web Worker to maintain smooth 60 FPS physics calculation across background tabs.

---

## 🕹️ Controls

### Local Mode (2 Players)

| Action | Player 1 (Cyan) | Player 2 (Magenta) | Gamepad |
| :--- | :--- | :--- | :--- |
| **Thrust / Move** | `W`, `A`, `S`, `D` | `↑`, `←`, `↓`, `→` | Left Analog / D-Pad |
| **Normal Attack** | `F` | `Num 1` or `J` | X / Square |
| **Shield / Parry** | `H` | `Num 3` or `L` | B / Circle |
| **Special Skill** | `R` | `Num 5` or `I` | A / Cross |
| **Strafe Lock** | `Left Shift` | `Num 0` or `U` | Left Trigger (LT / L1) |
| **Ultimate Ability** | `Space` | `Enter` or `O` | Right Trigger (RT / R1) |

### Online Mode (WebRTC)
- **Host (Player 1):** Click `CREATE ROOM` $\rightarrow$ Share room code $\rightarrow$ Controls: `WASD + F / H / R / Space`.
- **Client (Player 2):** Enter room code $\rightarrow$ Click `JOIN` $\rightarrow$ Controls: Can use either `WASD` or `Arrow Keys`.

---

## 🚀 Running Locally

### Option 1: Quick Launch (Windows)
Double-click `open_game.bat`. The game will launch automatically at `http://localhost:8000`.

### Option 2: Python HTTP Server
```bash
py -m http.server 8000
```
Open `http://localhost:8000` in your web browser.

---

## 📁 Project Structure

```
cyber-clash/
├── assets/            # Character sprites, avatars, and audio effects
├── js/
│   ├── assets.js      # Asset preloading
│   ├── audio.js       # Web Audio API sound synthesizer
│   ├── combat.js      # Damage calculation, projectiles & capsule hitboxes
│   ├── cyborg.js      # Fighter stats, abilities & anti-spam logic
│   ├── input.js       # Anti-ghosting keyboard & Gamepad API handler
│   ├── main.js        # Main 60 FPS loop & Web Worker ticker
│   ├── network.js     # WebRTC PeerJS P2P room networking
│   ├── particles.js   # VFX particle systems
│   ├── peerjs.min.js  # Bundled PeerJS library
│   ├── physics.js     # Zero-G momentum, drag & wall bouncing
│   ├── renderer.js    # Canvas rendering, neon arena grid & HUD
│   └── ui.js          # Selection UI, moves display & online lobby
├── index.html         # Main HTML document & font imports
├── style.css          # Cyberpunk neon glassmorphism UI styles
├── vercel.json        # Routing and cache configuration for static hosting
├── open_game.bat      # Windows one-click local launcher
└── README.md          # Game documentation
```
