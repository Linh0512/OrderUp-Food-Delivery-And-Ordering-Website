# HƯỚNG DẪN CÀI ĐẶT VÀ SỬ DỤNG MONGODB

## 1. CÀI ĐẶT MONGODB

### Cài đặt MongoDB Community Server

**Windows:**
1. Tải MongoDB Community Server từ: https://www.mongodb.com/try/download/community
2. Chạy file .msi và làm theo hướng dẫn
3. Chọn "Complete" installation
4. Cài đặt MongoDB Compass (GUI tool) - optional nhưng recommended

**macOS:**
```bash
# Sử dụng Homebrew
brew tap mongodb/brew
brew install mongodb-community
```

**Ubuntu/Debian:**
```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file for MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org
```

### Khởi động MongoDB

**Windows:**
```cmd
# Khởi động MongoDB service
net start MongoDB

# Hoặc chạy mongod trực tiếp
mongod --dbpath "C:\data\db"
```

**macOS/Linux:**
```bash
# Khởi động MongoDB service
sudo systemctl start mongod

# Hoặc chạy mongod trực tiếp
mongod --dbpath /data/db
```

### Kết nối MongoDB

```bash
# Mở MongoDB Shell
mongo

# Hoặc với MongoDB 6.0+
mongosh
```

---

## 2. TẠO DATABASE VÀ COLLECTIONS

### Kết nối và tạo database

```javascript
// Kết nối MongoDB Shell
use food_delivery_app

// Kiểm tra database hiện tại
db

// Xem danh sách databases
show dbs

// Xem danh sách collections
show collections
```

### Tạo collections với validation

```javascript
// Tạo collection users với validation
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "password", "role"],
      properties: {
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$",
          description: "Email must be a valid email address"
        },
        role: {
          enum: ["user", "restaurantHost", "admin"],
          description: "Role must be one of: user, restaurantHost, admin"
        }
      }
    }
  }
})

// Tương tự cho các collections khác
db.createCollection("restaurants")
db.createCollection("categories")
db.createCollection("dishes")
db.createCollection("orders")
db.createCollection("reviews")
db.createCollection("promotions")
db.createCollection("drivers")
db.createCollection("deliveries")
db.createCollection("notifications")
db.createCollection("support_tickets")
db.createCollection("blogs")
db.createCollection("vouchers")
db.createCollection("analytics")
db.createCollection("app_settings")
```

---

## 3. THAO TÁC CƠ BẢN VỚI MONGODB

### CREATE - Thêm dữ liệu

```javascript
// Thêm một document
db.users.insertOne({
  email: "user@example.com",
  password: "hashed_password",
  role: "user"
})

// Thêm nhiều documents
db.users.insertMany([
  { email: "user1@example.com", role: "user" },
  { email: "user2@example.com", role: "restaurantHost" }
])
```

### READ - Đọc dữ liệu

```javascript
// Tìm tất cả documents
db.users.find()

// Tìm với điều kiện
db.users.find({ role: "user" })

// Tìm một document
db.users.findOne({ email: "user@example.com" })

// Tìm với projection (chỉ lấy fields cần thiết)
db.users.find({}, { email: 1, role: 1, _id: 0 })

// Tìm với sort và limit
db.users.find().sort({ createdAt: -1 }).limit(10)

// Tìm với regex
db.restaurants.find({ "basicInfo.name": /pizza/i })
```

### UPDATE - Cập nhật dữ liệu

```javascript
// Cập nhật một document
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { "profile.firstName": "John" } }
)

// Cập nhật nhiều documents
db.users.updateMany(
  { role: "user" },
  { $set: { isActive: true } }
)

// Upsert (insert nếu không tồn tại)
db.users.updateOne(
  { email: "newuser@example.com" },
  { $set: { role: "user" } },
  { upsert: true }
)
```

### DELETE - Xóa dữ liệu

```javascript
// Xóa một document
db.users.deleteOne({ email: "user@example.com" })

// Xóa nhiều documents
db.users.deleteMany({ isActive: false })
```

---

## 4. QUERIES NÂNG CAO

### Aggregation Pipeline

```javascript
// Thống kê đơn hàng theo nhà hàng
db.orders.aggregate([
  {
    $group: {
      _id: "$restaurantId",
      totalOrders: { $sum: 1 },
      totalRevenue: { $sum: "$orderDetails.totalAmount" },
      avgOrderValue: { $avg: "$orderDetails.totalAmount" }
    }
  },
  {
    $sort: { totalRevenue: -1 }
  }
])

// Join dữ liệu từ nhiều collections
db.orders.aggregate([
  {
    $lookup: {
      from: "restaurants",
      localField: "restaurantId",
      foreignField: "_id",
      as: "restaurant"
    }
  },
  {
    $lookup: {
      from: "users",
      localField: "customerId",
      foreignField: "_id",
      as: "customer"
    }
  },
  {
    $unwind: "$restaurant"
  },
  {
    $unwind: "$customer"
  }
])
```

### Text Search

```javascript
// Tạo text index
db.restaurants.createIndex({ 
  "basicInfo.name": "text", 
  "basicInfo.description": "text" 
})

// Tìm kiếm text
db.restaurants.find({
  $text: { $search: "pizza italian" }
})
```

### Geospatial Queries

```javascript
// Tạo 2dsphere index cho location
db.restaurants.createIndex({ "address.coordinates": "2dsphere" })

// Tìm nhà hàng gần vị trí
db.restaurants.find({
  "address.coordinates": {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [106.6297, 10.8231] // longitude, latitude
      },
      $maxDistance: 5000 // 5km
    }
  }
})
```

---

## 5. BACKUP VÀ RESTORE

### Backup Database

```bash
# Backup toàn bộ database
mongodump --db food_delivery_app --out ./backup

# Backup một collection cụ thể
mongodump --db food_delivery_app --collection users --out ./backup

# Backup với authentication
mongodump --host localhost:27017 --username admin --password password --db food_delivery_app --out ./backup
```

### Restore Database

```bash
# Restore toàn bộ database
mongorestore --db food_delivery_app ./backup/food_delivery_app

# Restore một collection cụ thể
mongorestore --db food_delivery_app --collection users ./backup/food_delivery_app/users.bson
```

---

## 6. MONITORING VÀ PERFORMANCE

### Kiểm tra Performance

```javascript
// Explain query execution
db.users.find({ email: "user@example.com" }).explain("executionStats")

// Kiểm tra indexes
db.users.getIndexes()

// Stats của collection
db.users.stats()

// Stats của database
db.stats()
```

### Monitoring Commands

```javascript
// Kiểm tra current operations
db.currentOp()

// Kiểm tra server status
db.serverStatus()

// Profiling queries
db.setProfilingLevel(2) // Log all operations
db.system.profile.find().sort({ ts: -1 }).limit(5)
```

---

## 7. SECURITY

### Tạo User với Roles

```javascript
// Chuyển sang admin database
use admin

// Tạo admin user
db.createUser({
  user: "admin",
  pwd: "admin_password",
  roles: [
    { role: "root", db: "admin" }
  ]
})

// Tạo user cho app
use food_delivery_app
db.createUser({
  user: "app_user",
  pwd: "app_password",
  roles: [
    { role: "readWrite", db: "food_delivery_app" }
  ]
})
```

### Connection String với Authentication

```javascript
// Connection string format
mongodb://username:password@host:port/database

// Ví dụ
mongodb://app_user:app_password@localhost:27017/food_delivery_app
```

---

## 8. MONGODB COMPASS (GUI TOOL)

MongoDB Compass là GUI tool chính thức của MongoDB, rất hữu ích cho:

- **Visual query building**: Tạo queries bằng GUI
- **Real-time performance metrics**: Theo dõi performance
- **Index management**: Quản lý indexes
- **Data visualization**: Xem dữ liệu dưới dạng charts
- **Schema analysis**: Phân tích cấu trúc dữ liệu

### Kết nối Compass:
1. Mở MongoDB Compass
2. Nhập connection string: `mongodb://localhost:27017`
3. Click "Connect"

---

## 9. BEST PRACTICES

### Schema Design
- **Embed vs Reference**: Embed cho dữ liệu nhỏ, reference cho dữ liệu lớn
- **Denormalization**: Duplicate dữ liệu khi cần thiết cho performance
- **Array size limits**: Tránh arrays quá lớn (>16MB)

### Performance
- **Indexes**: Tạo indexes cho các fields thường query
- **Projection**: Chỉ lấy fields cần thiết
- **Limit results**: Sử dụng limit() và skip() hợp lý
- **Connection pooling**: Sử dụng connection pool trong application

### Security
- **Authentication**: Luôn enable authentication
- **Authorization**: Sử dụng role-based access control
- **Network security**: Bind IP và sử dụng TLS
- **Regular updates**: Update MongoDB thường xuyên

---

## 10. TROUBLESHOOTING

### Các lỗi thường gặp:

**Connection refused:**
```bash
# Kiểm tra MongoDB service có chạy không
sudo systemctl status mongod

# Khởi động service
sudo systemctl start mongod
```

**Authentication failed:**
```javascript
// Kiểm tra user tồn tại
use admin
db.system.users.find()
```

**Performance issues:**
```javascript
// Kiểm tra slow queries
db.setProfilingLevel(2, { slowms: 100 })
db.system.profile.find().sort({ ts: -1 })
```

**Disk space:**
```bash
# Kiểm tra disk usage
du -sh /data/db/*

# Compact database
db.runCommand({ compact: "collection_name" })
``` 