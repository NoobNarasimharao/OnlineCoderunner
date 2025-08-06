@echo off
setlocal enabledelayedexpansion

echo 🐳 Starting CodeRunner Docker Environment...
echo ==============================================

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker Desktop and try again.
    pause
    exit /b 1
)

REM Check if Docker Compose is available
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose is not available. Please install Docker Compose and try again.
    pause
    exit /b 1
)

echo ✅ Docker and Docker Compose are available

REM Stop any existing containers
echo 🛑 Stopping any existing containers...
docker-compose down --remove-orphans

REM Build and start all services
echo 🔨 Building and starting all services...
docker-compose up --build -d

REM Wait for services to be ready
echo ⏳ Waiting for services to be ready...
timeout /t 10 /nobreak >nul

REM Check service health
echo 🏥 Checking service health...

REM Check API server
echo Checking API server...
for /l %%i in (1,1,30) do (
    curl -s http://localhost:3001/api/health >nul 2>&1
    if not errorlevel 1 (
        echo ✅ API server is healthy
        goto :api_healthy
    )
    timeout /t 2 /nobreak >nul
)
echo ❌ API server failed to start
docker-compose logs server
pause
exit /b 1

:api_healthy

REM Check frontend
echo Checking frontend...
for /l %%i in (1,1,30) do (
    curl -s http://localhost:3000 >nul 2>&1
    if not errorlevel 1 (
        echo ✅ Frontend is healthy
        goto :frontend_healthy
    )
    timeout /t 2 /nobreak >nul
)
echo ❌ Frontend failed to start
docker-compose logs client
pause
exit /b 1

:frontend_healthy

REM Check sandboxes
echo Checking sandboxes...
for %%s in (sandbox-node sandbox-python sandbox-java sandbox-cpp sandbox-php sandbox-ruby sandbox-go sandbox-rust sandbox-typescript) do (
    echo Checking %%s...
    docker-compose ps %%s | findstr "Up" >nul
    if not errorlevel 1 (
        echo ✅ %%s is running
    ) else (
        echo ⚠️  %%s is not running ^(this is normal if not all languages are needed^)
    )
)

echo.
echo 🎉 CodeRunner is ready!
echo ==============================================
echo 🌐 Frontend: http://localhost:3000
echo 🔌 API: http://localhost:3001
echo 📊 Health Check: http://localhost:3001/api/health
echo.
echo 📝 Available commands:
echo   docker-compose logs -f          # Follow all logs
echo   docker-compose logs -f server   # Follow server logs
echo   docker-compose logs -f client   # Follow client logs
echo   docker-compose down             # Stop all services
echo   docker-compose restart server   # Restart server
echo.
echo 🔒 Security features enabled:
echo   - Isolated sandboxes for each language
echo   - Resource limits and timeouts
echo   - Read-only filesystems
echo   - Non-root users
echo   - Network isolation
echo.
echo Happy coding! 🚀
pause 