// Script để làm sạch các reviews không hợp lệ (có orderId không tồn tại trong orders)

db = db.getSiblingDB('food_delivery_app');

print("=== Làm sạch Reviews không hợp lệ ===");

// Bước 1: Tìm tất cả reviews có orderId không tồn tại trong orders
print("Bước 1: Tìm reviews không hợp lệ...");
var reviews = db.reviews.find({}).toArray();
var invalidReviews = [];
var validReviews = [];

reviews.forEach(function(review) {
    if (review.orderId) {
        // Kiểm tra orderId có tồn tại trong orders không
        var orderExists = db.orders.findOne({ _id: ObjectId(review.orderId) });
        if (!orderExists) {
            invalidReviews.push({
                reviewId: review._id,
                orderId: review.orderId,
                userId: review.userId,
                restaurantId: review.restaurantId
            });
            print("Review không hợp lệ: " + review._id + " -> orderId: " + review.orderId + " (không tồn tại)");
        } else {
            validReviews.push(review);
        }
    } else {
        // Reviews không có orderId (có thể là dữ liệu cũ)
        print("Review không có orderId: " + review._id + " (có thể là dữ liệu cũ)");
        validReviews.push(review);
    }
});

print("\nKết quả phân tích:");
print("Tổng số reviews: " + reviews.length);
print("Reviews hợp lệ: " + validReviews.length);
print("Reviews không hợp lệ: " + invalidReviews.length);

// Bước 2: Hiển thị danh sách reviews không hợp lệ
if (invalidReviews.length > 0) {
    print("\n=== Danh sách Reviews không hợp lệ ===");
    invalidReviews.forEach(function(review) {
        print("- ReviewID: " + review.reviewId + " | OrderID: " + review.orderId + " | UserID: " + review.userId);
    });

    // Bước 3: Xóa reviews không hợp lệ
    print("\n=== Xóa Reviews không hợp lệ ===");
    var reviewIdsToDelete = invalidReviews.map(function(review) { return review.reviewId; });
    
    print("Đang xóa " + reviewIdsToDelete.length + " reviews không hợp lệ...");
    var deleteResult = db.reviews.deleteMany({ 
        _id: { $in: reviewIdsToDelete } 
    });
    
    print("Đã xóa " + deleteResult.deletedCount + " reviews không hợp lệ");

    // Bước 4: Reset lại isReview cho các orders bị ảnh hưởng
    print("\n=== Reset trạng thái isReview cho orders ===");
    invalidReviews.forEach(function(review) {
        if (review.orderId) {
            var orderUpdateResult = db.orders.updateOne(
                { _id: ObjectId(review.orderId) },
                { $set: { isReview: false } }
            );
            if (orderUpdateResult.modifiedCount > 0) {
                print("Đã reset isReview = false cho order: " + review.orderId);
            }
        }
    });
} else {
    print("\nKhông có reviews không hợp lệ nào để xóa!");
}

// Bước 5: Báo cáo cuối cùng
print("\n=== Báo cáo cuối cùng ===");
var finalReviewCount = db.reviews.countDocuments({});
var finalOrderReviewedCount = db.orders.countDocuments({ isReview: true });
var finalOrderUnreviewedCount = db.orders.countDocuments({ isReview: false });

print("Reviews còn lại: " + finalReviewCount);
print("Orders đã review: " + finalOrderReviewedCount);
print("Orders chưa review: " + finalOrderUnreviewedCount);

print("\n=== Cleanup hoàn thành ==="); 