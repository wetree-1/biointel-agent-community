#!/usr/bin/env python3
"""构建发布目录：yaml → JSON，同步 web/ → dist/，打 zip。"""

import shutil
import subprocess
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DEMO = ROOT / "社区demo"
DIST = ROOT / "dist"
RELEASE = ROOT / "release"
ZIP_PATH = RELEASE / "github-dist-upload.zip"


def sync_web_to_dist(web: Path, dist: Path) -> None:
    """原地同步，不删除 dist 根目录（避免 http.server 占用时 WinError 32）。"""
    dist.mkdir(parents=True, exist_ok=True)
    expected: set[Path] = set()

    for src in web.rglob("*"):
        if not src.is_file():
            continue
        rel = src.relative_to(web)
        expected.add(rel)
        dest = dist / rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dest)

    for dest in list(dist.rglob("*")):
        if not dest.is_file():
            continue
        rel = dest.relative_to(dist)
        if rel not in expected:
            dest.unlink()


def main() -> int:
    export = DEMO / "scripts" / "export_json.py"
    print(">> export_json.py")
    r = subprocess.run([sys.executable, str(export)], cwd=ROOT)
    if r.returncode != 0:
        return r.returncode

    web = DEMO / "web"
    print(">> sync web/ -> dist/")
    sync_web_to_dist(web, DIST)

    RELEASE.mkdir(parents=True, exist_ok=True)
    if ZIP_PATH.exists():
        ZIP_PATH.unlink()
    with zipfile.ZipFile(ZIP_PATH, "w", zipfile.ZIP_DEFLATED) as zf:
        for f in DIST.rglob("*"):
            if f.is_file():
                zf.write(f, f.relative_to(DIST))

    print()
    print("OK: dist/ synced (static site ready)")
    print(f"OK: {ZIP_PATH}")
    print()
    print("Next: git add . && git commit && git push")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
