@echo off
chcp 65001 >nul
title Instalador — Estudio Jurídico

echo.
echo  ============================================
echo   ESTUDIO JURIDICO — Instalacion completa
echo  ============================================
echo.

:: ── Verificar Node.js ────────────────────────────────────
where node >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Node.js no esta instalado.
    echo  Descargalo desde https://nodejs.org  ^(version 18 o mayor^)
    echo  y volvé a ejecutar este instalador.
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('node -v') do set NODE_VER=%%v
echo  [OK] Node.js %NODE_VER% detectado

:: ── Instalar dependencias backend ────────────────────────
echo.
echo  [1/4] Instalando dependencias del backend...
cd /d "%~dp0backend"
call npm install --silent
if errorlevel 1 ( echo  [ERROR] Fallo npm install en backend & pause & exit /b 1 )
echo  [OK] Backend listo

:: ── Instalar dependencias frontend ───────────────────────
echo.
echo  [2/4] Instalando dependencias del frontend...
cd /d "%~dp0frontend"
call npm install --silent
if errorlevel 1 ( echo  [ERROR] Fallo npm install en frontend & pause & exit /b 1 )
echo  [OK] Frontend listo

:: ── Crear base de datos ───────────────────────────────────
echo.
echo  [3/4] Creando base de datos en SQL Server...
cd /d "%~dp0"

where sqlcmd >nul 2>&1
if errorlevel 1 (
    echo  [AVISO] sqlcmd no encontrado en el PATH.
    echo  Ejecuta manualmente los scripts SQL en SSMS en este orden:
    echo    1. sql\01_schema.sql
    echo    2. sql\02_seed.sql
    echo    3. sql\06_usuarios.sql
) else (
    sqlcmd -S localhost\SQLEXPRESS -U sa -P Admin2024! -i sql\01_schema.sql -b >nul 2>&1
    sqlcmd -S localhost\SQLEXPRESS -U sa -P Admin2024! -i sql\02_seed.sql   -b >nul 2>&1
    sqlcmd -S localhost\SQLEXPRESS -U sa -P Admin2024! -i sql\06_usuarios.sql -b >nul 2>&1
    echo  [OK] Base de datos configurada
)

:: ── Resultado ────────────────────────────────────────────
echo.
echo  [4/4] Instalacion completada.
echo.
echo  Para iniciar la app ejecuta: INICIAR.bat
echo.
pause
