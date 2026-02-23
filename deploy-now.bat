@echo off
echo ========================================
echo   部署到阿里云服务器
echo ========================================
echo.
echo 请在提示时输入服务器密码
echo.

ssh admin@106.14.115.73 "cd ~/kaoshanmeng && docker compose up -d && docker compose ps && docker compose logs --tail=30"

echo.
echo ========================================
echo   部署完成！
echo ========================================
pause
