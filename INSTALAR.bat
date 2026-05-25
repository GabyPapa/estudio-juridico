@echo off
title Instalador - Estudio Juridico
echo.
echo =============================================
echo  ESTUDIO JURIDICO - Instalacion completa
echo =============================================
echo.

where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js no esta instalado.
    echo Descargalo desde https://nodejs.org
    pause
    exit /b 1
)
echo [OK] Node.js detectado

echo.
echo [1/3] Instalando dependencias del backend...
cd /d "%~dp0backend"
call npm install
if errorlevel 1 ( echo [ERROR] Fallo en backend & pause & exit /b 1 )
echo [OK] Backend listo

echo.
echo [2/3] Instalando dependencias del frontend...
cd /d "%~dp0frontend"
call npm install
if errorlevel 1 ( echo [ERROR] Fallo en frontend & pause & exit /b 1 )
echo [OK] Frontend listo

echo.
echo [3/3] Instalacion completada.
echo.
echo Ahora ejecuta INICIAR.bat para arrancar la app.
echo.
pause
