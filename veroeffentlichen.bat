@echo off
cd /d "%~dp0"

echo Aenderungen werden veroeffentlicht...
echo.

git add .
git commit -m "Pflanzengalerie aktualisiert"
git push

echo.
echo Fertig! Die Seite ist in ca. 1 Minute live auf plant-lover.netlify.app
echo.
pause
