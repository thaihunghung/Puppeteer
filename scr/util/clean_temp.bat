@echo off
set temp_dir=%LOCALAPPDATA%\Temp

if exist "%temp_dir%" (
    echo Cleaning up %temp_dir%...

    rem Duyệt qua tất cả file trong Temp
    for %%F in ("%temp_dir%\*.*") do (
        rem Kiểm tra xem file có bị khóa không
        ( 
            >nul 2>>nul echo.>>"%%F" && (
                del /f /q "%%F"
                echo Deleted: %%F
            ) || echo Skipped (in use): %%F
        )
    )

    rem Duyệt qua tất cả thư mục trong Temp
    for /d %%D in ("%temp_dir%\*") do (
        rd /s /q "%%D" 2>nul && echo Deleted folder: %%D || echo Skipped (in use): %%D
    )

    echo Cleanup completed.
) else (
    echo Temp directory not found.
)

pause
