# 智能体社区 — 发布前构建（对标题库检索的 tools\build_github_dist.ps1）
# 实际逻辑在 build_github_dist.py（中文路径更稳）
$ErrorActionPreference = "Stop"
$buildPy = Join-Path $PSScriptRoot "build_github_dist.py"
Write-Host ">> build_github_dist.py"
& python $buildPy
exit $LASTEXITCODE
