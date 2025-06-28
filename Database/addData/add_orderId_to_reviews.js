// Script để tìm và thêm orderId cho các reviews chưa có orderId
// Dựa trên userId và restaurantId để match với orders
// - orderId được lưu dưới dạng ObjectId
// - Reviews không tìm thấy order tương ứng sẽ bị xóa

db = db.getSiblingDB('food_delivery_app');

print("=== Thêm OrderId cho Reviews ===");

// Bước 1: Tìm tất cả reviews chưa có orderId
print("Bước 1: Tìm reviews chưa có orderId...");
var reviewsWithoutOrderId = db.reviews.find({
    $or: [
        { orderId: { $exists: false } },
        { orderId: null },
        { orderId: "" }
    ]
}).toArray();

print("Tìm thấy " + reviewsWithoutOrderId.length + " reviews chưa có orderId");

if (reviewsWithoutOrderId.length === 0) {
    print("Không có reviews nào cần cập nhật orderId!");
    print("=== Script hoàn thành ===");
    exit;
}

// Bước 2: Xử lý từng review
print("\nBước 2: Tìm orderId tương ứng cho từng review...");
var successCount = 0;
var failCount = 0;
var multipleOrdersCount = 0;
var noOrdersCount = 0;
var deletedCount = 0;

reviewsWithoutOrderId.forEach(function(review) {
    print("\n--- Xử lý review: " + review._id + " ---");
    
    // Chuẩn bị query criteria
    var userId = review.userId;
    var restaurantId = review.restaurantId;
    
    // Đảm bảo userId và restaurantId là ObjectId
    if (typeof userId === 'string') {
        try {
            userId = ObjectId(userId);
        } catch (e) {
            print("❌ Lỗi convert userId: " + review.userId);
            failCount++;
            return;
        }
    }
    
    if (typeof restaurantId === 'string') {
        try {
            restaurantId = ObjectId(restaurantId);
        } catch (e) {
            print("❌ Lỗi convert restaurantId: " + review.restaurantId);
            failCount++;
            return;
        }
    }
    
    print("Tìm orders cho userId: " + userId + ", restaurantId: " + restaurantId);
    
    // Tìm tất cả orders của user từ restaurant này
    var candidateOrders = db.orders.find({
        customerId: userId,
        restaurantId: restaurantId
    }).sort({ createdAt: -1 }).toArray(); // Sort theo thời gian tạo mới nhất
    
    print("Tìm thấy " + candidateOrders.length + " orders ứng viên");
    
    if (candidateOrders.length === 0) {
        print("❌ Không tìm thấy order nào phù hợp - Xóa review này");
        var deleteResult = db.reviews.deleteOne({ _id: review._id });
        if (deleteResult.deletedCount > 0) {
            print("✅ Đã xóa review không có order tương ứng: " + review._id);
            deletedCount++;
        } else {
            print("❌ Lỗi xóa review: " + review._id);
            failCount++;
        }
        noOrdersCount++;
        return;
    }
    
    // Ưu tiên chọn order chưa có review (isReview = false)
    var selectedOrder = null;
    var ordersWithoutReview = candidateOrders.filter(function(order) {
        return order.isReview === false;
    });
    
    if (ordersWithoutReview.length > 0) {
        // Chọn order mới nhất chưa có review
        selectedOrder = ordersWithoutReview[0];
        print("✅ Chọn order mới nhất chưa có review: " + selectedOrder._id);
    } else {
        // Nếu tất cả orders đã có review, chọn order mới nhất
        selectedOrder = candidateOrders[0];
        print("⚠️ Tất cả orders đã có review, chọn order mới nhất: " + selectedOrder._id);
        print("   (Order này có thể đã có review khác)");
    }
    
    if (candidateOrders.length > 1) {
        multipleOrdersCount++;
        print("📝 Có " + candidateOrders.length + " orders ứng viên, đã chọn: " + selectedOrder._id);
    }
    
    // Cập nhật orderId cho review (dưới dạng ObjectId)
    var updateResult = db.reviews.updateOne(
        { _id: review._id },
        { $set: { orderId: selectedOrder._id } }
    );
    
    if (updateResult.modifiedCount > 0) {
        print("✅ Đã cập nhật orderId cho review: " + review._id + " -> " + selectedOrder._id);
        successCount++;
        
        // Cập nhật isReview = true cho order được chọn (nếu chưa có)
        if (!selectedOrder.isReview) {
            db.orders.updateOne(
                { _id: selectedOrder._id },
                { $set: { isReview: true } }
            );
            print("✅ Đã cập nhật isReview = true cho order: " + selectedOrder._id);
        }
    } else {
        print("❌ Lỗi cập nhật review: " + review._id);
        failCount++;
    }
});

// Bước 3: Báo cáo kết quả
print("\n=== Báo cáo kết quả ===");
print("Reviews cần xử lý: " + reviewsWithoutOrderId.length);
print("Thành công (đã thêm orderId): " + successCount);
print("Đã xóa (không có order): " + deletedCount);
print("Thất bại: " + failCount);
print("Không tìm thấy orders: " + noOrdersCount);
print("Có nhiều orders ứng viên: " + multipleOrdersCount);

// Bước 4: Kiểm tra kết quả cuối cùng
print("\n=== Kiểm tra kết quả cuối cùng ===");
var reviewsStillWithoutOrderId = db.reviews.countDocuments({
    $or: [
        { orderId: { $exists: false } },
        { orderId: null },
        { orderId: "" }
    ]
});

var reviewsWithOrderId = db.reviews.countDocuments({
    orderId: { $exists: true, $ne: null, $ne: "" }
});

print("Reviews vẫn chưa có orderId: " + reviewsStillWithoutOrderId);
print("Reviews đã có orderId: " + reviewsWithOrderId);

// Bước 5: Phân tích các trường hợp đặc biệt
if (reviewsStillWithoutOrderId > 0) {
    print("\n=== Reviews vẫn chưa có orderId ===");
    db.reviews.find({
        $or: [
            { orderId: { $exists: false } },
            { orderId: null },
            { orderId: "" }
        ]
    }).forEach(function(review) {
        print("- Review: " + review._id + " | UserId: " + review.userId + " | RestaurantId: " + review.restaurantId);
    });
    
    print("\nCác reviews này có thể cần xử lý thủ công");
}

var processedCount = successCount + deletedCount;
if (processedCount === reviewsWithoutOrderId.length) {
    print("\n🎉 Thành công! Tất cả reviews đã được xử lý");
    print("   - Đã thêm orderId: " + successCount);
    print("   - Đã xóa: " + deletedCount);
} else {
    print("\n⚠️ Còn " + (reviewsWithoutOrderId.length - processedCount) + " reviews chưa được xử lý");
}

print("\n=== Script hoàn thành ==="); 