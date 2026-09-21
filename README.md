# CYBER CLASH: ZERO-G ARENA ⚡
> **Game đối kháng 2D phong cách Cyberpunk trong môi trường Không trọng lực (Zero-G Fighter)**  
> *Hỗ trợ chơi 2 người chung máy (Local) & Đấu Online 2 máy qua mã phòng WebRTC P2P (Zero Backend).*

![Cyber Clash Banner](assets/goku/avatar.png)

---

## 🌟 Tính Năng Nổi Bật

- **Vật lý Không Trọng Lực (Zero-G Momentum):** Điều khiển phản lực 4 hướng, quán tính trôi dạt tự do, cơ chế **Bật tường gia tốc (Wall Bounce Boost)** để luồn lách phản công.
- **8 Đấu Sĩ Độc Nhất (Anime & Cyberpunk Roster):**
  1. **⚡ Tsukishiro Yanagi (500 HP):** Cận chiến sấm sét • Nguyệt Thương • Chớp Nhoáng • Pháo Lôi Quang.
  2. **🌸 Verina Airgid (500 HP):** Tầm xa hồi phục • Sao Chổi • Quang Dưỡng • Bão Sinh Mệnh.
  3. **💼 Nicole Demara (500 HP):** Tầm xa hỏa lực • Pháo Cặp Táp • Trượt Tiền Tài • Hố Đen Trọng Lực.
  4. **🎯 Trigger (500 HP):** Bắn tỉa tinh nhuệ • Phát Bắn Thanh Trừng • Thế Bắn Tỉa • Hỏa Lực Đồng Bộ.
  5. **🔮 Vivian Banshee (650 HP - Trâu bò & Nộ nhanh):** Tầm xa hắc thuật • Lông Vũ Dị Thường • Hộ Mệnh Nở Rộ • Bão Lông Vũ Điềm Báo Vĩnh Cửu.
  6. **👊 Jotaro Kujo (500 HP):** Cận chiến vũ bão • ORA ORA ORA! • Star Finger • The World (Ngưng đọng thời gian 2.5s).
  7. **🥋 Son Goku (500 HP):** Võ thuật siêu cấp • Long Quyền Ki • Dịch Chuyển Tức Thời • Siêu Kamehameha.
  8. **🐞 Giorno Giovanna (500 HP):** Stand Hoàng Kim • MUDA MUDA MUDA! • Cây Cối Sinh Mệnh • Return To Zero.
- **Cơ chế Chiến Đấu Chuyên Sâu:**
  - **✨ Perfect Parry:** Đỡ đòn cận chiến làm choáng đối thủ 0.9s; đỡ đạn phản pháo ngược lại với tốc độ x1.3.
  - **⚔️ Blade Clash:** Hai bên cùng ra đòn sẽ triệt tiêu lực và nổ sóng xung kích đẩy văng đối phương.
  - **🛡️ Guard Break:** Giữ khiên quá lâu cạn năng lượng sẽ bị vỡ thế phòng thủ.
  - **⚠️ Chống Spam Đòn Đánh:** Nhấn liên tiếp quá 6 đòn đánh trong vòng 3 giây sẽ bị phạt delay 1 giây.
- **Chế Độ Chơi Đa Dạng:**
  - **🎮 Đấu Chung Máy (Local):** 2 người chơi cùng bàn phím hoặc 2 tay cầm Gamepad.
  - **🌐 Đấu Online (WebRTC P2P):** Ghép phòng qua mã 4 chữ số (ví dụ: `CLASH-8821`), không cần máy chủ trung gian, truyền tín hiệu P2P độ trễ siêu thấp.
  - **⚡ Chống Đóng Băng Tab (Web Worker Ticker):** Máy chủ duy trì tính toán vật lý 60 FPS liên tục ngay cả khi chuyển tab hoặc ẩn cửa sổ.

---

## 🕹️ Bảng Điều Khiển (Controls)

### 1. Chế độ Chơi Chung Máy (Local 2-Player)

| Thao tác | Player 1 (Bên Trái) | Player 2 (Bên Phải) | Gamepad |
| :--- | :--- | :--- | :--- |
| **Bay phản lực** | `W`, `A`, `S`, `D` | `↑`, `←`, `↓`, `→` | Cần Analog / D-Pad |
| **Tấn công (Attack)** | `F` | `Num 1` hoặc `J` | Nút X / Vuông |
| **Bật khiên (Shield)** | `H` | `Num 3` hoặc `L` | Nút B / Tròn |
| **Kỹ năng (Skill)** | `R` | `Num 5` hoặc `I` | Nút A / X |
| **Khóa hướng (Strafe)** | `Shift Trái` | `Num 0` hoặc `U` | Cò trái (LT / L1) |
| **Chiêu cuối (Ultimate)**| `Space` | `Enter` hoặc `O` | Cò phải (RT / R1) |

### 2. Chế độ Đấu Online (WebRTC)
- **Chủ phòng (Host - Player 1):** Bấm `TẠO PHÒNG` $\rightarrow$ Copy mã phòng gửi cho bạn bè $\rightarrow$ Điều khiển bằng `WASD + F / H / R / Space`.
- **Khách (Client - Player 2):** Nhập mã phòng $\rightarrow$ Bấm `VÀO PHÒNG` $\rightarrow$ Trên máy của mình có thể dùng tùy thích:
  - Cụm `WASD` + `F` (đánh) + `H` (khiên) + `R` (skill) + `Space` (ulti).
  - Hoặc cụm `Phím mũi tên` + `J` + `L` + `I` + `Enter`.

---

## 🚀 Cài Đặt & Chạy Cục Bộ (Local Run)

### Cách 1: Mở nhanh bằng file thực thi
Nhấp đúp chuột vào file `open_game.bat`. Game sẽ tự động mở trên trình duyệt tại `http://localhost:8000`.

### Cách 2: Chạy bằng Python HTTP Server
```bash
py -m http.server 8000
```
Sau đó truy cập trình duyệt: `http://localhost:8000`.

---

## 🌐 Triển Khai Lên Vercel (Deploy to Vercel)

Dự án được cấu hình sẵn 100% tệp tĩnh (Static Web App), sẵn sàng để deploy lên Vercel chỉ trong 1 phút:

1. **Đẩy mã nguồn lên GitHub:**
   - Sử dụng GitHub Desktop hoặc Git CLI để tạo repository và push code lên GitHub.
2. **Kết nối Vercel:**
   - Đăng nhập vào [Vercel](https://vercel.com).
   - Chọn **"Add New..."** $\rightarrow$ **"Project"**.
   - Chọn repository GitHub vừa tạo.
   - Giữ nguyên cấu hình mặc định (Framework Preset: **Other**, Root Directory: `./`).
   - Bấm **Deploy**.
3. **Trải nghiệm:** Vercel sẽ cung cấp link truy cập dạng `https://your-project.vercel.app`. Bạn có thể gửi link này cho bất kỳ ai để cùng tạo phòng và solo trực tuyến!

---

## 📁 Cấu Trúc Dự Án

```
cyber-clash/
├── assets/            # Ảnh nhân vật, avatar, sprite idle/sheet, âm thanh
├── js/
│   ├── assets.js      # Nạp trước (Preload) hình ảnh & tài nguyên
│   ├── audio.js       # Hệ thống âm thanh Web Audio API & Synth FX
│   ├── combat.js      # Tính toán sát thương, đạn bay, hitbox con nhộng
│   ├── cyborg.js      # Khởi tạo chỉ số nhân vật, kỹ năng, anti-spam
│   ├── input.js       # Quản lý bàn phím anti-ghosting & Gamepad API
│   ├── main.js        # Vòng lặp chính 60 FPS, Web Worker ticker ngầm
│   ├── network.js     # WebRTC PeerJS quản lý kết nối P2P 1v1
│   ├── particles.js   # Hiệu ứng nổ, tia lửa điện, lốc lông vũ
│   ├── peerjs.min.js  # Thư viện PeerJS đóng gói cục bộ
│   ├── physics.js     # Vật lý Zero-G, ma sát không gian, nảy tường
│   ├── renderer.js    # Vẽ đấu trường Canvas, sàn lưới Neon, thanh HUD
│   └── ui.js          # Giao diện chọn tướng, bảng skill, sảnh Online
├── index.html         # Khung HTML chính & liên kết Google Fonts Orbitron
├── style.css          # Giao diện Cyberpunk Neon Glassmorphism
├── vercel.json        # Cấu hình tối ưu định tuyến và cache cho Vercel
├── open_game.bat      # Script khởi chạy nhanh trên Windows
└── README.md          # Tài liệu hướng dẫn trò chơi
```

---

## 📜 Giấy Phép & Bản Quyền
Dự án được xây dựng cho mục đích học tập, giải trí và nghiên cứu phát triển game Web HTML5 / WebRTC P2P.
