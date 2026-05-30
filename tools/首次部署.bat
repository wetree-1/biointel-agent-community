@echo off
chcp 65001 >nul
cd /d "%~dp0.."

where git >nul 2>&1
if errorlevel 1 (
  echo [错误] 未找到 git。请先安装 Git for Windows 并勾选 Add to PATH。
  echo 下载: https://git-scm.com/download/win
  pause
  exit /b 1
)

powershell -ExecutionPolicy Bypass -File "tools\build_github_dist.ps1"
if errorlevel 1 python "tools\build_github_dist.py"
if errorlevel 1 exit /b 1

if not exist ".git" (
  git init
  git branch -M main
)

git add .
git status
echo.
set /p MSG=输入 commit 说明（直接回车用默认）: 
if "%MSG%"=="" set MSG=Update agent community demo

git commit -m "%MSG%"
if errorlevel 1 (
  echo 没有新改动或 commit 失败，请检查上方输出。
)

echo.
echo === 若尚未添加远程仓库，请执行（把地址换成你的）===
echo git remote add origin https://github.com/你的用户名/biointel-agent-community.git
echo git push -u origin main
echo.
echo GitHub 仓库 ^> Settings ^> Pages ^> Source 选 GitHub Actions
echo.
pause
