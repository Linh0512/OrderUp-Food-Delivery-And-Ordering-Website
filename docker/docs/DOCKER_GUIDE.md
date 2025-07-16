# 🐳 Hướng dẫn Docker cho OrderUp Application

## 📋 Tổng quan

Dự án OrderUp đã được containerized với Docker để dễ dàng triển khai và sử dụng. Hệ thống bao gồm:

- **Frontend**: React + Vite + TailwindCSS (Port 80)
- **Backend**: Spring Boot + Java 21 (Port 8080)
- **Database**: MongoDB Atlas (Cloud)
- **Reverse Proxy**: Nginx

## 🛠️ Yêu cầu hệ thống

- **Docker** version 20.10+ 
- **Docker Compose** version 2.0+
- **RAM**: Tối thiểu 4GB
- **Disk**: Tối thiểu 2GB dung lượng trống

## 🚀 Hướng dẫn cài đặt nhanh

### Bước 1: Clone và chuẩn bị dự án

```bash
git clone <repository-url>
cd FP
```

### Bước 2: Cấu hình biến môi trường

```bash
# Copy file template
cp environment.example .env

# Chỉnh sửa file .env với thông tin thực tế
# Cần có:
# - MongoDB Atlas connection string
# - Cloudinary credentials
```

### Bước 3: Chạy ứng dụng

**Trên Linux/macOS:**
```bash
chmod +x start.sh
./start.sh
```

**Trên Windows:**
```cmd
start.bat
```

**Hoặc chạy thủ công:**
```bash
docker-compose up --build -d
```

### Bước 4: Truy cập ứng dụng

- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080
- **Health Check**: http://localhost:8080/actuator/health

## 📁 Cấu trúc Docker

```
FP/
├── docker-compose.yml          # Orchestration file
├── environment.example         # Template biến môi trường
├── start.sh                   # Script khởi động (Linux/macOS)
├── start.bat                  # Script khởi động (Windows)
├── frontend/
│   ├── Dockerfile             # Frontend container
│   ├── nginx.conf             # Nginx configuration
│   └── .dockerignore
└── orderup/
    ├── Dockerfile             # Backend container
    └── .dockerignore
```

## ⚙️ Cấu hình biến môi trường

Tạo file `.env` trong thư mục gốc với nội dung:

```env
# MongoDB Configuration
MONGO_USER=your_username
MONGO_PASSWORD=your_password
MONGO_CLUSTER=cluster0.xxxxx.mongodb.net
MONGO_DATABASE=orderup_db

# Cloudinary Configuration
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

# JWT Configuration (Optional)
JWT_SECRET=your_jwt_secret_key_at_least_32_characters
JWT_EXPIRATION=86400000
```

### Cách lấy thông tin MongoDB Atlas:

1. Đăng nhập vào [MongoDB Atlas](https://cloud.mongodb.com)
2. Chọn cluster → Connect → Connect your application
3. Copy connection string và tách thành các phần:
   - `MONGO_USER`: username
   - `MONGO_PASSWORD`: password  
   - `MONGO_CLUSTER`: cluster URL
   - `MONGO_DATABASE`: database name

### Cách lấy thông tin Cloudinary:

1. Đăng nhập vào [Cloudinary](https://cloudinary.com)
2. Vào Dashboard → Account Details
3. Copy **Environment variable** (dạng: `CLOUDINARY_URL=cloudinary://...`)

## 🐳 Các lệnh Docker hữu ích

### Quản lý containers

```bash
# Xem trạng thái containers
docker-compose ps

# Xem logs
docker-compose logs -f

# Xem logs của service cụ thể
docker-compose logs -f backend
docker-compose logs -f frontend

# Restart containers
docker-compose restart

# Dừng containers
docker-compose down

# Dừng và xóa volumes
docker-compose down -v

# Rebuild containers
docker-compose up --build -d
```

### Debug containers

```bash
# Truy cập vào container backend
docker exec -it orderup-backend bash

# Truy cập vào container frontend
docker exec -it orderup-frontend sh

# Kiểm tra resource usage
docker stats
```

### Dọn dẹp Docker

```bash
# Xóa containers đã dừng
docker container prune

# Xóa images không sử dụng
docker image prune

# Xóa tất cả (cẩn thận!)
docker system prune -a
```

## 🔧 Troubleshooting

### Lỗi thường gặp

#### 1. **Port đã được sử dụng**
```
Error: bind: address already in use
```

**Giải pháp:**
```bash
# Kiểm tra process đang sử dụng port
netstat -tulpn | grep :80
netstat -tulpn | grep :8080

# Kill process (nếu cần)
sudo kill -9 <PID>
```

#### 2. **Lỗi kết nối MongoDB**
```
Connection refused to MongoDB
```

**Giải pháp:**
- Kiểm tra lại thông tin trong file `.env`
- Đảm bảo MongoDB Atlas cho phép kết nối từ IP `0.0.0.0/0`
- Kiểm tra username/password

#### 3. **Frontend không load được**
```
502 Bad Gateway
```

**Giải pháp:**
```bash
# Kiểm tra backend có chạy không
docker-compose logs backend

# Restart services
docker-compose restart
```

#### 4. **Build lỗi do network**
```
npm install failed
```

**Giải pháp:**
```bash
# Build từng service riêng lẻ
docker-compose build frontend
docker-compose build backend

# Hoặc clear cache
docker system prune
```

### Kiểm tra health của services

```bash
# Kiểm tra backend health
curl http://localhost:8080/actuator/health

# Kiểm tra frontend
curl http://localhost

# Kiểm tra API endpoint
curl http://localhost:8080/api/health
```

## 📊 Monitoring và Logs

### Xem logs real-time

```bash
# Tất cả services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend

# Với timestamp
docker-compose logs -f -t
```

### Resource monitoring

```bash
# Xem resource usage
docker stats

# Disk usage
docker system df
```

## 🔒 Bảo mật

### Production deployment

Khi triển khai production, cần thay đổi:

1. **JWT Secret**: Generate secret key mạnh
2. **Database**: Cấu hình MongoDB với authentication
3. **HTTPS**: Thêm SSL certificates
4. **Firewall**: Chỉ mở các port cần thiết

### Backup dữ liệu

```bash
# Backup MongoDB (nếu dùng local)
docker exec mongodb mongodump --out /backup

# Backup logs
docker-compose logs > backup_logs.txt
```

## 📞 Hỗ trợ

Nếu gặp vấn đề:

1. Kiểm tra logs: `docker-compose logs`
2. Kiểm tra file `.env` có đúng không
3. Đảm bảo Docker daemon đang chạy
4. Kiểm tra network connectivity

## 🎯 Performance Tips

1. **Tăng memory cho Docker**: Docker Desktop → Settings → Resources
2. **Sử dụng multi-stage builds**: Đã được tối ưu trong Dockerfile
3. **Cache layers**: Đặt `COPY package*.json` trước `COPY .`
4. **Prune thường xuyên**: `docker system prune`

---

✅ **Hoàn thành!** Ứng dụng OrderUp đã sẵn sàng chạy trong Docker containers. 