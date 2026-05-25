@echo off
title Estudio Juridico
echo.
echo =============================================
echo  ESTUDIO JURIDICO - Iniciando...
echo =============================================
echo.

echo Iniciando backend (puerto 3001)...
start "Backend" cmd /k "cd /d "%~dp0backend" && node server.js"

timeout /t 3 /nobreak >nul

echo Iniciando frontend (puerto 5173)...
start "Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

timeout /t 4 /nobreak >nul

start http://localhost:5173

echo.
echo =============================================
echo  App corriendo en http://localhost:5173
echo.
echo  Email:      p.gabrielpapa@gmail.com
echo  Contrasena: 22715293
echo  Rol:        Administrador
echo =============================================
echo.
echo Para cerrar: cerra las ventanas de Backend y Frontend.
echo.
pause
