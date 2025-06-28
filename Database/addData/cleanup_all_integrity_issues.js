// Script để dọn dẹp TẤT CẢ các vấn đề tính toàn vẹn dữ liệu còn lại
// Chạy AFTER cleanup_data_integrity.js

db = db.getSiblingDB('food_delivery_app');

print("=== Dọn dẹp TẤT CẢ vấn đề data integrity còn lại ===");

// Lấy danh sách các ID hợp lệ
print("Chuẩn bị danh sách ID hợp lệ...");
var validUserIds = db.users.distinct("_id");
var validRestaurantIds = db.restaurants.distinct("_id");
var validOrderIds = db.orders.distinct("_id");

print("- Valid users: " + validUserIds.length);
print("- Valid restaurants: " + validRestaurantIds.length);
print("- Valid orders: " + validOrderIds.length);

// ========== CLEANUP REVIEWS ==========
print("\n📝 CLEANUP REVIEWS");

// 1. Reviews có restaurantId không hợp lệ
print("1. Xóa reviews có restaurantId không hợp lệ...");
var invalidRestaurantReviews = db.reviews.find({
    restaurantId: { $nin: validRestaurantIds }
}).toArray();

if (invalidRestaurantReviews.length > 0) {
    print("Tìm thấy " + invalidRestaurantReviews.length + " reviews có restaurantId không hợp lệ");
    var deleteResult1 = db.reviews.deleteMany({
        restaurantId: { $nin: validRestaurantIds }
    });
    print("✅ Đã xóa " + deleteResult1.deletedCount + " reviews");
} else {
    print("✅ Tất cả reviews có restaurantId hợp lệ");
}

// 2. Reviews có orderId không hợp lệ (nếu có)
print("\n2. Xóa reviews có orderId không hợp lệ...");
var invalidOrderReviews = db.reviews.find({
    orderId: { $exists: true, $nin: validOrderIds }
}).toArray();

if (invalidOrderReviews.length > 0) {
    print("Tìm thấy " + invalidOrderReviews.length + " reviews có orderId không hợp lệ");
    var deleteResult2 = db.reviews.deleteMany({
        orderId: { $exists: true, $nin: validOrderIds }
    });
    print("✅ Đã xóa " + deleteResult2.deletedCount + " reviews");
} else {
    print("✅ Tất cả reviews có orderId hợp lệ");
}

// 3. Reviews có userId không hợp lệ
print("\n3. Xóa reviews có userId không hợp lệ...");
var invalidUserReviews = db.reviews.find({
    userId: { $nin: validUserIds }
}).toArray();

if (invalidUserReviews.length > 0) {
    print("Tìm thấy " + invalidUserReviews.length + " reviews có userId không hợp lệ");
    var deleteResult3 = db.reviews.deleteMany({
        userId: { $nin: validUserIds }
    });
    print("✅ Đã xóa " + deleteResult3.deletedCount + " reviews");
} else {
    print("✅ Tất cả reviews có userId hợp lệ");
}

// ========== CLEANUP DISHES ==========
print("\n🍽️  CLEANUP DISHES");

print("Xóa dishes có restaurantId không hợp lệ...");
var invalidRestaurantDishes = db.dishes.find({
    restaurantId: { $nin: validRestaurantIds }
}).toArray();

if (invalidRestaurantDishes.length > 0) {
    print("Tìm thấy " + invalidRestaurantDishes.length + " dishes có restaurantId không hợp lệ");
    var deleteResult4 = db.dishes.deleteMany({
        restaurantId: { $nin: validRestaurantIds }
    });
    print("✅ Đã xóa " + deleteResult4.deletedCount + " dishes");
} else {
    print("✅ Tất cả dishes có restaurantId hợp lệ");
}

// ========== CLEANUP ORDERS (customerId) ==========
print("\n📦 CLEANUP ORDERS (customerId)");

print("Xóa orders có customerId không hợp lệ...");
var invalidCustomerOrders = db.orders.find({
    customerId: { $nin: validUserIds }
}).toArray();

if (invalidCustomerOrders.length > 0) {
    print("Tìm thấy " + invalidCustomerOrders.length + " orders có customerId không hợp lệ");
    var deleteResult5 = db.orders.deleteMany({
        customerId: { $nin: validUserIds }
    });
    print("✅ Đã xóa " + deleteResult5.deletedCount + " orders");
    
    // Cập nhật lại validOrderIds sau khi xóa orders
    validOrderIds = db.orders.distinct("_id");
    print("📋 Cập nhật lại danh sách orders hợp lệ: " + validOrderIds.length);
} else {
    print("✅ Tất cả orders có customerId hợp lệ");
}

// ========== CLEANUP CÁC COLLECTION KHÁC (NẾU CÓ) ==========
print("\n🔍 CLEANUP CÁC COLLECTION KHÁC");

// Cleanup vouchers (nếu có userId/restaurantId)
if (db.vouchers.countDocuments({}) > 0) {
    print("Kiểm tra vouchers...");
    
    // Vouchers có restaurantId không hợp lệ
    var invalidVouchers = db.vouchers.countDocuments({
        restaurantId: { $exists: true, $nin: validRestaurantIds }
    });
    
    if (invalidVouchers > 0) {
        print("Tìm thấy " + invalidVouchers + " vouchers có restaurantId không hợp lệ");
        var deleteResult6 = db.vouchers.deleteMany({
            restaurantId: { $exists: true, $nin: validRestaurantIds }
        });
        print("✅ Đã xóa " + deleteResult6.deletedCount + " vouchers");
    } else {
        print("✅ Vouchers OK");
    }
}

// Cleanup notifications (nếu có userId)
if (db.notifications.countDocuments({}) > 0) {
    print("\nKiểm tra notifications...");
    var invalidNotifications = db.notifications.countDocuments({
        userId: { $exists: true, $nin: validUserIds }
    });
    
    if (invalidNotifications > 0) {
        print("Tìm thấy " + invalidNotifications + " notifications có userId không hợp lệ");
        var deleteResult7 = db.notifications.deleteMany({
            userId: { $exists: true, $nin: validUserIds }
        });
        print("✅ Đã xóa " + deleteResult7.deletedCount + " notifications");
    } else {
        print("✅ Notifications OK");
    }
}

// ========== BÁO CÁO KẾT QUẢ CUỐI CÙNG ==========
print("\n📊 BÁO CÁO KẾT QUẢ CUỐI CÙNG");

// Đếm lại tất cả
var finalCounts = {
    users: db.users.countDocuments({}),
    restaurants: db.restaurants.countDocuments({}),
    orders: db.orders.countDocuments({}),
    dishes: db.dishes.countDocuments({}),
    reviews: db.reviews.countDocuments({}),
    vouchers: db.vouchers.countDocuments({}),
    notifications: db.notifications.countDocuments({})
};

print("Số lượng documents sau cleanup:");
Object.keys(finalCounts).forEach(function(collection) {
    print("- " + collection + ": " + finalCounts[collection]);
});

// Kiểm tra integrity cuối cùng
print("\n🔍 KIỂM TRA INTEGRITY CUỐI CÙNG:");

// Re-check all relationships
var issues = [];

// Orders -> Restaurants
var ordersInvalidRestaurant = db.orders.countDocuments({
    restaurantId: { $nin: db.restaurants.distinct("_id") }
});
if (ordersInvalidRestaurant > 0) issues.push("Orders có restaurantId không hợp lệ: " + ordersInvalidRestaurant);

// Orders -> Users (customers)
var ordersInvalidCustomer = db.orders.countDocuments({
    customerId: { $nin: db.users.distinct("_id") }
});
if (ordersInvalidCustomer > 0) issues.push("Orders có customerId không hợp lệ: " + ordersInvalidCustomer);

// Restaurants -> Users (hosts)
var restaurantsInvalidHost = db.restaurants.countDocuments({
    hostId: { $nin: db.users.distinct("_id") }
});
if (restaurantsInvalidHost > 0) issues.push("Restaurants có hostId không hợp lệ: " + restaurantsInvalidHost);

// Reviews -> Restaurants
var reviewsInvalidRestaurant = db.reviews.countDocuments({
    restaurantId: { $nin: db.restaurants.distinct("_id") }
});
if (reviewsInvalidRestaurant > 0) issues.push("Reviews có restaurantId không hợp lệ: " + reviewsInvalidRestaurant);

// Reviews -> Users
var reviewsInvalidUser = db.reviews.countDocuments({
    userId: { $nin: db.users.distinct("_id") }
});
if (reviewsInvalidUser > 0) issues.push("Reviews có userId không hợp lệ: " + reviewsInvalidUser);

// Dishes -> Restaurants
var dishesInvalidRestaurant = db.dishes.countDocuments({
    restaurantId: { $nin: db.restaurants.distinct("_id") }
});
if (dishesInvalidRestaurant > 0) issues.push("Dishes có restaurantId không hợp lệ: " + dishesInvalidRestaurant);

if (issues.length === 0) {
    print("🎉 HOÀN HẢO! Tất cả dữ liệu đã có tính toàn vẹn!");
    print("✅ Database đã sạch và sẵn sàng sử dụng");
} else {
    print("❌ Vẫn còn một số vấn đề:");
    issues.forEach(function(issue) {
        print("   - " + issue);
    });
}

print("\n=== Script hoàn thành ==="); 