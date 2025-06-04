// ====================================
// VÍ DỤ QUERIES CHO FOOD DELIVERY APP
// ====================================

// Kết nối database
use('food_delivery_app');

print("📋 Các ví dụ queries thường dùng cho Food Delivery App");

// ====================================
// 1. USER MANAGEMENT QUERIES
// ====================================
print("\n👥 === USER MANAGEMENT QUERIES ===");

// Tìm user theo email
print("1. Tìm user theo email:");
db.users.findOne({ email: "john.doe@gmail.com" });

// Tìm tất cả restaurant hosts
print("2. Tìm tất cả restaurant hosts:");
db.users.find({ role: "restaurantHost", isActive: true });

// Cập nhật thông tin profile user
print("3. Cập nhật profile user:");
db.users.updateOne(
  { email: "john.doe@gmail.com" },
  { 
    $set: { 
      "profile.phone": "0912345679",
      "updatedAt": new Date()
    }
  }
);

// Thêm địa chỉ mới cho user
print("4. Thêm địa chỉ mới:");
db.users.updateOne(
  { email: "john.doe@gmail.com" },
  {
    $push: {
      addresses: {
        _id: new ObjectId(),
        title: "Công ty",
        fullAddress: "999 Lê Văn Việt, Quận 9, TP.HCM",
        district: "Quận 9",
        city: "TP.HCM",
        isDefault: false,
        coordinates: { lat: 10.8504, lng: 106.7718 }
      }
    }
  }
);

// ====================================
// 2. RESTAURANT QUERIES
// ====================================
print("\n🏪 === RESTAURANT QUERIES ===");

// Tìm nhà hàng gần vị trí (geospatial query)
print("1. Tìm nhà hàng gần vị trí:");
db.restaurants.find({
  "address.coordinates": {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [106.7014, 10.7758] // lng, lat
      },
      $maxDistance: 5000 // 5km
    }
  },
  isActive: true,
  isVerified: true
});

// Tìm nhà hàng theo cuisine type
print("2. Tìm nhà hàng theo loại cuisine:");
db.restaurants.find({ 
  "businessInfo.cuisineTypes": "italian",
  isActive: true 
});

// Tìm nhà hàng có rating cao
print("3. Tìm nhà hàng có rating > 4.0:");
db.restaurants.find({ 
  "ratings.averageRating": { $gte: 4.0 },
  isActive: true 
}).sort({ "ratings.averageRating": -1 });

// Text search nhà hàng
print("4. Tìm kiếm nhà hàng theo tên:");
db.restaurants.find({
  $text: { $search: "pizza" },
  isActive: true
});

// ====================================
// 3. DISH QUERIES
// ====================================
print("\n🍕 === DISH QUERIES ===");

// Tìm món ăn của một nhà hàng
print("1. Tìm món ăn của nhà hàng:");
db.dishes.find({ 
  restaurantId: ObjectId("restaurant_001000000000"),
  isActive: true,
  "availability.isAvailable": true 
});

// Tìm món ăn theo category
print("2. Tìm món ăn theo category:");
db.dishes.find({ 
  categoryId: ObjectId("subcat_pizza000000000"),
  isActive: true 
});

// Tìm món ăn trong khoảng giá
print("3. Tìm món ăn trong khoảng giá:");
db.dishes.find({
  "pricing.basePrice": { $gte: 100000, $lte: 300000 },
  isActive: true
});

// Tìm món ăn bestseller
print("4. Tìm món ăn bestseller:");
db.dishes.find({ 
  "basicInfo.tags": "bestseller",
  isActive: true 
}).sort({ "stats.totalOrders": -1 });

// ====================================
// 4. ORDER QUERIES
// ====================================
print("\n📦 === ORDER QUERIES ===");

// Tìm đơn hàng của customer
print("1. Tìm đơn hàng của customer:");
db.orders.find({ 
  customerId: ObjectId("customer_001000000000") 
}).sort({ createdAt: -1 });

// Tìm đơn hàng của nhà hàng
print("2. Tìm đơn hàng của nhà hàng:");
db.orders.find({ 
  restaurantId: ObjectId("restaurant_001000000000") 
}).sort({ createdAt: -1 });

// Tìm đơn hàng theo status
print("3. Tìm đơn hàng đang giao:");
db.orders.find({ 
  "status.current": "delivering" 
});

// Thống kê doanh thu theo ngày
print("4. Thống kê doanh thu theo ngày:");
db.orders.aggregate([
  {
    $match: {
      "status.current": "delivered",
      createdAt: {
        $gte: new Date("2024-03-01"),
        $lte: new Date("2024-03-31")
      }
    }
  },
  {
    $group: {
      _id: {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
        day: { $dayOfMonth: "$createdAt" }
      },
      totalOrders: { $sum: 1 },
      totalRevenue: { $sum: "$orderDetails.totalAmount" },
      avgOrderValue: { $avg: "$orderDetails.totalAmount" }
    }
  },
  {
    $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 }
  }
]);

// ====================================
// 5. REVIEW QUERIES
// ====================================
print("\n⭐ === REVIEW QUERIES ===");

// Tìm reviews của nhà hàng
print("1. Tìm reviews của nhà hàng:");
db.reviews.find({ 
  restaurantId: ObjectId("restaurant_001000000000"),
  isActive: true 
}).sort({ createdAt: -1 });

// Tìm reviews có rating cao
print("2. Tìm reviews có rating >= 4:");
db.reviews.find({ 
  "restaurantReview.rating": { $gte: 4 },
  isActive: true 
});

// Thống kê rating của nhà hàng
print("3. Thống kê rating của nhà hàng:");
db.reviews.aggregate([
  {
    $match: { 
      restaurantId: ObjectId("restaurant_001000000000"),
      isActive: true 
    }
  },
  {
    $group: {
      _id: "$restaurantId",
      averageRating: { $avg: "$restaurantReview.rating" },
      totalReviews: { $sum: 1 },
      ratings: { $push: "$restaurantReview.rating" }
    }
  }
]);

// ====================================
// 6. PROMOTION & VOUCHER QUERIES
// ====================================
print("\n🎫 === PROMOTION & VOUCHER QUERIES ===");

// Tìm promotions đang active
print("1. Tìm promotions đang active:");
db.promotions.find({
  status: "active",
  isActive: true,
  "schedule.startDate": { $lte: new Date() },
  "schedule.endDate": { $gte: new Date() }
});

// Tìm vouchers của user chưa sử dụng
print("2. Tìm vouchers chưa sử dụng của user:");
db.vouchers.find({
  userId: ObjectId("customer_001000000000"),
  "usage.isUsed": false,
  "validity.isActive": true,
  "validity.expiresAt": { $gte: new Date() }
});

// ====================================
// 7. DRIVER QUERIES
// ====================================
print("\n🚗 === DRIVER QUERIES ===");

// Tìm drivers đang online và available
print("1. Tìm drivers available:");
db.drivers.find({
  "status.isOnline": true,
  "status.isAvailable": true,
  "status.isVerified": true,
  isActive: true
});

// Tìm driver gần vị trí pickup
print("2. Tìm driver gần vị trí:");
db.drivers.find({
  "status.currentLocation": {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [106.7058, 10.7745]
      },
      $maxDistance: 3000 // 3km
    }
  },
  "status.isOnline": true,
  "status.isAvailable": true
});

// ====================================
// 8. ANALYTICS QUERIES
// ====================================
print("\n📊 === ANALYTICS QUERIES ===");

// Top nhà hàng theo doanh thu
print("1. Top nhà hàng theo doanh thu:");
db.orders.aggregate([
  {
    $match: { "status.current": "delivered" }
  },
  {
    $group: {
      _id: "$restaurantId",
      totalOrders: { $sum: 1 },
      totalRevenue: { $sum: "$orderDetails.totalAmount" }
    }
  },
  {
    $lookup: {
      from: "restaurants",
      localField: "_id",
      foreignField: "_id",
      as: "restaurant"
    }
  },
  {
    $unwind: "$restaurant"
  },
  {
    $project: {
      restaurantName: "$restaurant.basicInfo.name",
      totalOrders: 1,
      totalRevenue: 1
    }
  },
  {
    $sort: { totalRevenue: -1 }
  },
  {
    $limit: 10
  }
]);

// Top món ăn bán chạy
print("2. Top món ăn bán chạy:");
db.orders.aggregate([
  {
    $match: { "status.current": "delivered" }
  },
  {
    $unwind: "$orderDetails.items"
  },
  {
    $group: {
      _id: "$orderDetails.items.dishId",
      dishName: { $first: "$orderDetails.items.dishName" },
      totalQuantity: { $sum: "$orderDetails.items.quantity" },
      totalRevenue: { $sum: "$orderDetails.items.subtotal" }
    }
  },
  {
    $sort: { totalQuantity: -1 }
  },
  {
    $limit: 10
  }
]);

// ====================================
// 9. NOTIFICATION QUERIES
// ====================================
print("\n🔔 === NOTIFICATION QUERIES ===");

// Tìm notifications chưa đọc của user
print("1. Tìm notifications chưa đọc:");
db.notifications.find({
  recipientId: ObjectId("customer_001000000000"),
  "interaction.isRead": false,
  isActive: true
}).sort({ createdAt: -1 });

// Mark notification as read
print("2. Đánh dấu notification đã đọc:");
db.notifications.updateOne(
  { _id: ObjectId("notif_001000000000000") },
  {
    $set: {
      "interaction.isRead": true,
      "interaction.readAt": new Date()
    }
  }
);

// ====================================
// 10. COMPLEX AGGREGATION QUERIES
// ====================================
print("\n🔍 === COMPLEX AGGREGATION QUERIES ===");

// Dashboard stats cho admin
print("1. Dashboard stats cho admin:");
db.orders.aggregate([
  {
    $facet: {
      totalStats: [
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: "$orderDetails.totalAmount" },
            avgOrderValue: { $avg: "$orderDetails.totalAmount" }
          }
        }
      ],
      statusBreakdown: [
        {
          $group: {
            _id: "$status.current",
            count: { $sum: 1 }
          }
        }
      ],
      recentOrders: [
        {
          $sort: { createdAt: -1 }
        },
        {
          $limit: 5
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
          $lookup: {
            from: "restaurants",
            localField: "restaurantId",
            foreignField: "_id", 
            as: "restaurant"
          }
        }
      ]
    }
  }
]);

// Restaurant performance report
print("2. Restaurant performance report:");
db.restaurants.aggregate([
  {
    $lookup: {
      from: "orders",
      localField: "_id",
      foreignField: "restaurantId",
      as: "orders"
    }
  },
  {
    $lookup: {
      from: "reviews", 
      localField: "_id",
      foreignField: "restaurantId",
      as: "reviews"
    }
  },
  {
    $project: {
      name: "$basicInfo.name",
      totalOrders: { $size: "$orders" },
      completedOrders: {
        $size: {
          $filter: {
            input: "$orders",
            cond: { $eq: ["$$this.status.current", "delivered"] }
          }
        }
      },
      totalRevenue: {
        $sum: {
          $map: {
            input: {
              $filter: {
                input: "$orders",
                cond: { $eq: ["$$this.status.current", "delivered"] }
              }
            },
            as: "order",
            in: "$$order.orderDetails.totalAmount"
          }
        }
      },
      avgRating: { $avg: "$reviews.restaurantReview.rating" },
      totalReviews: { $size: "$reviews" }
    }
  },
  {
    $sort: { totalRevenue: -1 }
  }
]);

print("\n✅ Tất cả ví dụ queries đã hoàn thành!");
print("💡 Tip: Chạy từng query riêng lẻ để test và hiểu rõ hơn");
print("💡 Tip: Sử dụng .explain() để xem query execution plan");
print("💡 Tip: Tạo indexes phù hợp cho các queries thường xuyên sử dụng"); 