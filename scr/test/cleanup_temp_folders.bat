@echo off
set temp_dir=%LOCALAPPDATA%\Temp

if exist "%temp_dir%" (
    echo Cleaning up %temp_dir%...
    rmdir /s /q "%temp_dir%"
    mkdir "%temp_dir%"
    echo Cleanup completed.
) else (
    echo Temp directory not found.
)

pause
