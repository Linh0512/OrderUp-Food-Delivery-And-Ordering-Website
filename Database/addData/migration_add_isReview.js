// Migration script để thêm trường isReview vào orders collection
// Và cập nhật giá trị dựa trên các review đã tồn tại

db = db.getSiblingDB('food_delivery_app');

print("=== Migration: Thêm trường isReview vào orders collection ===");

// Bước 1: Thêm trường isReview = false cho tất cả orders hiện có
print("Bước 1: Thêm trường isReview = false cho tất cả orders...");
var ordersUpdated = db.orders.updateMany(
    { isReview: { $exists: false } }, // Chỉ cập nhật những order chưa có trường isReview
    { $set: { isReview: false } }
);
print("Đã cập nhật " + ordersUpdated.modifiedCount + " orders với isReview = false");

// Bước 2: Tìm tất cả reviews đã tồn tại và cập nhật orders tương ứng
print("Bước 2: Cập nhật isReview = true cho các orders đã có review...");

// Lấy tất cả reviews
var reviews = db.reviews.find({}).toArray();
print("Tìm thấy " + reviews.length + " reviews trong database");

var reviewUpdatedCount = 0;
var invalidReviewsCount = 0;

reviews.forEach(function(review) {
    var updateResult = null;
    
    // Kiểm tra nếu review có orderId
    if (review.orderId) {
        // Cập nhật order theo orderId chính xác
        updateResult = db.orders.updateOne(
            {
                _id: ObjectId(review.orderId),
                isReview: false
            },
            { $set: { isReview: true } }
        );
        
        if (updateResult.modifiedCount > 0) {
            reviewUpdatedCount++;
            print("Đã cập nhật order với orderId: " + review.orderId);
        } else {
            print("CẢNH BÁO: Review có orderId không tồn tại trong orders: " + review.orderId);
            invalidReviewsCount++;
        }
    } else {
        // Fallback: Cập nhật theo customerId và restaurantId (cho reviews cũ không có orderId)
        var customerIdQuery = review.customerId;
        var restaurantIdQuery = review.restaurantId;
        
        // Chuyển đổi sang ObjectId nếu cần
        if (typeof review.customerId === 'string') {
            customerIdQuery = ObjectId(review.customerId);
        }
        if (typeof review.restaurantId === 'string') {
            restaurantIdQuery = ObjectId(review.restaurantId);
        }
        
        updateResult = db.orders.updateOne(
            {
                customerId: customerIdQuery,
                restaurantId: restaurantIdQuery,
                isReview: false
            },
            { $set: { isReview: true } }
        );
        
        if (updateResult.modifiedCount > 0) {
            reviewUpdatedCount++;
            print("Đã cập nhật order (fallback) của customerId: " + review.customerId + " cho restaurantId: " + review.restaurantId);
        } else {
            print("CẢNH BÁO: Không tìm thấy order phù hợp cho review không có orderId - customerId: " + review.customerId + ", restaurantId: " + review.restaurantId);
            invalidReviewsCount++;
        }
    }
});

print("Đã cập nhật " + reviewUpdatedCount + " orders với isReview = true dựa trên reviews hiện có");
print("Có " + invalidReviewsCount + " reviews không match với orders nào");

// Bước 3: Báo cáo kết quả
print("\n=== Báo cáo kết quả migration ===");
var totalOrders = db.orders.countDocuments({});
var reviewedOrders = db.orders.countDocuments({ isReview: true });
var unReviewedOrders = db.orders.countDocuments({ isReview: false });

print("Tổng số orders: " + totalOrders);
print("Orders đã review: " + reviewedOrders);
print("Orders chưa review: " + unReviewedOrders);

// Bước 4: Làm sạch dữ liệu - Xóa reviews không có order tương ứng (optional)
print("\n=== Phân tích reviews không hợp lệ ===");
var invalidReviews = [];
reviews.forEach(function(review) {
    if (review.orderId) {
        var orderExists = db.orders.findOne({ _id: ObjectId(review.orderId) });
        if (!orderExists) {
            invalidReviews.push(review._id);
            print("Review không hợp lệ (orderId không tồn tại): " + review._id + " -> orderId: " + review.orderId);
        }
    }
});
print("Tìm thấy " + invalidReviews.length + " reviews có orderId không tồn tại trong orders");

if (invalidReviews.length > 0) {
    print("\nĐể xóa các reviews không hợp lệ này, chạy lệnh sau:");
    print("db.reviews.deleteMany({ _id: { $in: " + JSON.stringify(invalidReviews) + " } })");
}

print("\n=== Migration hoàn thành ==="); 