@echo off
echo =====================================
echo Script khoi dong OrderUp Docker
echo =====================================

echo 🚀 Dang khoi dong OrderUp Application...

:: Kiem tra file .env
if not exist .env (
    echo ❌ Loi: File .env khong ton tai!
    echo 📝 Huong dan:
    echo    1. Copy file environment.example thanh .env
    echo    2. Dien thong tin MongoDB va Cloudinary vao file .env
    echo    3. Chay lai script nay
    pause
    exit /b 1
)

:: Kiem tra Docker
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker chua duoc cai dat!
    pause
    exit /b 1
)

:: Kiem tra Docker Compose
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose chua duoc cai dat!
    pause
    exit /b 1
)

:: Don dep containers cu
echo 🧹 Don dep containers cu...
docker-compose down --remove-orphans

:: Build va chay containers
echo 🔨 Building va starting containers...
docker-compose up --build -d

:: Kiem tra trang thai
echo ⏳ Dang kiem tra trang thai containers...
timeout /t 10 /nobreak >nul

:: Hien thi logs
echo 📋 Trang thai containers:
docker-compose ps

echo.
echo ✅ Ung dung da san sang!
echo 🌐 Frontend: http://localhost
echo 🔧 Backend API: http://localhost:8080
echo.
echo 📊 De xem logs:
echo    docker-compose logs -f
echo.
echo ⏹️ De dung ung dung:
echo    docker-compose down
echo.
pause 