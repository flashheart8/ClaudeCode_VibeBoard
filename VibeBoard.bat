@echo off
start "VibeBoard" /min cmd /c "cd /d "E:\Claude Projects\ProjectManagementApp" && npm run dev"
timeout /t 3 /noq >nul
start http://localhost:3000
start https://github.com/flashheart8/ClaudeCode_VibeBoard
