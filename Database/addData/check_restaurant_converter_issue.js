// Script để kiểm tra conversion issues trong restaurants collection
// Chạy trong MongoDB shell hoặc MongoDB Compass

print("=== KIỂM TRA CONVERSION ISSUES TRONG RESTAURANTS COLLECTION ===");

// Kết nối database
use('food_delivery_app');

// Lấy sample restaurant để kiểm tra
const sampleRestaurant = db.restaurants.findOne({});
if (!sampleRestaurant) {
    print("❌ Không tìm thấy restaurant nào trong database");
    exit();
}

print("\n📋 KIỂM TRA CẤU TRÚC RESTAURANT:");
print("Restaurant ID:", sampleRestaurant._id);
print("Restaurant Name:", sampleRestaurant.basicInfo ? sampleRestaurant.basicInfo.name : "N/A");

// Kiểm tra các int fields có thể bị convert thành Date
print("\n🔢 KIỂM TRA CÁC INT FIELDS:");

// 1. dayOfWeek
if (sampleRestaurant.dayOfWeek !== undefined) {
    print("1. dayOfWeek:");
    print("   Type:", typeof sampleRestaurant.dayOfWeek);
    print("   Value:", sampleRestaurant.dayOfWeek);
    print("   Is Number:", typeof sampleRestaurant.dayOfWeek === 'number');
    print("   Is Date:", sampleRestaurant.dayOfWeek instanceof Date);
}

// 2. deliveryRadius
if (sampleRestaurant.deliveryRadius !== undefined) {
    print("2. deliveryRadius:");
    print("   Type:", typeof sampleRestaurant.deliveryRadius);
    print("   Value:", sampleRestaurant.deliveryRadius);
    print("   Is Number:", typeof sampleRestaurant.deliveryRadius === 'number');
    print("   Is Date:", sampleRestaurant.deliveryRadius instanceof Date);
}

// 3. estimatedDeliveryTime
if (sampleRestaurant.estimatedDeliveryTime !== undefined) {
    print("3. estimatedDeliveryTime:");
    print("   Type:", typeof sampleRestaurant.estimatedDeliveryTime);
    print("   Value:", sampleRestaurant.estimatedDeliveryTime);
    print("   Is Number:", typeof sampleRestaurant.estimatedDeliveryTime === 'number');
    print("   Is Date:", sampleRestaurant.estimatedDeliveryTime instanceof Date);
}

// 4. totalReviews
if (sampleRestaurant.totalReviews !== undefined) {
    print("4. totalReviews:");
    print("   Type:", typeof sampleRestaurant.totalReviews);
    print("   Value:", sampleRestaurant.totalReviews);
    print("   Is Number:", typeof sampleRestaurant.totalReviews === 'number');
    print("   Is Date:", sampleRestaurant.totalReviews instanceof Date);
}

// Kiểm tra ratingBreakdown Map values
if (sampleRestaurant.ratingBreakdown) {
    print("\n⭐ KIỂM TRA RATING BREAKDOWN:");
    Object.keys(sampleRestaurant.ratingBreakdown).forEach((key) => {
        const value = sampleRestaurant.ratingBreakdown[key];
        print(`${key}:`);
        print("   Type:", typeof value);
        print("   Value:", value);
        print("   Is Number:", typeof value === 'number');
        print("   Is Date:", value instanceof Date);
    });
}

// Đếm restaurants có vấn đề converter
print("\n🔍 THỐNG KÊ VẤN ĐỀ CONVERTER:");

// Đếm restaurants có dayOfWeek không phải number
const dayOfWeekIssues = db.restaurants.countDocuments({
    dayOfWeek: { $not: { $type: "number" } }
});
print("Restaurants có dayOfWeek không phải number:", dayOfWeekIssues);

// Đếm restaurants có deliveryRadius không phải number
const deliveryRadiusIssues = db.restaurants.countDocuments({
    deliveryRadius: { $not: { $type: "number" } }
});
print("Restaurants có deliveryRadius không phải number:", deliveryRadiusIssues);

// Đếm restaurants có estimatedDeliveryTime không phải number
const estimatedDeliveryTimeIssues = db.restaurants.countDocuments({
    estimatedDeliveryTime: { $not: { $type: "number" } }
});
print("Restaurants có estimatedDeliveryTime không phải number:", estimatedDeliveryTimeIssues);

// Đếm restaurants có totalReviews không phải number
const totalReviewsIssues = db.restaurants.countDocuments({
    totalReviews: { $not: { $type: "number" } }
});
print("Restaurants có totalReviews không phải number:", totalReviewsIssues);

// Tìm restaurants có vấn đề cụ thể
print("\n⚠️  RESTAURANTS CÓ VẤN ĐỀ CỤ THỂ:");
const problematicRestaurants = db.restaurants.find({
    $or: [
        { dayOfWeek: { $not: { $type: "number" } } },
        { deliveryRadius: { $not: { $type: "number" } } },
        { estimatedDeliveryTime: { $not: { $type: "number" } } },
        { totalReviews: { $not: { $type: "number" } } }
    ]
}).limit(3);

problematicRestaurants.forEach((restaurant, index) => {
    print(`\nProblematic Restaurant ${index + 1}:`);
    print("  ID:", restaurant._id);
    print("  Name:", restaurant.basicInfo ? restaurant.basicInfo.name : "N/A");
    
    if (typeof restaurant.dayOfWeek !== 'number' && restaurant.dayOfWeek !== undefined) {
        print("  dayOfWeek type:", typeof restaurant.dayOfWeek, "value:", restaurant.dayOfWeek);
    }
    if (typeof restaurant.deliveryRadius !== 'number' && restaurant.deliveryRadius !== undefined) {
        print("  deliveryRadius type:", typeof restaurant.deliveryRadius, "value:", restaurant.deliveryRadius);
    }
    if (typeof restaurant.estimatedDeliveryTime !== 'number' && restaurant.estimatedDeliveryTime !== undefined) {
        print("  estimatedDeliveryTime type:", typeof restaurant.estimatedDeliveryTime, "value:", restaurant.estimatedDeliveryTime);
    }
    if (typeof restaurant.totalReviews !== 'number' && restaurant.totalReviews !== undefined) {
        print("  totalReviews type:", typeof restaurant.totalReviews, "value:", restaurant.totalReviews);
    }
});

print("\n✅ KIỂM TRA HOÀN THÀNH!");
print("Nếu có issues, cần chạy scripts fix để sửa data types trước khi test API."); 