// Script để sửa dayOfWeek từ Date về int trong operatingHours
use('food_delivery_app');

print("=== Bắt đầu sửa dayOfWeek từ Date về int ===");

// Hàm chuyển đổi Date về int cho dayOfWeek
function convertDateToDayOfWeek(dateValue) {
    if (dateValue instanceof Date) {
        // Lấy giây từ epoch time (1970-01-01T00:00:00Z)
        // dayOfWeek = 1 sẽ có giá trị 1970-01-01T00:00:01.000Z
        // dayOfWeek = 2 sẽ có giá trị 1970-01-01T00:00:02.000Z
        const seconds = Math.floor(dateValue.getTime() / 1000);
        return seconds; // Trả về số giây, chính là dayOfWeek
    }
    return dateValue; // Nếu đã là số thì giữ nguyên
}

const restaurants = db.restaurants.find({}).toArray();
print(`Tìm thấy ${restaurants.length} restaurants để kiểm tra`);

let updatedCount = 0;

for (let restaurant of restaurants) {
    let needUpdate = false;
    let updates = {};
    
    if (restaurant.operatingHours && Array.isArray(restaurant.operatingHours)) {
        let newOperatingHours = [];
        
        for (let i = 0; i < restaurant.operatingHours.length; i++) {
            let hour = restaurant.operatingHours[i];
            let newHour = {...hour};
            
            if (hour.dayOfWeek instanceof Date) {
                const originalDate = hour.dayOfWeek;
                const convertedDayOfWeek = convertDateToDayOfWeek(originalDate);
                newHour.dayOfWeek = convertedDayOfWeek;
                needUpdate = true;
                
                print(`Restaurant ${restaurant._id}: Chuyển đổi dayOfWeek từ ${originalDate} thành ${convertedDayOfWeek}`);
            }
            
            newOperatingHours.push(newHour);
        }
        
        if (needUpdate) {
            updates.operatingHours = newOperatingHours;
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
const sampleAfter = db.restaurants.findOne({"operatingHours": {$exists: true}});
if (sampleAfter && sampleAfter.operatingHours && sampleAfter.operatingHours.length > 0) {
    print("Sample operatingHours sau khi sửa:");
    for (let i = 0; i < Math.min(3, sampleAfter.operatingHours.length); i++) {
        const hour = sampleAfter.operatingHours[i];
        print(`  operatingHours[${i}].dayOfWeek: ${hour.dayOfWeek} (type: ${typeof hour.dayOfWeek})`);
    }
} 