@echo off
title Configurar SQL Server - Estudio Juridico

:: Auto-elevacion a Administrador
NET SESSION >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo Solicitando permisos de administrador...
    PowerShell -Command "Start-Process '%~f0' -Verb RunAs"
    EXIT /B
)

echo.
echo =============================================
echo  Configurando SQL Server para la app...
echo =============================================
echo.

:: 1. Habilitar TCP/IP via PowerShell + WMI
echo [1/4] Habilitando TCP/IP en SQL Server...
PowerShell -NoProfile -ExecutionPolicy Bypass -Command ^
    "try { [void][reflection.assembly]::LoadWithPartialName('Microsoft.SqlServer.SqlWmiManagement'); $m = New-Object 'Microsoft.SqlServer.Management.Smo.Wmi.ManagedComputer'; $tcp = $m.ServerInstances['SQLEXPRESS'].ServerProtocols['Tcp']; $tcp.IsEnabled = $true; $tcp.Alter(); Write-Host '[OK] TCP/IP habilitado via WMI' } catch { Write-Host '[WARN] No se pudo usar WMI, intentando via registro...' }"

:: Fallback via registro si WMI falla
PowerShell -NoProfile -ExecutionPolicy Bypass -Command ^
    "$keys = Get-ChildItem 'HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server' -ErrorAction SilentlyContinue | Where-Object { $_.Name -match 'MSSQL\d+\.SQLEXPRESS$' }; foreach ($k in $keys) { $p = $k.PSPath + '\MSSQLServer\SuperSocketNetLib\Tcp'; if (Test-Path $p) { Set-ItemProperty -Path $p -Name 'Enabled' -Value 1 -ErrorAction SilentlyContinue; Write-Host '[OK] TCP/IP habilitado via registro' } }"

:: 2. Habilitar y arrancar SQL Server Browser
echo.
echo [2/4] Habilitando SQL Server Browser...
sc config SQLBrowser start= auto >nul 2>&1
net start SQLBrowser >nul 2>&1
IF %ERRORLEVEL% EQU 0 (
    echo [OK] SQL Server Browser iniciado
) ELSE (
    echo [INFO] SQL Server Browser ya estaba corriendo o no disponible
)

:: 3. Reiniciar SQL Server SQLEXPRESS para aplicar TCP/IP
echo.
echo [3/4] Reiniciando SQL Server SQLEXPRESS...
net stop "SQL Server (SQLEXPRESS)" >nul 2>&1
timeout /t 2 /nobreak >nul
net start "SQL Server (SQLEXPRESS)" >nul 2>&1
IF %ERRORLEVEL% EQU 0 (
    echo [OK] SQL Server reiniciado
) ELSE (
    echo [ERROR] No se pudo reiniciar SQL Server. Reinicialo manualmente desde Servicios de Windows.
    pause
    EXIT /B 1
)
timeout /t 3 /nobreak >nul

:: 4. Crear base de datos + ejecutar TODOS los scripts SQL
echo.
echo [4/4] Creando base de datos y ejecutando scripts SQL...
where sqlcmd >nul 2>&1
IF %ERRORLEVEL% EQU 0 (
    sqlcmd -S localhost\SQLEXPRESS -U sa -P Admin2024! -Q "IF NOT EXISTS (SELECT name FROM sys.databases WHERE name='EstudioJuridico') CREATE DATABASE EstudioJuridico COLLATE Modern_Spanish_CI_AI; PRINT 'BD lista'" -b
    IF %ERRORLEVEL% NEQ 0 ( echo [ERROR] No se pudo crear la BD. Verifica usuario/password en backend\.env & pause & EXIT /B 1 )
    
    echo Ejecutando 01_schema.sql...
    sqlcmd -S localhost\SQLEXPRESS -U sa -P Admin2024! -d EstudioJuridico -i "%~dp0sql\01_schema.sql" -b
    echo Ejecutando 02_seed.sql...
    sqlcmd -S localhost\SQLEXPRESS -U sa -P Admin2024! -d EstudioJuridico -i "%~dp0sql\02_seed.sql" -b
    echo Ejecutando 03_expansion.sql...
    sqlcmd -S localhost\SQLEXPRESS -U sa -P Admin2024! -d EstudioJuridico -i "%~dp0sql\03_expansion.sql" -b
    echo Ejecutando 04_seed_expansion.sql...
    sqlcmd -S localhost\SQLEXPRESS -U sa -P Admin2024! -d EstudioJuridico -i "%~dp0sql\04_seed_expansion.sql" -b
    echo Ejecutando 05_modelos.sql...
    sqlcmd -S localhost\SQLEXPRESS -U sa -P Admin2024! -d EstudioJuridico -i "%~dp0sql\05_modelos.sql" -b
    echo Ejecutando 06_usuarios.sql...
    sqlcmd -S localhost\SQLEXPRESS -U sa -P Admin2024! -d EstudioJuridico -i "%~dp0sql\06_usuarios.sql" -b
    echo Ejecutando 07_modelos_ampliados.sql...
    sqlcmd -S localhost\SQLEXPRESS -U sa -P Admin2024! -d EstudioJuridico -i "%~dp0sql\07_modelos_ampliados.sql" -b
    echo Ejecutando 08_nuevos_modulos.sql...
    sqlcmd -S localhost\SQLEXPRESS -U sa -P Admin2024! -d EstudioJuridico -i "%~dp0sql\08_nuevos_modulos.sql" -b
    echo Ejecutando 09_escritos_propios.sql...
    sqlcmd -S localhost\SQLEXPRESS -U sa -P Admin2024! -d EstudioJuridico -i "%~dp0sql\09_escritos_propios.sql" -b
    
    echo.
    echo [OK] Todos los scripts SQL ejecutados correctamente.
) ELSE (
    echo [INFO] sqlcmd no encontrado en PATH.
    echo.
    echo  Ejecuta manualmente en SSMS en este orden:
    echo   1. sql\01_schema.sql
    echo   2. sql\02_seed.sql
    echo   3. sql\03_expansion.sql
    echo   4. sql\04_seed_expansion.sql
    echo   5. sql\05_modelos.sql
    echo   6. sql\06_usuarios.sql
    echo   7. sql\07_modelos_ampliados.sql
    echo   8. sql\08_nuevos_modulos.sql
    echo   9. sql\09_escritos_propios.sql
)

echo.
echo =============================================
echo  Configuracion completada.
echo  Ahora ejecuta INSTALAR.bat
echo =============================================
echo.
pause
