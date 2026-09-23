@echo off
echo ========================================================
echo   CYBER CLASH: ZERO-G ARENA (2D Local 2-Player Fighter)
echo ========================================================
echo Starting local server at http://localhost:8000 ...
start "" "http://localhost:8000"
py serve.py 8000
pause
