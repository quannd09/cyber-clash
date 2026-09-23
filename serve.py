import http.server
import socketserver
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000

class NoCacheHTTPHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

if __name__ == '__main__':
    with socketserver.TCPServer(("", PORT), NoCacheHTTPHandler) as httpd:
        print(f"Cyber Clash server running at http://localhost:{PORT}")
        print("Live cache disabling active. Browser will never serve stale files.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass
