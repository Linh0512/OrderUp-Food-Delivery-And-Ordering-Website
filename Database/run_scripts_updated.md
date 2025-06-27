# Hướng dẫn chạy Scripts đã cập nhật

## ⚠️ Vấn đề đã phát hiện
Script migration ban đầu có vấn đề: đánh dấu `isReview = true` cho orders dựa trên `customerId + restaurantId` thay vì `orderId` chính xác. Điều này dẫn đến việc đánh dấu sai orders.

## 🔧 Giải pháp
Scripts đã được cập nhật để:
1. Kiểm tra `orderId` chính xác từ reviews
2. Chỉ cập nhật orders thực sự có review tương ứng
3. Phát hiện và làm sạch reviews không hợp lệ

## 📋 Các bước thực hiện (theo thứ tự)

### Bước 1: Backup Database
```bash
mongodump --uri="mongodb+srv://username:password@cluster.mongodb.net/food_delivery_app" --out=backup-$(date +%Y%m%d)
```

### Bước 2: Reset trạng thái isReview về false
```javascript
// Chạy trong mongosh
db = db.getSiblingDB('food_delivery_app');
db.orders.updateMany({}, { $set: { isReview: false } });
print("Đã reset tất cả orders về isReview = false");
```

### Bước 3: Chạy Migration Script mới
```bash
mongosh "mongodb+srv://username:password@cluster.mongodb.net/food_delivery_app" Database/addData/migration_add_isReview.js
```

**Script này sẽ:**
- Thêm trường `isReview = false` cho tất cả orders
- Cập nhật `isReview = true` cho orders có review chính xác (theo orderId)
- Phát hiện reviews không hợp lệ
- Báo cáo chi tiết

### Bước 4: Làm sạch dữ liệu không hợp lệ
```bash
mongosh "mongodb+srv://username:password@cluster.mongodb.net/food_delivery_app" Database/addData/cleanup_invalid_reviews.js
```

**Script này sẽ:**
- Tìm và xóa reviews có orderId không tồn tại
- Reset `isReview = false` cho các orders bị ảnh hưởng
- Báo cáo kết quả cleanup

### Bước 5: Kiểm tra kết quả
```javascript
// Trong mongosh
db = db.getSiblingDB('food_delivery_app');

// Kiểm tra tổng quan
print("=== Kiểm tra kết quả ===");
print("Tổng orders: " + db.orders.countDocuments({}));
print("Orders đã review: " + db.orders.countDocuments({ isReview: true }));
print("Orders chưa review: " + db.orders.countDocuments({ isReview: false }));
print("Tổng reviews: " + db.reviews.countDocuments({}));

// Kiểm tra tính nhất quán
var reviewsWithOrderId = db.reviews.countDocuments({ orderId: { $exists: true, $ne: null } });
var ordersReviewed = db.orders.countDocuments({ isReview: true });
print("Reviews có orderId: " + reviewsWithOrderId);
print("Orders được đánh dấu reviewed: " + ordersReviewed);

// Kiểm tra reviews không có orderId tương ứng
var invalidCount = 0;
db.reviews.find({ orderId: { $exists: true } }).forEach(function(review) {
    var orderExists = db.orders.findOne({ _id: ObjectId(review.orderId) });
    if (!orderExists) {
        invalidCount++;
    }
});
print("Reviews không hợp lệ còn lại: " + invalidCount);
```

## ✅ Kết quả mong đợi

Sau khi chạy xong:
1. ✅ Tất cả orders có trường `isReview`
2. ✅ Chỉ orders thực sự có review được đánh dấu `isReview = true`
3. ✅ Reviews không hợp lệ đã được xóa
4. ✅ Dữ liệu nhất quán giữa orders và reviews
5. ✅ Không có reviews với orderId không tồn tại

## 🚨 Rollback (nếu cần)

Nếu có vấn đề, restore từ backup:
```bash
mongorestore --uri="mongodb+srv://username:password@cluster.mongodb.net/food_delivery_app" --drop backup-YYYYMMDD/
```

## 📊 Monitoring

Sau migration, monitor:
- Số lượng reviews vs orders reviewed phải nhất quán
- Không được có reviews với orderId không tồn tại
- API `/api/orders/userId` phải hiển thị `isReview` chính xác 