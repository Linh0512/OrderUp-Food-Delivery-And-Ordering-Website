# 🚀 Quick Start - OrderUp Docker

## ⚡ Bắt đầu nhanh trong 3 bước

### 1️⃣ Chuẩn bị môi trường
```bash
# Copy và cấu hình file môi trường
cp environment.example .env

# Chỉnh sửa file .env với thông tin thực tế:
# - MongoDB Atlas credentials  
# - Cloudinary URL
```

### 2️⃣ Khởi động ứng dụng

**Cách 1: Sử dụng script tự động**
```bash
# Linux/macOS
chmod +x start.sh && ./start.sh

# Windows
start.bat
```

**Cách 2: Sử dụng Docker Compose**
```bash
docker-compose up --build -d
```

**Cách 3: Sử dụng Makefile**
```bash
make start
```

### 3️⃣ Truy cập ứng dụng

- 🌐 **Frontend**: http://localhost
- 🔧 **Backend**: http://localhost:8080  
- 🏥 **Health Check**: http://localhost:8080/actuator/health

---

## 🆘 Lỗi thường gặp

### ❌ "Port 80 already in use"
```bash
# Tìm và kill process đang dùng port
sudo lsof -ti:80 | xargs kill -9
```

### ❌ "MongoDB connection failed" 
- Kiểm tra lại thông tin trong file `.env`
- Đảm bảo MongoDB Atlas cho phép kết nối từ mọi IP (0.0.0.0/0)

### ❌ "Frontend shows 502 error"
```bash
# Kiểm tra backend
docker-compose logs backend
docker-compose restart
```

---

## 📋 Lệnh hữu ích

```bash
# Xem logs
docker-compose logs -f

# Dừng ứng dụng  
docker-compose down

# Rebuild containers
docker-compose up --build -d

# Dọn dẹp hoàn toàn
docker system prune -a
```

---

## 📚 Tài liệu chi tiết

Xem file `DOCKER_GUIDE.md` để có hướng dẫn đầy đủ và troubleshooting. 