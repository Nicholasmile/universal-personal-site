@echo off
setlocal
cd /d "%~dp0"
title Open My Website
where py >nul 2>nul
if not errorlevel 1 (
  set "PYTHON_COMMAND=py"
) else (
  where python >nul 2>nul
  if errorlevel 1 (
    echo Python could not be found on this computer.
    echo Please open this folder in VS Code and use a Live Server extension.
    pause
    exit /b 1
  )
  set "PYTHON_COMMAND=python"
)
echo Starting your website preview...
start "Website preview server - keep this window open" cmd /k "%PYTHON_COMMAND% -m http.server 8000 --bind 127.0.0.1"
timeout /t 3 /nobreak >nul
start "" "http://127.0.0.1:8000/"
echo Your website should open in your browser.
echo If it does not, open http://127.0.0.1:8000/ manually.
echo To stop it, close the window titled Website preview server.
pause
