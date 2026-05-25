@echo off
title Estudio Juridico
echo.
echo =============================================
echo  ESTUDIO JURIDICO - Iniciando...
echo =============================================
echo.
echo Iniciando backend (puerto 3001)...
start "Backend - Estudio Juridico" cmd /k "cd /d "%~dp0backend" && node server.js"
timeout /t 4 /nobreak >nul
echo Iniciando frontend (puerto 5173)...
start "Frontend - Estudio Juridico" cmd /k "cd /d "%~dp0frontend" && npm run dev"
timeout /t 5 /nobreak >nul
start http://localhost:5173
echo.
echo =============================================
echo  App en http://localhost:5173
echo.
echo  Email:      p.gabrielpapa@gmail.com
echo  Contrasena: 22715293
echo  Rol:        Administrador
echo =============================================
echo.
pause
