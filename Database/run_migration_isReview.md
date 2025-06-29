# Hướng dẫn chạy Migration Script để thêm trường isReview

## Mục đích
Script này sẽ thêm trường `isReview` vào tất cả orders hiện có trong database và cập nhật giá trị dựa trên các review đã tồn tại.

## Yêu cầu
- MongoDB đã được cài đặt và đang chạy
- Có quyền truy cập vào database OrderUp
- Connection string đã được cấu hình đúng

## Các bước thực hiện

### 1. Kết nối đến MongoDB
```bash
# Sử dụng MongoDB Shell (mongosh)
mongosh "mongodb+srv://your-username:your-password@your-cluster.mongodb.net/orderup_db"

# Hoặc nếu sử dụng MongoDB Compass, kết nối với connection string của bạn
```

### 2. Chạy Migration Script
```bash
# Từ thư mục Database/addData/, chạy:
mongosh "your-connection-string" migration_add_isReview.js
```

### 3. Kiểm tra kết quả
Script sẽ báo cáo:
- Số lượng orders đã được cập nhật với `isReview = false`
- Số lượng orders đã được đánh dấu `isReview = true` dựa trên reviews hiện có
- Tổng số orders, orders đã review và chưa review

## Kết quả mong đợi

Sau khi chạy script:
1. Tất cả orders hiện có sẽ có trường `isReview`
2. Orders đã có review tương ứng sẽ được đánh dấu `isReview = true`
3. Orders chưa có review sẽ có `isReview = false`

## Lưu ý quan trọng

⚠️ **Backup Database trước khi chạy migration!**

```bash
# Tạo backup database
mongodump --uri="your-connection-string" --out=backup-before-migration
```

## Rollback (nếu cần)

Nếu cần rollback, có thể xóa trường `isReview`:
```javascript
db.orders.updateMany({}, { $unset: { isReview: "" } })
```

## Xác nhận migration thành công

Kiểm tra một vài documents:
```javascript
// Kiểm tra orders có trường isReview
db.orders.findOne({})

// Đếm orders theo trạng thái review
db.orders.countDocuments({ isReview: true })
db.orders.countDocuments({ isReview: false })
``` 