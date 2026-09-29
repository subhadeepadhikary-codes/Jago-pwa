@echo off
title JAGO PWA v1.0 Launcher
echo ========================================================
echo   JAGO PWA v1.0 - Desktop & Mobile Edition
echo   Ministry of Tribal Affairs, Govt of India
echo ========================================================
echo.
echo Starting local Vite preview server on http://localhost:4173 ...
echo Press Ctrl+C to stop the server anytime.
echo.
start "" "http://localhost:4173"
call npx.cmd vite preview --port 4173
pause
