// Script để chuyển đổi userId và restaurantId từ String sang ObjectId trong reviews collection

db = db.getSiblingDB('food_delivery_app');

print("=== Migration: Chuyển đổi String sang ObjectId trong Reviews ===");

// Bước 1: Phân tích dữ liệu hiện tại
print("Bước 1: Phân tích dữ liệu hiện tại...");
var allReviews = db.reviews.find({}).toArray();
var stringUserIds = [];
var stringRestaurantIds = [];
var objectIdUserIds = [];
var objectIdRestaurantIds = [];
var invalidUserIds = [];
var invalidRestaurantIds = [];

allReviews.forEach(function(review) {
    // Kiểm tra userId
    if (typeof review.userId === 'string') {
        try {
            // Kiểm tra string có thể convert thành ObjectId không
            ObjectId(review.userId);
            stringUserIds.push(review._id);
        } catch (e) {
            invalidUserIds.push({reviewId: review._id, userId: review.userId});
        }
    } else if (review.userId instanceof ObjectId) {
        objectIdUserIds.push(review._id);
    }
    
    // Kiểm tra restaurantId
    if (typeof review.restaurantId === 'string') {
        try {
            ObjectId(review.restaurantId);
            stringRestaurantIds.push(review._id);
        } catch (e) {
            invalidRestaurantIds.push({reviewId: review._id, restaurantId: review.restaurantId});
        }
    } else if (review.restaurantId instanceof ObjectId) {
        objectIdRestaurantIds.push(review._id);
    }
});

print("\n=== Báo cáo phân tích ===");
print("Tổng số reviews: " + allReviews.length);
print("UserIds cần convert (String -> ObjectId): " + stringUserIds.length);
print("UserIds đã là ObjectId: " + objectIdUserIds.length);
print("UserIds không hợp lệ: " + invalidUserIds.length);
print("RestaurantIds cần convert (String -> ObjectId): " + stringRestaurantIds.length);
print("RestaurantIds đã là ObjectId: " + objectIdRestaurantIds.length);
print("RestaurantIds không hợp lệ: " + invalidRestaurantIds.length);

// Hiển thị các trường hợp không hợp lệ
if (invalidUserIds.length > 0) {
    print("\n⚠️ UserIds không hợp lệ:");
    invalidUserIds.forEach(function(item) {
        print("- Review: " + item.reviewId + " | UserId: " + item.userId);
    });
}

if (invalidRestaurantIds.length > 0) {
    print("\n⚠️ RestaurantIds không hợp lệ:");
    invalidRestaurantIds.forEach(function(item) {
        print("- Review: " + item.reviewId + " | RestaurantId: " + item.restaurantId);
    });
}

// Bước 2: Convert UserIds từ String sang ObjectId
if (stringUserIds.length > 0) {
    print("\n=== Bước 2: Convert UserIds ===");
    var userIdConvertCount = 0;
    
    stringUserIds.forEach(function(reviewId) {
        var review = db.reviews.findOne({_id: reviewId});
        try {
            var newUserId = ObjectId(review.userId);
            var updateResult = db.reviews.updateOne(
                {_id: reviewId},
                {$set: {userId: newUserId}}
            );
            
            if (updateResult.modifiedCount > 0) {
                userIdConvertCount++;
                print("✅ Converted userId cho review: " + reviewId + " | " + review.userId + " -> ObjectId");
            }
        } catch (e) {
            print("❌ Lỗi convert userId cho review: " + reviewId + " | Error: " + e.message);
        }
    });
    
    print("Đã convert " + userIdConvertCount + " userIds thành công");
} else {
    print("\nBước 2: Không có UserIds nào cần convert");
}

// Bước 3: Convert RestaurantIds từ String sang ObjectId
if (stringRestaurantIds.length > 0) {
    print("\n=== Bước 3: Convert RestaurantIds ===");
    var restaurantIdConvertCount = 0;
    
    stringRestaurantIds.forEach(function(reviewId) {
        var review = db.reviews.findOne({_id: reviewId});
        try {
            var newRestaurantId = ObjectId(review.restaurantId);
            var updateResult = db.reviews.updateOne(
                {_id: reviewId},
                {$set: {restaurantId: newRestaurantId}}
            );
            
            if (updateResult.modifiedCount > 0) {
                restaurantIdConvertCount++;
                print("✅ Converted restaurantId cho review: " + reviewId + " | " + review.restaurantId + " -> ObjectId");
            }
        } catch (e) {
            print("❌ Lỗi convert restaurantId cho review: " + reviewId + " | Error: " + e.message);
        }
    });
    
    print("Đã convert " + restaurantIdConvertCount + " restaurantIds thành công");
} else {
    print("\nBước 3: Không có RestaurantIds nào cần convert");
}

// Bước 4: Xử lý các trường hợp không hợp lệ
if (invalidUserIds.length > 0 || invalidRestaurantIds.length > 0) {
    print("\n=== Bước 4: Xử lý dữ liệu không hợp lệ ===");
    print("⚠️ CẢnh báo: Có " + (invalidUserIds.length + invalidRestaurantIds.length) + " trường hợp có dữ liệu không hợp lệ");
    print("Bạn cần xem xét xử lý thủ công hoặc xóa các reviews này:");
    
    var invalidReviewIds = [];
    invalidUserIds.forEach(function(item) {
        invalidReviewIds.push(item.reviewId);
    });
    invalidRestaurantIds.forEach(function(item) {
        if (invalidReviewIds.indexOf(item.reviewId) === -1) {
            invalidReviewIds.push(item.reviewId);
        }
    });
    
    print("Để xóa các reviews không hợp lệ này, chạy lệnh sau:");
    print("db.reviews.deleteMany({ _id: { $in: " + JSON.stringify(invalidReviewIds) + " } })");
}

// Bước 5: Kiểm tra kết quả cuối cùng
print("\n=== Bước 5: Kiểm tra kết quả ===");
var finalReviews = db.reviews.find({}).toArray();
var finalStringUserIds = 0;
var finalStringRestaurantIds = 0;
var finalObjectIdUserIds = 0;
var finalObjectIdRestaurantIds = 0;

finalReviews.forEach(function(review) {
    if (typeof review.userId === 'string') {
        finalStringUserIds++;
    } else if (review.userId instanceof ObjectId) {
        finalObjectIdUserIds++;
    }
    
    if (typeof review.restaurantId === 'string') {
        finalStringRestaurantIds++;
    } else if (review.restaurantId instanceof ObjectId) {
        finalObjectIdRestaurantIds++;
    }
});

print("\n=== Báo cáo kết quả cuối cùng ===");
print("Tổng reviews: " + finalReviews.length);
print("UserIds còn là String: " + finalStringUserIds);
print("UserIds đã là ObjectId: " + finalObjectIdUserIds);
print("RestaurantIds còn là String: " + finalStringRestaurantIds);
print("RestaurantIds đã là ObjectId: " + finalObjectIdRestaurantIds);

if (finalStringUserIds === 0 && finalStringRestaurantIds === 0) {
    print("\n🎉 Migration hoàn thành thành công! Tất cả userId và restaurantId đã là ObjectId");
} else {
    print("\n⚠️ Vẫn còn " + (finalStringUserIds + finalStringRestaurantIds) + " trường String chưa được convert");
}

print("\n=== Migration hoàn thành ==="); 