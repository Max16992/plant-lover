@echo off
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js wurde nicht gefunden.
  echo Bitte zuerst Node.js installieren.
  pause
  exit /b 1
)

echo Collection Editor wird gestartet...
start "" "http://127.0.0.1:4173/collection-editor.html"
node preview-server.js
pause
