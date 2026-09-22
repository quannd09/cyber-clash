# Cyber Clash WebSocket Relay Server (Online 1)

Server WebSocket Relay siêu tốc độ, hỗ trợ kết nối 1v1 cho **Cyber Clash: Zero-G Arena** qua cơ chế phòng chơi (Room Code).

---

## 🚀 Hướng Dẫn Deploy Lên Render.com (Miễn Phí 100%)

Render cung cấp Web Service Node.js miễn phí, hỗ trợ WebSocket Native (`wss://`):

### Bước 1: Đẩy mã nguồn lên GitHub
1. Tạo một repository mới trên GitHub (hoặc dùng repo hiện tại của bạn).
2. Đẩy thư mục `server/` lên GitHub (gồm `server.js` và `package.json`).

### Bước 2: Tạo Web Service trên Render
1. Đăng nhập [https://dashboard.render.com/](https://dashboard.render.com/).
2. Nhấn nút **New +** ở góc phải -> Chọn **Web Service**.
3. Chọn repository GitHub vừa tạo và nhấn **Connect**.
4. Cấu hình thông số như sau:
   - **Name**: `cyber-clash-server` (hoặc tên tùy thích)
   - **Region**: Singapore (`Southeast Asia`) hoặc Frankfurt / Oregon (chọn gần bạn nhất để ping thấp nhất)
   - **Branch**: `main`
   - **Root Directory**: `server` (nếu đặt trong subfolder `server`)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`
5. Nhấn **Deploy Web Service**.

### Bước 3: Lấy URL WebSocket
- Sau 1 - 2 phút, Render sẽ cấp cho bạn một domain dạng:
  `https://cyber-clash-server.onrender.com`
- Đường dẫn WebSocket Relay tương ứng sẽ là:
  `wss://cyber-clash-server.onrender.com`
- Trong game Cyber Clash, tại sảnh **ONLINE 1**, bạn chỉ cần dán URL này vào ô **SERVER URL** (hoặc đặt mặc định trong `network.js`) là mọi người chơi trên thế giới (kể cả dùng 4G/5G) đều có thể kết nối ngay lập tức!

---

## 💻 Chạy Thử Trên Máy Tính Cục Bộ (Localhost)

Nếu muốn test trên máy cá nhân:
```bash
cd server
npm install
npm start
```
Server sẽ chạy tại `ws://localhost:3000`.

Hoặc nếu dùng Python (không cần cài Node.js):
```bash
python server/relay_server.py
```
Server Python sẽ chạy tại `ws://localhost:3000`.
