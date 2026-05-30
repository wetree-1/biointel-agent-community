@echo off
chcp 65001 >nul
cd /d "%~dp0"

python --version >nul 2>&1
if errorlevel 1 (
  echo [错误] 未找到 python。请先安装 Python 并加入 PATH。
  pause
  exit /b 1
)

python "tools\preview_server.py"
pause
