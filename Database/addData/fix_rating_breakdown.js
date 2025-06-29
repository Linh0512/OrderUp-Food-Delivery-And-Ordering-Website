// Script để sửa ratingBreakdown Map từ Date về Integer
use('food_delivery_app');

print("=== Bắt đầu sửa ratingBreakdown từ Date về Integer ===");

// Hàm chuyển đổi Date về int
function convertDateToInt(dateValue) {
    if (dateValue instanceof Date) {
        // Lấy số giây từ epoch time
        // Ví dụ: 1970-01-01T00:00:36.000Z = 36 giây = 36
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
    
    // Sửa ratingBreakdown trong ratings
    if (restaurant.ratings && restaurant.ratings.ratingBreakdown) {
        let newRatings = {...restaurant.ratings};
        let newRatingBreakdown = {};
        let hasDateValues = false;
        
        for (let [key, value] of Object.entries(restaurant.ratings.ratingBreakdown)) {
            if (value instanceof Date) {
                const originalValue = value;
                const convertedValue = convertDateToInt(originalValue);
                newRatingBreakdown[key] = convertedValue;
                hasDateValues = true;
                print(`Restaurant ${restaurant._id}: ratingBreakdown.${key} từ ${originalValue} thành ${convertedValue}`);
            } else {
                newRatingBreakdown[key] = value;
            }
        }
        
        if (hasDateValues) {
            newRatings.ratingBreakdown = newRatingBreakdown;
            updates.ratings = newRatings;
            needUpdate = true;
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
if (sampleAfter && sampleAfter.ratings && sampleAfter.ratings.ratingBreakdown) {
    print("Sample ratingBreakdown sau khi sửa:");
    const breakdown = sampleAfter.ratings.ratingBreakdown;
    for (let [key, value] of Object.entries(breakdown)) {
        print(`  ${key}: ${value} (type: ${typeof value})`);
    }
} 