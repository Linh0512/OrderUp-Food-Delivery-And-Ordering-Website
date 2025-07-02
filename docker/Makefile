# OrderUp Docker Management Makefile

.PHONY: help build up down restart logs clean status health

# Default target
help:
	@echo "🐳 OrderUp Docker Commands:"
	@echo ""
	@echo "📋 Các lệnh có sẵn:"
	@echo "  make build     - Build tất cả containers"
	@echo "  make up        - Khởi động ứng dụng"
	@echo "  make down      - Dừng ứng dụng"
	@echo "  make restart   - Restart ứng dụng"
	@echo "  make logs      - Xem logs"
	@echo "  make status    - Kiểm tra trạng thái containers"
	@echo "  make health    - Kiểm tra health của services"
	@echo "  make clean     - Dọn dẹp containers và images"
	@echo ""
	@echo "🌐 Sau khi chạy 'make up':"
	@echo "  Frontend: http://localhost"
	@echo "  Backend:  http://localhost:8080"

# Build containers
build:
	@echo "🔨 Building containers..."
	docker-compose build

# Start application
up:
	@echo "🚀 Starting OrderUp application..."
	docker-compose up -d
	@echo "✅ Application started!"
	@echo "🌐 Frontend: http://localhost"
	@echo "🔧 Backend:  http://localhost:8080"

# Stop application
down:
	@echo "⏹️ Stopping application..."
	docker-compose down

# Restart application
restart:
	@echo "🔄 Restarting application..."
	docker-compose restart

# View logs
logs:
	@echo "📋 Viewing logs..."
	docker-compose logs -f

# Check container status
status:
	@echo "📊 Container status:"
	docker-compose ps

# Health check
health:
	@echo "🏥 Checking health..."
	@echo "Backend health:"
	@curl -s http://localhost:8080/actuator/health | jq . || echo "Backend not responding"
	@echo ""
	@echo "Frontend health:"
	@curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost || echo "Frontend not responding"

# Clean up
clean:
	@echo "🧹 Cleaning up..."
	docker-compose down -v
	docker system prune -f
	@echo "✅ Cleanup completed!"

# Quick start with build
start: build up

# Development mode (with logs)
dev:
	@echo "🛠️ Starting in development mode..."
	docker-compose up --build 