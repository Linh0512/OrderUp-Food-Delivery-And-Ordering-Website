// Script để sửa các field int đang bị lưu dưới dạng Date
use('food_delivery_app');

print("=== Bắt đầu sửa các field int từ Date ===");

// Hàm chuyển đổi Date về int
function convertDateToInt(dateValue) {
    if (dateValue instanceof Date) {
        // Lấy số giây từ epoch time
        // Ví dụ: 1970-01-01T00:00:04.000Z = 4 giây = 4
        const seconds = Math.floor(dateValue.getTime() / 1000);
        return seconds;
    }
    return dateValue; // Nếu đã là số thì giữ nguyên
}

const restaurants = db.restaurants.find({}).toArray();
print(`Đang xử lý ${restaurants.length} restaurants`);

let updatedCount = 0;

for (let restaurant of restaurants) {
    let needUpdate = false;
    let updates = {};
    
    // Sửa delivery info
    if (restaurant.delivery) {
        let newDelivery = {...restaurant.delivery};
        
        // Fix deliveryRadius
        if (restaurant.delivery.deliveryRadius instanceof Date) {
            const originalValue = restaurant.delivery.deliveryRadius;
            const convertedValue = convertDateToInt(originalValue);
            newDelivery.deliveryRadius = convertedValue;
            needUpdate = true;
            print(`Restaurant ${restaurant._id}: deliveryRadius từ ${originalValue} thành ${convertedValue}`);
        }
        
        // Fix estimatedDeliveryTime
        if (restaurant.delivery.estimatedDeliveryTime instanceof Date) {
            const originalValue = restaurant.delivery.estimatedDeliveryTime;
            const convertedValue = convertDateToInt(originalValue);
            newDelivery.estimatedDeliveryTime = convertedValue;
            needUpdate = true;
            print(`Restaurant ${restaurant._id}: estimatedDeliveryTime từ ${originalValue} thành ${convertedValue}`);
        }
        
        if (needUpdate) {
            updates.delivery = newDelivery;
        }
    }
    
    // Sửa ratings info
    if (restaurant.ratings) {
        let newRatings = {...restaurant.ratings};
        
        // Fix totalReviews
        if (restaurant.ratings.totalReviews instanceof Date) {
            const originalValue = restaurant.ratings.totalReviews;
            const convertedValue = convertDateToInt(originalValue);
            newRatings.totalReviews = convertedValue;
            needUpdate = true;
            print(`Restaurant ${restaurant._id}: totalReviews từ ${originalValue} thành ${convertedValue}`);
        }
        
        if (restaurant.ratings.totalReviews instanceof Date) {
            updates.ratings = newRatings;
        }
    }
    
    if (needUpdate) {
        db.restaurants.updateOne(
            {_id: restaurant._id}, 
            {$set: updates}
        );
        updatedCount++;
        print(`Đã cập nhật restaurant ${restaurant._id}`);
    }
}

print(`=== Hoàn thành: Đã cập nhật ${updatedCount} restaurants ===`);

// Kiểm tra kết quả
print("\n=== Kiểm tra kết quả sau khi sửa ===");
const sampleAfter = db.restaurants.findOne({});
if (sampleAfter && sampleAfter.delivery) {
    print("Sample delivery info sau khi sửa:");
    print(`  deliveryRadius: ${sampleAfter.delivery.deliveryRadius} (type: ${typeof sampleAfter.delivery.deliveryRadius})`);
    print(`  estimatedDeliveryTime: ${sampleAfter.delivery.estimatedDeliveryTime} (type: ${typeof sampleAfter.delivery.estimatedDeliveryTime})`);
}
if (sampleAfter && sampleAfter.ratings) {
    print("Sample ratings info sau khi sửa:");
    print(`  totalReviews: ${sampleAfter.ratings.totalReviews} (type: ${typeof sampleAfter.ratings.totalReviews})`);
} 