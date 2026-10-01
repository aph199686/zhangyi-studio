@echo off
cd /d "%~dp0"
title Zhangyi Studio
where node >nul 2>&1
if errorlevel 1 (
  echo Node.js was not found. Please install Node.js and try again.
  pause
  exit /b 1
)
node "%~dp0tools\launch_studio.mjs"
if errorlevel 1 (
  echo The studio could not start. Please share the error above with the developer.
  pause
)
