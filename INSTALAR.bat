@echo off
title Instalar - Estudio Juridico
echo.
echo =============================================
echo  ESTUDIO JURIDICO - Instalacion
echo =============================================
echo.

where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js no instalado.
    echo Descargalo desde https://nodejs.org y volvé a ejecutar.
    pause
    exit /b 1
)
echo [OK] Node.js detectado

echo.
echo [1/2] Instalando backend...
cd /d "%~dp0backend"
call npm install
if errorlevel 1 ( echo [ERROR] Fallo en backend & pause & exit /b 1 )
echo [OK] Backend listo

echo.
echo [2/2] Instalando frontend...
cd /d "%~dp0frontend"
call npm install
if errorlevel 1 ( echo [ERROR] Fallo en frontend & pause & exit /b 1 )
echo [OK] Frontend listo

echo.
echo =============================================
echo  Instalacion completada.
echo  Ejecuta INICIAR.bat para arrancar la app.
echo =============================================
echo.
pause
