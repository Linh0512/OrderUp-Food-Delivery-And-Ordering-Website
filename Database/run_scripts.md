# HƯỚNG DẪN CHẠY SCRIPTS MONGODB

## 📋 TỔNG QUAN

Thư mục này chứa các scripts MongoDB để khởi tạo và quản lý database cho ứng dụng Food Delivery:

1. **`mongodb_setup_guide.md`** - Hướng dẫn cài đặt và sử dụng MongoDB
2. **`create_indexes.js`** - Script tạo indexes cho performance
3. **`sample_data.js`** - Script khởi tạo sample data
4. **`query_examples.js`** - Ví dụ các queries thường dùng
5. **`database_design.md`** - Thiết kế database chi tiết

---

## 🚀 CÁCH CHẠY SCRIPTS

### Bước 1: Cài đặt MongoDB
Làm theo hướng dẫn trong `mongodb_setup_guide.md`

### Bước 2: Khởi động MongoDB
```bash
# Windows
net start MongoDB

# macOS/Linux  
sudo systemctl start mongod

# Hoặc chạy trực tiếp
mongod --dbpath /path/to/data/db
```

### Bước 3: Kết nối MongoDB Shell
```bash
# MongoDB Shell cũ
mongo

# MongoDB Shell mới (6.0+)
mongosh
```

### Bước 4: Chạy Scripts theo thứ tự

#### 4.1 Tạo Sample Data
```bash
# Trong MongoDB Shell
load('sample_data.js')

# Hoặc từ command line
mongosh food_delivery_app sample_data.js
```

#### 4.2 Tạo Indexes
```bash
# Trong MongoDB Shell
load('create_indexes.js')

# Hoặc từ command line
mongosh food_delivery_app create_indexes.js
```

#### 4.3 Test với Query Examples
```bash
# Trong MongoDB Shell
load('query_examples.js')

# Hoặc từ command line
mongosh food_delivery_app query_examples.js
```

---

## 🔧 SCRIPTS CHI TIẾT

### 1. Sample Data Script (`sample_data.js`)

**Mục đích**: Tạo dữ liệu mẫu cho tất cả collections

**Dữ liệu tạo**:
- ✅ 1 Admin user
- ✅ 1 Restaurant host 
- ✅ 2 Customer users
- ✅ 1 Nhà hàng (Pizza House Saigon)
- ✅ 5 Categories (FastFood, Món Việt, Đồ uống + subcategories)
- ✅ 2 Món ăn (Pizza Margherita, Pizza Pepperoni)
- ✅ 1 Tài xế giao hàng
- ✅ 1 Đơn hàng hoàn thành
- ✅ 1 Review
- ✅ 1 Promotion & Voucher
- ✅ Sample notifications, blogs, analytics
- ✅ App settings

**Cách chạy**:
```javascript
// Kết nối database
use food_delivery_app

// Chạy script
load('sample_data.js')

// Kiểm tra dữ liệu đã tạo
show collections
db.users.count()
db.restaurants.count()
```

### 2. Create Indexes Script (`create_indexes.js`)

**Mục đích**: Tạo tất cả indexes cần thiết cho performance

**Indexes tạo**:
- 📊 Users: email (unique), role, isActive
- 🏪 Restaurants: location (2dsphere), text search, ratings
- 🍕 Dishes: restaurant, category, text search
- 📦 Orders: customer, restaurant, status, dates
- ⭐ Reviews: restaurant, customer, ratings
- 🎫 Promotions: code (unique), schedule
- 🚗 Drivers: phone (unique), location, availability
- 🔔 Notifications: recipient, read status
- Và nhiều indexes khác...

**Cách chạy**:
```javascript
use food_delivery_app
load('create_indexes.js')

// Kiểm tra indexes đã tạo
db.users.getIndexes()
db.restaurants.getIndexes()
```

### 3. Query Examples Script (`query_examples.js`)

**Mục đích**: Cung cấp ví dụ queries thường dùng

**Bao gồm**:
- 👥 User management queries
- 🏪 Restaurant search & filtering
- 🍕 Dish queries với price ranges
- 📦 Order tracking & analytics
- ⭐ Review aggregations
- 🎫 Promotion & voucher management
- 🚗 Driver location queries
- 📊 Complex analytics aggregations

**Cách chạy**:
```javascript
use food_delivery_app
load('query_examples.js')

// Hoặc chạy từng query riêng lẻ để test
```

---

## 📝 KIỂM TRA KẾT QUẢ

### Sau khi chạy Sample Data:
```javascript
// Kiểm tra số lượng documents
db.users.count()          // Should return 4
db.restaurants.count()    // Should return 1  
db.dishes.count()         // Should return 2
db.orders.count()         // Should return 1
db.categories.count()     // Should return 5

// Kiểm tra dữ liệu cụ thể
db.users.find({}, {email: 1, role: 1})
db.restaurants.find({}, {basicInfo: 1})
```

### Sau khi chạy Indexes:
```javascript
// Kiểm tra indexes
db.users.getIndexes().length        // Should be > 1
db.restaurants.getIndexes().length  // Should be > 1

// Test text search
db.restaurants.find({$text: {$search: "pizza"}})
```

### Test Performance:
```javascript
// Kiểm tra query execution với indexes
db.users.find({email: "john.doe@gmail.com"}).explain("executionStats")

// Geospatial query test
db.restaurants.find({
  "address.coordinates": {
    $near: {
      $geometry: {type: "Point", coordinates: [106.7058, 10.7745]},
      $maxDistance: 5000
    }
  }
})
```

---

## 🛠️ TROUBLESHOOTING

### Lỗi thường gặp:

**1. "Database/Collection không tồn tại"**
```javascript
// Tạo database và collections trước
use food_delivery_app
db.createCollection("users")
```

**2. "Index creation failed"** 
```javascript
// Xóa indexes cũ nếu cần
db.collection.dropIndexes()
// Sau đó chạy lại create_indexes.js
```

**3. "Geospatial queries không hoạt động"**
```javascript
// Đảm bảo đã tạo 2dsphere index
db.restaurants.createIndex({"address.coordinates": "2dsphere"})
```

**4. "Text search không tìm thấy kết quả"**
```javascript
// Kiểm tra text index đã được tạo
db.restaurants.getIndexes()
// Tạo text index nếu chưa có
db.restaurants.createIndex({
  "basicInfo.name": "text",
  "basicInfo.description": "text"
})
```

### Performance Issues:
```javascript
// Bật profiling để debug slow queries
db.setProfilingLevel(2, {slowms: 100})

// Xem slow queries
db.system.profile.find().sort({ts: -1}).limit(5)

// Kiểm tra query execution plan
db.collection.find({}).explain("executionStats")
```

---

## 📊 MONITORING

### Kiểm tra Database Health:
```javascript
// Database stats
db.stats()

// Collection stats
db.users.stats()
db.orders.stats()

// Index usage stats
db.users.aggregate([{$indexStats: {}}])
```

### Backup Database:
```bash
# Backup toàn bộ database
mongodump --db food_delivery_app --out ./backup

# Restore từ backup
mongorestore --db food_delivery_app ./backup/food_delivery_app
```

---

## 🎯 NEXT STEPS

Sau khi hoàn thành setup:

1. **Kết nối từ Application**: 
   - Connection string: `mongodb://localhost:27017/food_delivery_app`
   - Hoặc với authentication: `mongodb://username:password@localhost:27017/food_delivery_app`

2. **Production Considerations**:
   - Enable authentication
   - Setup replica sets cho high availability
   - Configure backup strategy
   - Monitor performance metrics

3. **Development Workflow**:
   - Sử dụng MongoDB Compass để visualize data
   - Test APIs với sample data
   - Optimize queries based on usage patterns

---

## 📞 SUPPORT

Nếu gặp vấn đề:
1. Kiểm tra MongoDB logs
2. Verify connection strings
3. Ensure MongoDB service is running
4. Check firewall/network settings
5. Validate script syntax

**Useful Commands**:
```bash
# Check MongoDB status
systemctl status mongod

# View MongoDB logs  
tail -f /var/log/mongodb/mongod.log

# Check listening ports
netstat -tlnp | grep :27017
``` 