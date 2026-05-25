@echo off
title Instalador - Estudio Juridico

echo.
echo =============================================
echo  ESTUDIO JURIDICO - Instalacion completa
echo =============================================
echo.

:: Habilitar TCP/IP en SQL Server via PowerShell
echo [1/4] Habilitando TCP/IP en SQL Server...
powershell -NoProfile -Command ^
  "$wmi = [System.Reflection.Assembly]::LoadWithPartialName('Microsoft.SqlServer.SqlWmiManagement');" ^
  "$smo = New-Object Microsoft.SqlServer.Management.Smo.Wmi.ManagedComputer;" ^
  "$tcp = $smo.ServerInstances['SQLEXPRESS'].ServerProtocols['Tcp'];" ^
  "$tcp.IsEnabled = $true; $tcp.Alter();" ^
  "Write-Host 'TCP/IP habilitado'" 2>nul

:: Reiniciar SQL Server para aplicar cambios
echo [2/4] Reiniciando SQL Server...
net stop "SQL Server (SQLEXPRESS)" >nul 2>&1
net start "SQL Server (SQLEXPRESS)" >nul 2>&1
timeout /t 3 /nobreak >nul
echo [OK] SQL Server listo

:: Instalar dependencias backend
echo.
echo [3/4] Instalando dependencias del backend...
cd /d "%~dp0backend"
call npm install
if errorlevel 1 ( echo [ERROR] Fallo en backend & pause & exit /b 1 )
echo [OK] Backend listo

:: Instalar dependencias frontend
echo.
echo [4/4] Instalando dependencias del frontend...
cd /d "%~dp0frontend"
call npm install
if errorlevel 1 ( echo [ERROR] Fallo en frontend & pause & exit /b 1 )
echo [OK] Frontend listo

echo.
echo =============================================
echo  Instalacion completada.
echo  Ahora ejecuta INICIAR.bat
echo =============================================
echo.
pause
