@echo off
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js wurde nicht gefunden.
  pause
  exit /b 1
)

:: Alten Server auf Port 4173 per PowerShell beenden
powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 4173 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"

timeout /t 2 /nobreak >nul

echo Collection Editor wird gestartet...
start "" "http://127.0.0.1:4173/collection-editor.html"
node preview-server.js
pause
