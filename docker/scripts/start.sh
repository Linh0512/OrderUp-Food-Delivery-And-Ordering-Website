#!/bin/bash

# =====================================
# Script khởi động OrderUp Docker
# =====================================

echo "🚀 Đang khởi động OrderUp Application..."

# Kiểm tra file .env
if [ ! -f .env ]; then
    echo "❌ Lỗi: File .env không tồn tại!"
    echo "📝 Hướng dẫn:"
    echo "   1. Copy file environment.example thành .env"
    echo "   2. Điền thông tin MongoDB và Cloudinary vào file .env"
    echo "   3. Chạy lại script này"
    exit 1
fi

# Kiểm tra Docker và Docker Compose
if ! command -v docker &> /dev/null; then
    echo "❌ Docker chưa được cài đặt!"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose chưa được cài đặt!"
    exit 1
fi

# Dọn dẹp containers cũ (nếu có)
echo "🧹 Dọn dẹp containers cũ..."
docker-compose down --remove-orphans

# Build và chạy containers
echo "🔨 Building và starting containers..."
docker-compose up --build -d

# Kiểm tra trạng thái
echo "⏳ Đang kiểm tra trạng thái containers..."
sleep 10

# Hiển thị logs
echo "📋 Trạng thái containers:"
docker-compose ps

echo ""
echo "✅ Ứng dụng đã sẵn sàng!"
echo "🌐 Frontend: http://localhost"
echo "🔧 Backend API: http://localhost:8080"
echo ""
echo "📊 Để xem logs:"
echo "   docker-compose logs -f"
echo ""
echo "⏹️ Để dừng ứng dụng:"
echo "   docker-compose down" 