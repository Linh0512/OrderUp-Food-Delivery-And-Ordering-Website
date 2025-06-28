# Hướng dẫn Fix Lỗi Voucher API

## 🔥 Vấn đề

API voucher bị lỗi do 2 nguyên nhân chính:
1. **Repository Generic Type Mismatch**: VoucherRepository<Voucher, String> nhưng entity dùng ObjectId
2. **Database Schema Corruption**: `remainingValue` bị lưu thành Date object thay vì int

## ✅ Giải pháp đã thực hiện

### 1. Sửa Code
- ✅ Đổi Voucher entity từ `ObjectId id` thành `String id`
- ✅ Thêm null check trong `updateActiveStatus()`
- ✅ Loại bỏ auto-save khi get voucher detail để tránh schema validation error
- ✅ Chỉ update status in-memory cho read operations

### 2. Fix Database

#### Bước 1: Fix dữ liệu bị corrupt
```bash
# Mở MongoDB Compass hoặc mongo shell, chạy script:
Database/addData/fix_voucher_remaining_value.js
```

#### Bước 2: Thêm sample data để test  
```bash
# Chạy script để thêm voucher mẫu:
Database/addData/add_sample_vouchers.js
```

## 🧪 Test APIs

### 1. Test lấy voucher cho restaurant
```http
GET /api/user/vouchers/restaurant/68478ebc07b8f321562a659e
Authorization: Bearer {your_token}
```

**Kết quả mong đợi**: 
- 2 voucher GLOBAL (GLOBAL10, GLOBAL20) 
- 1 voucher LOCAL (LOCAL5K) cho restaurant này
- Không có voucher hết hạn hoặc hết số lượng

### 2. Test lấy detail voucher
```http  
GET /api/user/vouchers/{voucherId}
Authorization: Bearer {your_token}
```

**Kết quả mong đợi**: Trả về voucher detail không lỗi

### 3. Debug console log
Trong console sẽ thấy:
```
=== DEBUG: Total vouchers in DB: 5
Voucher: GLOBAL10, Type: GLOBAL, IsActive: true, RemainingValue: 100...
Voucher: GLOBAL20, Type: GLOBAL, IsActive: true, RemainingValue: 50...
Voucher: LOCAL5K, Type: LOCAL, IsActive: true, RemainingValue: 25...
Voucher: EXPIRED10, Type: GLOBAL, IsActive: false, RemainingValue: 30...
Voucher: OUTOFSTOCK, Type: GLOBAL, IsActive: false, RemainingValue: 0...
=== DEBUG: Filtered vouchers count: 3
```

## 🚨 Nếu vẫn có lỗi

### Kiểm tra MongoDB connection string
Đảm bảo database name đúng trong `application.properties`:
```properties
spring.data.mongodb.uri=mongodb+srv://...../orderup
```

### Kiểm tra collection name
Voucher entity mapping:
```java
@Document(collection = "vouchers")
```

### Clean database (nếu cần)
```javascript
// Trong MongoDB Compass/shell:
use('orderup');
db.vouchers.deleteMany({});
// Sau đó chạy lại add_sample_vouchers.js
```

## 📝 Response Format Mới

Với các thay đổi này, API sẽ trả về:

```json
{
  "count": 3,
  "data": [
    {
      "id": "67711234567890abcdef1234",
      "code": "GLOBAL10", 
      "value": 10000,
      "type": "GLOBAL",
      "restaurantId": null,
      "minimumOrderAmount": 50000,
      "expiresAt": "2025-07-28",
      "remainingValue": 100,
      "isActive": true
    },
    // ... more vouchers
  ]
}
```

## 🎯 Checklist

- [ ] Chạy `fix_voucher_remaining_value.js` 
- [ ] Chạy `add_sample_vouchers.js`
- [ ] Test API `/api/user/vouchers/restaurant/{restaurantId}`
- [ ] Test API `/api/user/vouchers/{voucherId}` 
- [ ] Kiểm tra console log không còn error
- [ ] Verify response data đúng format

Nếu tất cả checklist ✅, voucher API sẽ hoạt động bình thường! 🚀 