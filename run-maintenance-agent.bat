@echo off
echo ====================================================
echo  Retro Daily Maintenance & Contribution Agent Runner
echo ====================================================
echo.

cd /d "%~dp0"

echo [1/3] Syncing with origin/main...
git pull origin main --rebase
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Git pull failed. Please check your network or git status.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [2/3] Running Maintenance Agent tasks...
call npm run agent:daily
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Maintenance agent run failed.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [3/3] Pushing daily verified contributions to GitHub...
git push origin main
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Git push failed.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ====================================================
echo  Maintenance Agent completed and pushed successfully!
echo ====================================================
echo.
pause

