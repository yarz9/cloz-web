@echo off
title Cloz Web — GitHub Push
color 0D

echo.
echo  ================================================
echo   Cloz Optimizer — Web Deploy Script
echo  ================================================
echo.

:: ── CONFIG ──────────────────────────────────────────
set REPO_URL=https://github.com/yarz9/cloz-webgit
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

    :: Update remote URL in case it changed
    git remote set-url origin %REPO_URL% 2>nul
)

echo.
echo  [STATUS] Current file status:
echo  ------------------------------------------------
git status --short
echo  ------------------------------------------------
echo.

:: Stage all files
git add .
echo  [OK] All files staged.

:: Commit with timestamp
for /f "tokens=1-3 delims=/ " %%a in ("%date%") do set DATE=%%c-%%b-%%a
for /f "tokens=1-2 delims=: " %%a in ("%time%") do set TIME=%%a:%%b
set COMMIT_MSG=deploy: update %DATE% %TIME%

git commit -m "%COMMIT_MSG%"
if errorlevel 1 (
    echo.
    echo  [INFO] Nothing new to commit. Already up to date.
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
    echo    - Wrong REPO_URL in this script
    echo    - Not authenticated ^(run: git credential-manager or use SSH^)
    echo    - Branch does not exist yet ^(first push^)
    echo.
    echo  Try running manually:
    echo    git push --set-upstream origin %BRANCH%
) else (
    echo.
    echo  ================================================
    echo   SUCCESS! Pushed to GitHub.
    echo   Railway will auto-deploy in ~30 seconds.
    echo  ================================================
)

echo.
pause
