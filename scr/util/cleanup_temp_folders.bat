@echo off
set temp_dir=%LOCALAPPDATA%\Temp

echo Đang xóa các tệp không sử dụng trong %temp_dir%...

:: Xóa tất cả các tệp trong thư mục Temp, bỏ qua tệp đang sử dụng
del /s /f /q "%temp_dir%\*.*" 2>nul

:: Xóa tất cả các thư mục con rỗng trong Temp
for /d %%i in ("%temp_dir%\*") do rd /s /q "%%i" 2>nul

echo Dọn dẹp hoàn tất.
pause
