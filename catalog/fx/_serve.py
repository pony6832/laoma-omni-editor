"""驗證用本機伺服器（不快取）：python -X utf8 _serve.py [連接埠，預設 8765]，網站根目錄是 catalog/。
測試頁用的是瀏覽器快取時會讀到舊的效果檔，所以一律用這個。"""
import http.server, os, sys
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))


class H(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


http.server.ThreadingHTTPServer(("127.0.0.1", int(sys.argv[1]) if len(sys.argv) > 1 else 8765), H).serve_forever()
