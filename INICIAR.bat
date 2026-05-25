@echo off
title Estudio Juridico
echo.
echo =============================================
echo  ESTUDIO JURIDICO - Iniciando...
echo =============================================
echo.

:: Verificar que node_modules existan
IF NOT EXIST "%~dp0backend\node_modules" (
    echo [ERROR] No se encontro node_modules en backend.
    echo Ejecuta primero INSTALAR.bat
    pause
    exit /b 1
)
IF NOT EXIST "%~dp0frontend\node_modules" (
    echo [ERROR] No se encontro node_modules en frontend.
    echo Ejecuta primero INSTALAR.bat
    pause
    exit /b 1
)

:: Crear carpeta de uploads si no existe
IF NOT EXIST "%~dp0backend\uploads\escritos" (
    mkdir "%~dp0backend\uploads\escritos" >nul 2>&1
)

echo Iniciando backend (puerto 3001)...
start "Backend - Estudio Juridico" cmd /k "cd /d "%~dp0backend" && node server.js"
timeout /t 4 /nobreak >nul

echo Iniciando frontend (puerto 5173)...
start "Frontend - Estudio Juridico" cmd /k "cd /d "%~dp0frontend" && npm run dev"
timeout /t 5 /nobreak >nul

start http://localhost:5173
echo.
echo =============================================
echo  App disponible en http://localhost:5173
echo.
echo  Email:      p.gabrielpapa@gmail.com
echo  Contrasena: 22715293
echo  Rol:        Administrador
echo =============================================
echo.
pause
