// Script để xóa tất cả trường orderId từ reviews collection
// Chuẩn bị cho việc chạy lại script add_orderId_to_reviews.js với logic ObjectId

db = db.getSiblingDB('food_delivery_app');

print("=== Xóa trường orderId từ Reviews ===");

// Bước 1: Kiểm tra số lượng reviews có orderId
print("Bước 1: Kiểm tra trạng thái hiện tại...");
var reviewsWithOrderId = db.reviews.countDocuments({
    orderId: { $exists: true }
});

var totalReviews = db.reviews.countDocuments({});

print("Tổng số reviews: " + totalReviews);
print("Reviews có orderId: " + reviewsWithOrderId);
print("Reviews chưa có orderId: " + (totalReviews - reviewsWithOrderId));

if (reviewsWithOrderId === 0) {
    print("✅ Không có reviews nào có orderId, không cần xóa!");
    print("=== Script hoàn thành ===");
    quit();
}

// Bước 2: Xóa trường orderId từ tất cả reviews
print("\nBước 2: Xóa trường orderId từ tất cả reviews...");
var result = db.reviews.updateMany(
    { orderId: { $exists: true } },
    { $unset: { orderId: "" } }
);

print("Số reviews đã cập nhật: " + result.modifiedCount);

// Bước 3: Kiểm tra kết quả
print("\nBước 3: Kiểm tra kết quả...");
var reviewsWithOrderIdAfter = db.reviews.countDocuments({
    orderId: { $exists: true }
});

print("Reviews còn lại có orderId: " + reviewsWithOrderIdAfter);

if (reviewsWithOrderIdAfter === 0) {
    print("✅ Thành công! Đã xóa tất cả trường orderId");
} else {
    print("❌ Còn " + reviewsWithOrderIdAfter + " reviews vẫn có orderId");
}

// Bước 4: Reset isReview cho các orders (optional)
print("\nBước 4: Reset isReview = false cho tất cả orders...");
var orderResult = db.orders.updateMany(
    { isReview: true },
    { $set: { isReview: false } }
);

print("Số orders đã reset isReview: " + orderResult.modifiedCount);

print("\n=== Script hoàn thành ===");
print("💡 Giờ bạn có thể chạy lại script add_orderId_to_reviews.js"); 