@echo off
title Cloz Web — Deploy to GitHub + Railway
color 0D

echo.
echo  ================================================
echo   Cloz Optimizer — Deploy Script
echo  ================================================
echo.

:: ── CONFIG ──────────────────────────────────────────
set REPO_URL=https://github.com/yarz9/cloz-web.git
set BRANCH=main
:: ────────────────────────────────────────────────────

:: Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Git is not installed or not in PATH.
    echo  Download it from: https://git-scm.com
    pause
    exit /b
)

:: Check if this is already a git repo
if not exist ".git" (
    echo  [INIT] No git repo found. Initializing...
    git init
    git remote add origin %REPO_URL%
    echo  [OK] Git repo initialized.
) else (
    echo  [OK] Git repo found.
    git remote set-url origin %REPO_URL% 2>nul
)

echo.
echo  [STATUS] Current file status:
echo  ------------------------------------------------
git status --short
echo  ------------------------------------------------
echo.

:: Check if there are changes
git diff --quiet --cached -- 2>nul
git diff --quiet -- 2>nul
git status --porcelain | findstr /r "." >nul 2>&1
if errorlevel 1 (
    echo  [INFO] No changes detected. Already up to date.
    pause
    exit /b
)

:: Stage all files
git add .
echo  [OK] All files staged.

:: Commit with timestamp
for /f "tokens=1-5 delims=/-. " %%a in ("%date%") do (
    set DAY=%%a
    set MONTH=%%b
    set YEAR=%%c
)
for /f "tokens=1-2 delims=:. " %%a in ("%time: =0%") do (
    set HOUR=%%a
    set MIN=%%b
)
set COMMIT_MSG=deploy: update %DAY%.%MONTH%.%YEAR%. %HOUR%:%MIN%

git commit -m "%COMMIT_MSG%"
if errorlevel 1 (
    echo.
    echo  [INFO] Nothing new to commit.
    pause
    exit /b
)
echo  [OK] Committed: %COMMIT_MSG%

:: Push to GitHub
echo.
echo  [PUSH] Pushing to GitHub ^(%BRANCH%^)...
git push -u origin %BRANCH%

if errorlevel 1 (
    echo.
    echo  [ERROR] Push failed. Possible reasons:
    echo    - Not authenticated (run: git credential-manager or use SSH)
    echo    - Branch does not exist yet
    echo.
    echo  Try: git push --set-upstream origin %BRANCH%
) else (
    echo.
    echo  ================================================
    echo   DEPLOYED! Pushed to GitHub.
    echo   Railway auto-deploys in ~30 seconds.
    echo  ================================================
)

echo.
pause
