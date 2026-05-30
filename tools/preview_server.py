#!/usr/bin/env python3
"""本地预览：build 后启动静态服务并自动打开浏览器。"""

import os
import socket
import subprocess
import sys
import threading
import time
import webbrowser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WEB = ROOT / "社区demo" / "web"
BUILD = ROOT / "tools" / "build_github_dist.py"


def port_free(port: int, host: str = "127.0.0.1") -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        try:
            s.bind((host, port))
            return True
        except OSError:
            return False


def pick_port(candidates: list[int]) -> int:
    for p in candidates:
        if port_free(p):
            return p
    raise RuntimeError(f"端口均被占用: {candidates}")


def run_build() -> None:
    print(">> build")
    r = subprocess.run([sys.executable, str(BUILD)], cwd=ROOT)
    if r.returncode != 0:
        raise SystemExit(r.returncode)


def main() -> None:
    run_build()
    os.chdir(WEB)
    port = pick_port([8765, 8080, 8888, 9090])
    url = f"http://127.0.0.1:{port}/"
    server = ThreadingHTTPServer(("127.0.0.1", port), SimpleHTTPRequestHandler)

    print()
    print(f"OK: 服务目录 {WEB}", flush=True)
    print(f"OK: 请在浏览器打开 {url}", flush=True)
    print("按 Ctrl+C 停止", flush=True)
    print(flush=True)

    threading.Timer(1.0, lambda: webbrowser.open(url)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n已停止")
        server.shutdown()


if __name__ == "__main__":
    main()
