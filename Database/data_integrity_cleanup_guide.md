# Hướng dẫn Dọn dẹp Data Integrity

## 🎯 Mục tiêu
Dọn dẹp tất cả các vấn đề tính toàn vẹn dữ liệu (data integrity) trong database do việc tạo sample data bừa bãi.

## ⚠️ Chuẩn bị trước khi chạy

### 1. Backup Database
```bash
mongodump --db food_delivery_app --out backup_before_cleanup
```

### 2. Kiểm tra trạng thái hiện tại
```bash
mongosh --file Database/addData/check_current_status.js
```

## 🚀 Thứ tự chạy Scripts

### Bước 1: Dọn dẹp chính (Orders & Restaurants)
```bash
mongosh --file Database/addData/cleanup_data_integrity.js
```

**Mục đích:**
- ✅ Xóa orders có `restaurantId` không tồn tại
- ✅ Gán `hostId` hợp lệ (users có role "hostrestaurant") cho restaurants
- ✅ Phát hiện các vấn đề khác

**Kết quả mong đợi:**
- Orders chỉ tham chiếu đến restaurants có thật
- Restaurants có hostId hợp lệ (users thật)

### Bước 2: Dọn dẹp toàn bộ (All collections)  
```bash
mongosh --file Database/addData/cleanup_all_integrity_issues.js
```

**Mục đích:**
- ✅ Xóa reviews có `restaurantId`, `userId`, `orderId` không hợp lệ
- ✅ Xóa dishes có `restaurantId` không hợp lệ  
- ✅ Xóa orders có `customerId` không hợp lệ
- ✅ Xóa vouchers, notifications có references không hợp lệ

**Kết quả mong đợi:**
- Tất cả foreign key references đều hợp lệ
- Database hoàn toàn sạch

### Bước 3: Reset Reviews (nếu cần)
```bash
# Nếu muốn reset lại review system
mongosh --file Database/addData/remove_orderId_from_reviews.js
```

### Bước 4: Fix Review System
```bash
# Chạy theo thứ tự:
mongosh --file Database/addData/fix_review_data_types.js
mongosh --file Database/addData/migration_add_isReview.js  
mongosh --file Database/addData/add_orderId_to_reviews.js
```

## 📊 Kiểm tra kết quả

### Sau mỗi bước:
Script sẽ tự động báo cáo kết quả. Chú ý đến:
- Số lượng documents bị xóa
- Số lượng documents được cập nhật  
- Các vấn đề còn tồn tại

### Kiểm tra cuối cùng:
```bash
mongosh --file Database/addData/check_current_status.js
```

## 🔧 Troubleshooting

### Vấn đề: Không có users role "hostrestaurant"
**Triệu chứng:** Script báo không tìm thấy host users

**Giải pháp:**
```javascript
// Tạo thêm host users
db.users.insertMany([
  {
    email: "host1@example.com",
    name: "Host Restaurant 1", 
    role: "hostrestaurant",
    password: "hashedpassword",
    createdAt: new Date()
  },
  {
    email: "host2@example.com", 
    name: "Host Restaurant 2",
    role: "hostrestaurant", 
    password: "hashedpassword",
    createdAt: new Date()
  }
]);
```

### Vấn đề: Vẫn còn vấn đề integrity sau cleanup
**Triệu chứng:** Script báo còn issues sau khi chạy xong

**Giải pháp:**
1. Chạy lại `cleanup_all_integrity_issues.js`
2. Kiểm tra logs để xem vấn đề cụ thể
3. Tạo script custom cho vấn đề đặc biệt

### Vấn đề: Performance chậm
**Triệu chứng:** Script chạy quá lâu

**Giải pháp:**
```javascript
// Tạo indexes trước khi chạy cleanup
db.orders.createIndex({ restaurantId: 1 });
db.orders.createIndex({ customerId: 1 });
db.reviews.createIndex({ restaurantId: 1 });
db.reviews.createIndex({ userId: 1 }); 
db.reviews.createIndex({ orderId: 1 });
db.dishes.createIndex({ restaurantId: 1 });
db.restaurants.createIndex({ hostId: 1 });
```

## 📈 Kết quả mong đợi

Sau khi hoàn thành, database sẽ có:

### ✅ Data Integrity hoàn hảo:
- `orders.restaurantId` → `restaurants._id` ✓
- `orders.customerId` → `users._id` ✓  
- `restaurants.hostId` → `users._id` (role: hostrestaurant) ✓
- `reviews.restaurantId` → `restaurants._id` ✓
- `reviews.userId` → `users._id` ✓
- `reviews.orderId` → `orders._id` ✓
- `dishes.restaurantId` → `restaurants._id` ✓

### ✅ Review System chuẩn:
- Mỗi order có thể có 1 review (`isReview` field)
- Reviews có `orderId` dạng ObjectId
- `userId`, `restaurantId` trong reviews đều là ObjectId

### ✅ Database sạch sẽ:
- Không còn "orphaned" documents
- Tất cả references đều hợp lệ
- Sẵn sàng cho production

## 🔄 Rollback (nếu cần)

Nếu có vấn đề, restore từ backup:

```bash
# Xóa database hiện tại
mongosh --eval "db.getSiblingDB('food_delivery_app').dropDatabase()"

# Restore từ backup  
mongorestore --db food_delivery_app backup_before_cleanup/food_delivery_app/
```

## 📝 Notes

- **Luôn backup** trước khi chạy cleanup
- **Chạy tuần tự** theo đúng thứ tự
- **Kiểm tra kết quả** sau mỗi bước
- **Test application** sau khi cleanup xong
- Scripts được thiết kế **idempotent** (có thể chạy nhiều lần an toàn) 