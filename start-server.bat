@echo off
echo Starting local development server...
echo.
echo This will serve your website at http://localhost:8000
echo Press Ctrl+C to stop the server
echo.

REM Start server in a separate window
echo Starting server...
start "Development Server" cmd /k "python server.py || py server.py"

REM Wait a moment for server to start
timeout /t 2 /nobreak >nul

REM Open article editor page in default browser
echo Opening article editor...
start http://localhost:8000/news/article-editor.html

echo.
echo Server is running in a separate window.
echo Article editor should open in your browser.
echo.
pause