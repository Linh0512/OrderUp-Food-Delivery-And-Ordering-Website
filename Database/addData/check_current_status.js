// Script để kiểm tra trạng thái hiện tại của database trước khi migration

db = db.getSiblingDB('food_delivery_app');

print("=== Kiểm tra trạng thái hiện tại Database ===");

// 1. Kiểm tra Reviews Collection
print("\n1. REVIEWS COLLECTION:");
var totalReviews = db.reviews.countDocuments({});
print("- Tổng số reviews: " + totalReviews);

// Kiểm tra kiểu dữ liệu userId
var stringUserIds = 0;
var objectIdUserIds = 0;
var invalidUserIds = 0;

db.reviews.find({}).forEach(function(review) {
    if (typeof review.userId === 'string') {
        try {
            ObjectId(review.userId);
            stringUserIds++;
        } catch (e) {
            invalidUserIds++;
        }
    } else if (review.userId instanceof ObjectId) {
        objectIdUserIds++;
    }
});

print("- UserIds kiểu String (cần convert): " + stringUserIds);
print("- UserIds kiểu ObjectId (đã đúng): " + objectIdUserIds);
print("- UserIds không hợp lệ: " + invalidUserIds);

// Kiểm tra kiểu dữ liệu restaurantId
var stringRestaurantIds = 0;
var objectIdRestaurantIds = 0;
var invalidRestaurantIds = 0;

db.reviews.find({}).forEach(function(review) {
    if (typeof review.restaurantId === 'string') {
        try {
            ObjectId(review.restaurantId);
            stringRestaurantIds++;
        } catch (e) {
            invalidRestaurantIds++;
        }
    } else if (review.restaurantId instanceof ObjectId) {
        objectIdRestaurantIds++;
    }
});

print("- RestaurantIds kiểu String (cần convert): " + stringRestaurantIds);
print("- RestaurantIds kiểu ObjectId (đã đúng): " + objectIdRestaurantIds);
print("- RestaurantIds không hợp lệ: " + invalidRestaurantIds);

// Kiểm tra orderId
var reviewsWithOrderId = db.reviews.countDocuments({
    orderId: { $exists: true, $ne: null, $ne: "" }
});
var reviewsWithoutOrderId = db.reviews.countDocuments({
    $or: [
        { orderId: { $exists: false } },
        { orderId: null },
        { orderId: "" }
    ]
});

print("- Reviews có orderId: " + reviewsWithOrderId);
print("- Reviews chưa có orderId: " + reviewsWithoutOrderId);

// 2. Kiểm tra Orders Collection
print("\n2. ORDERS COLLECTION:");
var totalOrders = db.orders.countDocuments({});
print("- Tổng số orders: " + totalOrders);

var ordersWithIsReview = db.orders.countDocuments({ isReview: { $exists: true } });
var ordersWithoutIsReview = db.orders.countDocuments({ isReview: { $exists: false } });
var ordersReviewed = db.orders.countDocuments({ isReview: true });
var ordersNotReviewed = db.orders.countDocuments({ isReview: false });

print("- Orders có trường isReview: " + ordersWithIsReview);
print("- Orders chưa có trường isReview: " + ordersWithoutIsReview);
print("- Orders đã review (isReview = true): " + ordersReviewed);
print("- Orders chưa review (isReview = false): " + ordersNotReviewed);

// 3. Phân tích khả năng match reviews với orders
print("\n3. PHÂN TÍCH KHẢ NĂNG MATCH:");

var matchableReviews = 0;
var unmatchableReviews = 0;

db.reviews.find({
    $or: [
        { orderId: { $exists: false } },
        { orderId: null },
        { orderId: "" }
    ]
}).forEach(function(review) {
    var userId = review.userId;
    var restaurantId = review.restaurantId;
    
    // Convert to ObjectId if needed
    if (typeof userId === 'string') {
        try {
            userId = ObjectId(userId);
        } catch (e) {
            unmatchableReviews++;
            return;
        }
    }
    
    if (typeof restaurantId === 'string') {
        try {
            restaurantId = ObjectId(restaurantId);
        } catch (e) {
            unmatchableReviews++;
            return;
        }
    }
    
    var matchingOrders = db.orders.countDocuments({
        customerId: userId,
        restaurantId: restaurantId
    });
    
    if (matchingOrders > 0) {
        matchableReviews++;
    } else {
        unmatchableReviews++;
        print("⚠️ Review không có order tương ứng: " + review._id + 
              " | UserId: " + review.userId + 
              " | RestaurantId: " + review.restaurantId);
    }
});

print("- Reviews có thể match với orders: " + matchableReviews);
print("- Reviews không thể match: " + unmatchableReviews);

// 4. Kiểm tra tính nhất quán hiện tại
print("\n4. KIỂM TRA TÍNH NHẤT QUÁN:");

// Reviews có orderId nhưng order không tồn tại
var orphanReviews = 0;
db.reviews.find({ orderId: { $exists: true, $ne: null, $ne: "" } }).forEach(function(review) {
    var orderExists = db.orders.findOne({ _id: ObjectId(review.orderId) });
    if (!orderExists) {
        orphanReviews++;
        print("⚠️ Review orphan: " + review._id + " -> orderId: " + review.orderId);
    }
});
print("- Reviews orphan (orderId không tồn tại): " + orphanReviews);

// Orders có isReview = true nhưng không có review
var inconsistentOrders = 0;
db.orders.find({ isReview: true }).forEach(function(order) {
    var reviewExists = db.reviews.findOne({ orderId: order._id.toString() });
    if (!reviewExists) {
        inconsistentOrders++;
    }
});
print("- Orders có isReview=true nhưng không có review: " + inconsistentOrders);

// 5. Tóm tắt những gì cần làm
print("\n=== TÓM TẮT CẦN LÀM ===");

if (stringUserIds > 0 || stringRestaurantIds > 0) {
    print("✅ Cần chạy: fix_review_data_types.js");
    print("   - Convert " + stringUserIds + " userIds từ String sang ObjectId");
    print("   - Convert " + stringRestaurantIds + " restaurantIds từ String sang ObjectId");
}

if (reviewsWithoutOrderId > 0) {
    print("✅ Cần chạy: add_orderId_to_reviews.js");
    print("   - Thêm orderId cho " + reviewsWithoutOrderId + " reviews");
    print("   - " + matchableReviews + " reviews có thể match với orders");
    print("   - " + unmatchableReviews + " reviews cần xử lý đặc biệt");
}

if (ordersWithoutIsReview > 0) {
    print("✅ Cần chạy: migration_add_isReview.js");
    print("   - Thêm trường isReview cho " + ordersWithoutIsReview + " orders");
}

if (orphanReviews > 0) {
    print("✅ Cần chạy: cleanup_invalid_reviews.js");
    print("   - Làm sạch " + orphanReviews + " reviews orphan");
}

if (invalidUserIds > 0 || invalidRestaurantIds > 0) {
    print("⚠️ CẨN THẬN: Có dữ liệu không hợp lệ");
    print("   - " + invalidUserIds + " userIds không hợp lệ");
    print("   - " + invalidRestaurantIds + " restaurantIds không hợp lệ");
    print("   - Cần xem xét xóa hoặc sửa thủ công");
}

print("\n=== Kiểm tra hoàn thành ==="); 