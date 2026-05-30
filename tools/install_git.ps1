# 下载并静默安装 Git for Windows（加入 PATH）
$ErrorActionPreference = "Stop"
$url = "https://github.com/git-for-windows/git/releases/download/v2.49.0.windows.1/Git-2.49.0-64-bit.exe"
$installer = Join-Path $env:TEMP "Git-2.49.0-64-bit.exe"

Write-Host "Download: $url"
curl.exe -L -o $installer $url
if (-not (Test-Path $installer)) { throw "Download failed" }
$mb = [math]::Round((Get-Item $installer).Length / 1MB, 1)
Write-Host "Downloaded: $mb MB"
if ($mb -lt 60) { throw "File too small, download incomplete" }

Write-Host "Installing (may pop UAC)..."
$p = Start-Process -FilePath $installer -ArgumentList @(
    "/VERYSILENT", "/NORESTART", "/SUPPRESSMSGBOXES",
    "/o", "PathOption=Cmd"
) -Wait -PassThru
if ($p.ExitCode -ne 0) { throw "Installer exit code $($p.ExitCode)" }

$git = "C:\Program Files\Git\cmd\git.exe"
if (-not (Test-Path $git)) { throw "Git not found after install" }
& $git --version
Write-Host ""
Write-Host "OK: Git installed. Close and reopen terminal, then run: git --version"
