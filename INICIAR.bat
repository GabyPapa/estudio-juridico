@echo off
chcp 65001 >nul
title Estudio Juridico — Iniciando...

echo.
echo  ============================================
echo   ESTUDIO JURIDICO — Iniciando app...
echo  ============================================
echo.

:: ── Backend ──────────────────────────────────────────────
echo  Iniciando backend  ^(puerto 3001^)...
start "Backend — Estudio Juridico" cmd /k "cd /d "%~dp0backend" && node server.js"

:: Esperar 3 segundos a que el backend arranque
timeout /t 3 /nobreak >nul

:: ── Frontend ─────────────────────────────────────────────
echo  Iniciando frontend ^(puerto 5173^)...
start "Frontend — Estudio Juridico" cmd /k "cd /d "%~dp0frontend" && npm run dev"

:: Esperar 4 segundos y abrir el navegador
timeout /t 4 /nobreak >nul

echo.
echo  Abriendo la app en el navegador...
start http://localhost:5173

echo.
echo  ============================================
echo   App corriendo en http://localhost:5173
echo.
echo   Tu acceso:
echo     Email:      p.gabrielpapa@gmail.com
echo     Contrasena: 22715293
echo     Rol:        Administrador
echo  ============================================
echo.
echo  Para cerrar la app, cerrá las dos ventanas
echo  negras que se abrieron (Backend y Frontend).
echo.
pause
