@echo off
REM Script to commit the Firebase setup files to GitHub

REM Check if git is installed
where git >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Git is not installed. Please install git first.
    exit /b 1
)

REM Navigate to the project root
cd /d "%~dp0\.."

REM Check if this is a git repository
if not exist .git (
    echo This is not a git repository. Initializing...
    git init
)

REM Add the files
git add scripts/setup-firebase.js
git add scripts/README.md
git add .gitignore
git add README.md

REM Commit the changes
git commit -m "Add Firebase setup script and documentation"

REM Check if remote exists
git remote | findstr "origin" >nul
if %ERRORLEVEL% neq 0 (
    echo No remote repository found.
    echo To push to GitHub, run:
    echo git remote add origin https://github.com/fusioncapital1/DataPulse.ai.git
    echo git push -u origin main
) else (
    echo To push to GitHub, run:
    echo git push
)

echo Firebase setup files committed successfully!
