# Hướng dẫn Migration Hoàn chỉnh cho Review System

## 🎯 Mục tiêu
1. ✅ Sửa kiểu dữ liệu userId, restaurantId từ String → ObjectId
2. ✅ Thêm trường isReview vào orders
3. ✅ Làm sạch reviews không hợp lệ
4. ✅ Đảm bảo tính nhất quán dữ liệu

## ⚠️ Yêu cầu trước khi bắt đầu
- **BACKUP DATABASE** trước khi thực hiện bất kỳ script nào
- Có quyền truy cập MongoDB với connection string
- Đảm bảo không có user nào đang sử dụng system

## 📋 Các bước thực hiện (PHẢI theo thứ tự)

### Bước 0: Kiểm tra trạng thái hiện tại 🔍
```bash
mongosh "mongodb+srv://username:password@cluster.mongodb.net/food_delivery_app" Database/addData/check_current_status.js
```

**Script này sẽ báo cáo:**
- Kiểu dữ liệu hiện tại trong reviews (String vs ObjectId)
- Số lượng reviews có/chưa có orderId
- Trạng thái trường isReview trong orders
- Khả năng match reviews với orders
- Tình trạng dữ liệu không nhất quán

### Bước 1: Backup Database 🔒
```bash
# Tạo backup với timestamp
mongodump --uri="mongodb+srv://username:password@cluster.mongodb.net/food_delivery_app" --out=backup-$(date +%Y%m%d_%H%M%S)
```

### Bước 2: Sửa kiểu dữ liệu trong Reviews 🔧
```bash
mongosh "mongodb+srv://username:password@cluster.mongodb.net/food_delivery_app" Database/addData/fix_review_data_types.js
```

**Kết quả mong đợi:**
- Tất cả `userId` và `restaurantId` trong reviews đã là ObjectId
- Reviews không hợp lệ được báo cáo để xử lý

### Bước 3: Thêm orderId cho reviews hiện tại 🔗
```bash
mongosh "mongodb+srv://username:password@cluster.mongodb.net/food_delivery_app" Database/addData/add_orderId_to_reviews.js
```

**Script này sẽ:**
- Tìm reviews chưa có orderId
- Match với orders dựa trên userId + restaurantId
- Ưu tiên chọn orders chưa có review (isReview = false)
- Cập nhật orderId cho reviews và isReview cho orders

### Bước 4: Reset trạng thái isReview (nếu cần) 🔄
```javascript
// Chạy trong mongosh nếu đã có dữ liệu isReview cũ cần reset
db = db.getSiblingDB('food_delivery_app');
db.orders.updateMany({}, { $set: { isReview: false } });
print("Đã reset tất cả orders về isReview = false");
```

### Bước 5: Migration isReview 📝
```bash
mongosh "mongodb+srv://username:password@cluster.mongodb.net/food_delivery_app" Database/addData/migration_add_isReview.js
```

**Script này sẽ:**
- Thêm trường `isReview = false` cho tất cả orders
- Cập nhật `isReview = true` cho orders có review (theo orderId chính xác)
- Fallback theo customerId + restaurantId cho reviews cũ
- Báo cáo reviews không hợp lệ

### Bước 6: Làm sạch dữ liệu không hợp lệ 🧹
```bash
mongosh "mongodb+srv://username:password@cluster.mongodb.net/food_delivery_app" Database/addData/cleanup_invalid_reviews.js
```

**Script này sẽ:**
- Xóa reviews có orderId không tồn tại trong orders
- Reset `isReview = false` cho orders bị ảnh hưởng
- Báo cáo kết quả cleanup

### Bước 7: Kiểm tra tính nhất quán cuối cùng ✅
```javascript
// Chạy trong mongosh
db = db.getSiblingDB('food_delivery_app');

print("=== KIỂM TRA CUỐI CÙNG ===");

// 1. Kiểm tra kiểu dữ liệu trong reviews
var stringCount = 0;
var objectIdCount = 0;
db.reviews.find({}).forEach(function(review) {
    if (typeof review.userId === 'string' || typeof review.restaurantId === 'string') {
        stringCount++;
        print("⚠️ Review vẫn có String: " + review._id);
    } else {
        objectIdCount++;
    }
});
print("Reviews có ObjectId đúng: " + objectIdCount);
print("Reviews vẫn có String: " + stringCount);

// 2. Kiểm tra tính nhất quán isReview
var totalOrders = db.orders.countDocuments({});
var reviewedOrders = db.orders.countDocuments({ isReview: true });
var unreviewedOrders = db.orders.countDocuments({ isReview: false });
var totalReviews = db.reviews.countDocuments({});

print("\n=== THỐNG KÊ ===");
print("Tổng orders: " + totalOrders);
print("Orders đã review: " + reviewedOrders);
print("Orders chưa review: " + unreviewedOrders);
print("Tổng reviews: " + totalReviews);

// 3. Kiểm tra reviews orphan (không có order tương ứng)
var orphanCount = 0;
db.reviews.find({}).forEach(function(review) {
    if (review.orderId) {
        var orderExists = db.orders.findOne({ _id: ObjectId(review.orderId) });
        if (!orderExists) {
            orphanCount++;
            print("⚠️ Review orphan: " + review._id + " -> orderId: " + review.orderId);
        }
    }
});
print("Reviews orphan: " + orphanCount);

// 4. Kiểm tra orders có isReview = true nhưng không có review
var inconsistentCount = 0;
db.orders.find({ isReview: true }).forEach(function(order) {
    var reviewExists = db.reviews.findOne({ orderId: order._id.toString() });
    if (!reviewExists) {
        inconsistentCount++;
        print("⚠️ Order có isReview=true nhưng không có review: " + order._id);
    }
});
print("Orders không nhất quán: " + inconsistentCount);

if (stringCount === 0 && orphanCount === 0 && inconsistentCount === 0) {
    print("\n🎉 MIGRATION HOÀN THÀNH THÀNH CÔNG!");
    print("✅ Tất cả dữ liệu đã nhất quán và đúng định dạng");
} else {
    print("\n⚠️ VẪN CÒN VẤN ĐỀ CẦN XỬ LÝ:");
    if (stringCount > 0) print("- " + stringCount + " reviews vẫn có String");
    if (orphanCount > 0) print("- " + orphanCount + " reviews orphan");
    if (inconsistentCount > 0) print("- " + inconsistentCount + " orders không nhất quán");
}
```

## 🚨 Rollback (nếu có vấn đề)

```bash
# Restore từ backup
mongorestore --uri="mongodb+srv://username:password@cluster.mongodb.net/food_delivery_app" --drop backup-YYYYMMDD_HHMMSS/
```

## 📊 Kết quả mong đợi

Sau khi hoàn thành tất cả:

✅ **Reviews Collection:**
- `userId`: ObjectId (không còn String)
- `restaurantId`: ObjectId (không còn String)
- `orderId`: String (nếu có)
- Không có reviews orphan

✅ **Orders Collection:**
- `isReview`: boolean
- `isReview = true` chỉ khi thực sự có review tương ứng
- `isReview = false` cho orders chưa review

✅ **Tính nhất quán:**
- Mỗi review có orderId phải tương ứng với 1 order
- Mỗi order có isReview = true phải có 1 review tương ứng
- Không có dữ liệu orphan hoặc inconsistent

## 🔧 Troubleshooting

**Nếu có lỗi trong quá trình migration:**

1. **Dừng ngay lập tức**
2. **Không chạy scripts tiếp theo**
3. **Kiểm tra error message**
4. **Restore từ backup nếu cần**
5. **Fix lỗi trong script và chạy lại**

**Các lỗi thường gặp:**
- Connection timeout → Tăng timeout hoặc chia nhỏ batch
- Invalid ObjectId → Kiểm tra dữ liệu input
- Permission denied → Kiểm tra quyền user MongoDB

## ✅ Xác nhận hoàn thành

Sau migration, kiểm tra API:
```bash
# Kiểm tra endpoint order history có isReview
curl -H "Authorization: Bearer your-token" "http://localhost:8080/api/orders/userId"

# Kiểm tra endpoint tạo review theo orderId
curl -X POST -H "Authorization: Bearer your-token" \
     -H "Content-Type: application/json" \
     -d '{"userComment":"test","rating":5}' \
     "http://localhost:8080/api/reviews/order/ORDER_ID"
``` 