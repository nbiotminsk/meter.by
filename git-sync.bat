@echo off
:: Script to automate git add, commit with timestamp, and push
:: Uses PowerShell to get a locale-independent timestamp

echo Starting Git sync...

:: Add all changes
echo Adding changes...
git add .

:: Get timestamp using PowerShell for consistency
for /f "usebackq tokens=*" %%a in (`powershell -Command "Get-Date -Format 'yyyy-MM-dd HH:mm:ss' "`) do set TIMESTAMP=%%a

:: Commit with the timestamp
echo Committing changes...
git commit -m "Auto-update: %TIMESTAMP%"

:: Push to remote
echo Pushing to master...
git push origin master

echo.
echo Sync completed successfully!
pause
