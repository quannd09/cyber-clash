@echo off
echo ========================================================
echo   CYBER CLASH: ZERO-G ARENA (2D Local 2-Player Fighter)
echo ========================================================
echo Dang khoi chay local server tai http://localhost:8000 ...
start "" "http://localhost:8000"
py -m http.server 8000
pause
