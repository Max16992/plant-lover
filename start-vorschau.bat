@echo off
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js wurde nicht gefunden.
  echo Bitte Node.js installieren.
  pause
  exit /b 1
)

:: Alten Server auf Port 4173 beenden falls noch laueft
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :4173 ^| findstr LISTENING') do (
  taskkill /PID %%a /F >nul 2>nul
)

timeout /t 1 /nobreak >nul

start "" "http://127.0.0.1:4173/"
node preview-server.js
pause
