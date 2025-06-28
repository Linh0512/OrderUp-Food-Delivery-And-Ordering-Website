// Script để dọn dẹp tính toàn vẹn dữ liệu
// 1. Xóa orders có restaurantId không tồn tại trong restaurants
// 2. Fix hostId trong restaurants bằng users có role hostrestaurant

db = db.getSiblingDB('food_delivery_app');

print("=== Dọn dẹp tính toàn vẹn dữ liệu ===");

// ========== PHẦN 1: CLEANUP ORDERS ==========
print("\n📋 PHẦN 1: XÓA ORDERS CÓ RESTAURANT KHÔNG TỒN TẠI");

// Bước 1.1: Lấy danh sách tất cả restaurantId hợp lệ
print("Bước 1.1: Lấy danh sách restaurants hợp lệ...");
var validRestaurantIds = db.restaurants.distinct("_id");
print("Tìm thấy " + validRestaurantIds.length + " restaurants hợp lệ");

// Bước 1.2: Tìm orders có restaurantId không hợp lệ
print("\nBước 1.2: Tìm orders có restaurantId không hợp lệ...");
var invalidOrders = db.orders.find({
    restaurantId: { $nin: validRestaurantIds }
}).toArray();

print("Tìm thấy " + invalidOrders.length + " orders có restaurantId không hợp lệ");

if (invalidOrders.length > 0) {
    print("\nDanh sách orders sẽ bị xóa:");
    invalidOrders.forEach(function(order) {
        print("- Order: " + order._id + " | RestaurantId: " + order.restaurantId);
    });
    
    // Xóa orders không hợp lệ
    print("\nBước 1.3: Xóa orders không hợp lệ...");
    var deleteResult = db.orders.deleteMany({
        restaurantId: { $nin: validRestaurantIds }
    });
    
    print("✅ Đã xóa " + deleteResult.deletedCount + " orders không hợp lệ");
} else {
    print("✅ Tất cả orders đều có restaurantId hợp lệ");
}

// ========== PHẦN 2: FIX HOSTID TRONG RESTAURANTS ==========
print("\n🏪 PHẦN 2: SỬA CHỮA HOSTID TRONG RESTAURANTS");

// Bước 2.1: Lấy danh sách users có role restaurantHost
print("Bước 2.1: Tìm users có role restaurantHost...");
var hostUsers = db.users.find({
    role: "restaurantHost"
}).toArray();

print("Tìm thấy " + hostUsers.length + " users có role restaurantHost");

if (hostUsers.length === 0) {
    print("❌ Không tìm thấy user nào có role restaurantHost!");
    print("   Cần tạo users với role này trước khi tiếp tục");
} else {
    print("Danh sách host users:");
    hostUsers.forEach(function(user) {
        print("- User: " + user._id + " | Email: " + (user.email || "N/A") + " | Name: " + (user.name || "N/A"));
    });
    
    // Bước 2.2: Lấy danh sách userId hợp lệ từ users collection
    var validUserIds = db.users.distinct("_id");
    
    // Bước 2.3: Tìm restaurants có hostId không hợp lệ
    print("\nBước 2.3: Tìm restaurants có hostId không hợp lệ...");
    var restaurantsWithInvalidHostId = db.restaurants.find({
        $or: [
            { hostId: { $nin: validUserIds } },
            { hostId: { $exists: false } },
            { hostId: null }
        ]
    }).toArray();
    
    print("Tìm thấy " + restaurantsWithInvalidHostId.length + " restaurants có hostId không hợp lệ");
    
    if (restaurantsWithInvalidHostId.length > 0) {
        print("\nBước 2.4: Gán hostId mới cho restaurants...");
        var assignedCount = 0;
        var hostIndex = 0;
        
        restaurantsWithInvalidHostId.forEach(function(restaurant) {
            // Chọn host user theo round-robin
            var selectedHost = hostUsers[hostIndex % hostUsers.length];
            hostIndex++;
            
            print("Gán restaurant " + restaurant._id + " cho host " + selectedHost._id);
            
            var updateResult = db.restaurants.updateOne(
                { _id: restaurant._id },
                { $set: { hostId: selectedHost._id } }
            );
            
            if (updateResult.modifiedCount > 0) {
                assignedCount++;
            }
        });
        
        print("✅ Đã gán lại hostId cho " + assignedCount + " restaurants");
    } else {
        print("✅ Tất cả restaurants đều có hostId hợp lệ");
    }
}

// ========== PHẦN 3: KIỂM TRA KẾT QUẢ ==========
print("\n📊 PHẦN 3: KIỂM TRA KẾT QUẢ CUỐI CÙNG");

// Kiểm tra orders
var totalOrders = db.orders.countDocuments({});
var ordersWithValidRestaurant = db.orders.countDocuments({
    restaurantId: { $in: validRestaurantIds }
});

print("Orders:");
print("- Tổng số orders: " + totalOrders);
print("- Orders có restaurantId hợp lệ: " + ordersWithValidRestaurant);
print("- Orders có restaurantId không hợp lệ: " + (totalOrders - ordersWithValidRestaurant));

// Kiểm tra restaurants
var totalRestaurants = db.restaurants.countDocuments({});
var updatedValidUserIds = db.users.distinct("_id"); // Cập nhật lại list
var restaurantsWithValidHostId = db.restaurants.countDocuments({
    hostId: { $in: updatedValidUserIds }
});

print("\nRestaurants:");
print("- Tổng số restaurants: " + totalRestaurants);
print("- Restaurants có hostId hợp lệ: " + restaurantsWithValidHostId);
print("- Restaurants có hostId không hợp lệ: " + (totalRestaurants - restaurantsWithValidHostId));

// ========== PHẦN 4: KIỂM TRA CÁC VẤN ĐỀ KHÁC ==========
print("\n🔍 PHẦN 4: KIỂM TRA CÁC VẤN ĐỀ TƯƠNG TỰ KHÁC");

// Kiểm tra reviews có orderId/restaurantId không hợp lệ
var reviewsWithInvalidOrderId = 0;
var reviewsWithInvalidRestaurantId = 0;

// Check reviews với orderId
if (db.reviews.findOne({ orderId: { $exists: true } })) {
    var validOrderIds = db.orders.distinct("_id");
    reviewsWithInvalidOrderId = db.reviews.countDocuments({
        orderId: { $exists: true, $nin: validOrderIds }
    });
}

// Check reviews với restaurantId
reviewsWithInvalidRestaurantId = db.reviews.countDocuments({
    restaurantId: { $nin: validRestaurantIds }
});

print("Reviews:");
print("- Reviews có orderId không hợp lệ: " + reviewsWithInvalidOrderId);
print("- Reviews có restaurantId không hợp lệ: " + reviewsWithInvalidRestaurantId);

// Kiểm tra dishes có restaurantId không hợp lệ
var dishesWithInvalidRestaurantId = db.dishes.countDocuments({
    restaurantId: { $nin: validRestaurantIds }
});

print("\nDishes:");
print("- Dishes có restaurantId không hợp lệ: " + dishesWithInvalidRestaurantId);

// Kiểm tra orders có customerId không hợp lệ
var ordersWithInvalidCustomerId = db.orders.countDocuments({
    customerId: { $nin: updatedValidUserIds }
});

print("\nCustomer trong Orders:");
print("- Orders có customerId không hợp lệ: " + ordersWithInvalidCustomerId);

print("\n=== Script hoàn thành ===");

if (ordersWithInvalidCustomerId > 0 || dishesWithInvalidRestaurantId > 0 || 
    reviewsWithInvalidOrderId > 0 || reviewsWithInvalidRestaurantId > 0) {
    print("⚠️  Phát hiện thêm các vấn đề data integrity khác!");
    print("💡 Cần tạo thêm scripts để cleanup các vấn đề này");
} else {
    print("🎉 Tất cả dữ liệu đã có tính toàn vẹn!");
} 