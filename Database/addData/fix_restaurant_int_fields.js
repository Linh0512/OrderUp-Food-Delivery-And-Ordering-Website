// Script để fix int fields bị convert thành Date trong restaurants collection
// Chạy trong MongoDB shell hoặc MongoDB Compass

print("=== FIX INT FIELDS BỊ CONVERT THÀNH DATE TRONG RESTAURANTS ===");

// Kết nối database
use('food_delivery_app');

// Tìm tất cả restaurants có int fields bị sai kiểu
const problematicRestaurants = db.restaurants.find({
    $or: [
        { dayOfWeek: { $not: { $type: "number" } } },
        { deliveryRadius: { $not: { $type: "number" } } },
        { estimatedDeliveryTime: { $not: { $type: "number" } } },
        { totalReviews: { $not: { $type: "number" } } }
    ]
});

print("Đang kiểm tra restaurants có vấn đề int fields...");

let fixedCount = 0;
let totalIssues = 0;

// Helper function để convert Date back to int
function dateToInt(dateValue, fieldName) {
    if (dateValue instanceof Date) {
        // Extract number from Date (epoch time in seconds)
        const epochSeconds = Math.floor(dateValue.getTime() / 1000);
        
        // Default values based on field type
        switch(fieldName) {
            case 'dayOfWeek':
                // dayOfWeek should be 1-7, usually small numbers
                return (epochSeconds > 0 && epochSeconds <= 7) ? epochSeconds : 1;
            case 'deliveryRadius':
                // deliveryRadius in km, usually small numbers like 5, 10, 15
                return (epochSeconds > 0 && epochSeconds <= 50) ? epochSeconds : 5;
            case 'estimatedDeliveryTime':
                // delivery time in minutes, usually 15-60
                return (epochSeconds > 0 && epochSeconds <= 120) ? epochSeconds : 30;
            case 'totalReviews':
                // number of reviews, can be large but usually reasonable
                return (epochSeconds > 0 && epochSeconds <= 10000) ? epochSeconds : 0;
            default:
                return epochSeconds > 0 ? epochSeconds : 0;
        }
    }
    
    // If not a Date, try to convert to number
    if (typeof dateValue === 'string') {
        const num = parseInt(dateValue);
        return isNaN(num) ? 0 : num;
    }
    
    return 0; // default fallback
}

problematicRestaurants.forEach(restaurant => {
    let restaurantNeedsUpdate = false;
    let updateFields = {};
    
    print(`\n🔧 Đang xử lý Restaurant: ${restaurant.basicInfo?.name || 'N/A'} (${restaurant._id})`);
    
    // Check và fix dayOfWeek
    if (typeof restaurant.dayOfWeek !== 'number' && restaurant.dayOfWeek !== undefined) {
        totalIssues++;
        print(`  dayOfWeek: type = ${typeof restaurant.dayOfWeek}, value = ${restaurant.dayOfWeek}`);
        
        const newValue = dateToInt(restaurant.dayOfWeek, 'dayOfWeek');
        updateFields.dayOfWeek = newValue;
        print(`    ✅ Fixed: dayOfWeek = ${newValue}`);
        restaurantNeedsUpdate = true;
    }
    
    // Check và fix deliveryRadius
    if (typeof restaurant.deliveryRadius !== 'number' && restaurant.deliveryRadius !== undefined) {
        totalIssues++;
        print(`  deliveryRadius: type = ${typeof restaurant.deliveryRadius}, value = ${restaurant.deliveryRadius}`);
        
        const newValue = dateToInt(restaurant.deliveryRadius, 'deliveryRadius');
        updateFields.deliveryRadius = newValue;
        print(`    ✅ Fixed: deliveryRadius = ${newValue}`);
        restaurantNeedsUpdate = true;
    }
    
    // Check và fix estimatedDeliveryTime
    if (typeof restaurant.estimatedDeliveryTime !== 'number' && restaurant.estimatedDeliveryTime !== undefined) {
        totalIssues++;
        print(`  estimatedDeliveryTime: type = ${typeof restaurant.estimatedDeliveryTime}, value = ${restaurant.estimatedDeliveryTime}`);
        
        const newValue = dateToInt(restaurant.estimatedDeliveryTime, 'estimatedDeliveryTime');
        updateFields.estimatedDeliveryTime = newValue;
        print(`    ✅ Fixed: estimatedDeliveryTime = ${newValue}`);
        restaurantNeedsUpdate = true;
    }
    
    // Check và fix totalReviews
    if (typeof restaurant.totalReviews !== 'number' && restaurant.totalReviews !== undefined) {
        totalIssues++;
        print(`  totalReviews: type = ${typeof restaurant.totalReviews}, value = ${restaurant.totalReviews}`);
        
        const newValue = dateToInt(restaurant.totalReviews, 'totalReviews');
        updateFields.totalReviews = newValue;
        print(`    ✅ Fixed: totalReviews = ${newValue}`);
        restaurantNeedsUpdate = true;
    }
    
    // Update restaurant nếu có thay đổi
    if (restaurantNeedsUpdate) {
        const result = db.restaurants.updateOne(
            { _id: restaurant._id },
            { $set: updateFields }
        );
        
        if (result.modifiedCount > 0) {
            fixedCount++;
            print(`  ✅ Updated restaurant ${restaurant.basicInfo?.name || 'N/A'} successfully`);
        } else {
            print(`  ❌ Failed to update restaurant ${restaurant.basicInfo?.name || 'N/A'}`);
        }
    }
});

print("\n📊 KẾT QUẢ FIX:");
print(`- Tổng số int fields có vấn đề: ${totalIssues}`);
print(`- Số restaurants đã fix: ${fixedCount}`);

// Verify kết quả
const remainingIssues = db.restaurants.countDocuments({
    $or: [
        { dayOfWeek: { $not: { $type: "number" } } },
        { deliveryRadius: { $not: { $type: "number" } } },
        { estimatedDeliveryTime: { $not: { $type: "number" } } },
        { totalReviews: { $not: { $type: "number" } } }
    ]
});

print(`- Restaurants còn lại có vấn đề: ${remainingIssues}`);

if (remainingIssues === 0) {
    print("\n🎉 TẤT CẢ INT FIELDS TRONG RESTAURANTS ĐÃ ĐƯỢC FIX THÀNH CÔNG!");
} else {
    print("\n⚠️  Vẫn còn restaurants có vấn đề, cần kiểm tra thêm.");
}

print("\n✅ SCRIPT HOÀN THÀNH!"); 