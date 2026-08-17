$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  Write-Host "Node.js/npm nao encontrado. Instale Node.js 20+ e tente novamente." -ForegroundColor Red
  exit 1
}

if (-not (Test-Path "node_modules")) {
  Write-Host "[ORION] Instalando dependencias..." -ForegroundColor Cyan
  npm install
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

Write-Host "[ORION] Abrindo em http://localhost:3000" -ForegroundColor Green
Start-Process "http://localhost:3000"
npm run dev
