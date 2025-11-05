@echo off
echo Starting local development server...
echo.
echo This will serve your website at http://localhost:8000
echo Press Ctrl+C to stop the server
echo.

REM Try Python 3 first
python server.py
if %errorlevel% neq 0 (
    REM If python command fails, try py command
    py server.py
    if %errorlevel% neq 0 (
        echo.
        echo Error: Python is not installed or not in PATH
        echo Please install Python 3 from https://python.org
        echo.
        pause
    )
)