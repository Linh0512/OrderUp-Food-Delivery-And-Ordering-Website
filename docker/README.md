# 🐳 Docker Configuration

## 📁 Cấu trúc thư mục

```
docker/
├── scripts/
│   ├── start.sh      # Script khởi động (Linux/macOS)
│   └── start.bat     # Script khởi động (Windows)
└── docs/
    ├── DOCKER_GUIDE.md    # Hướng dẫn chi tiết
    └── QUICK_START.md     # Hướng dẫn nhanh
```

## 🚀 Cách sử dụng

### 1. Chuẩn bị môi trường
```bash
# Copy file template
cp environment.template .env

# Chỉnh sửa file .env với thông tin MongoDB và Cloudinary
```

### 2. Khởi động ứng dụng
```bash
# Sử dụng Docker Compose (khuyến nghị)
docker-compose up --build -d

# Hoặc sử dụng script
./docker/scripts/start.sh    # Linux/macOS
docker/scripts/start.bat     # Windows
```

### 3. Truy cập ứng dụng
- Frontend: http://localhost
- Backend: http://localhost:8080

## 📚 Tài liệu chi tiết

Xem trong thư mục `docs/` để có hướng dẫn đầy đủ. 