@echo off
chcp 65001 >nul
echo 正在安装 Git for Windows（需管理员权限，约 67MB 下载）...
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0install_git.ps1"
echo.
pause
