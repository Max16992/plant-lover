@echo off
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js wurde nicht gefunden.
  echo Bitte Node.js installieren oder Codex bitten, die Vorschau zu starten.
  pause
  exit /b 1
)

start "" "http://127.0.0.1:4173/shop-editor.html"
node preview-server.js
pause
