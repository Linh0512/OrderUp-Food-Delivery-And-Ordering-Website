// Script fix rating breakdown fields trong restaurant "Trà Đào Nhà Làm"
// Target: restaurant ID 684844b71a05cf815c50eb79

print("=== FIX RESTAURANT RATING BREAKDOWN ===");

use('food_delivery_app');

const problematicRestaurantId = ObjectId('684844b71a05cf815c50eb79');

// Lấy restaurant có vấn đề
const restaurant = db.restaurants.findOne({ _id: problematicRestaurantId });

if (!restaurant) {
    print("❌ Không tìm thấy restaurant với ID:", problematicRestaurantId);
    exit;
}

print(`🔧 Đang fix restaurant: ${restaurant.basicInfo?.name} (${restaurant._id})`);

// Helper function để convert Date back to int
function dateToInt(dateValue) {
    if (dateValue instanceof Date) {
        const epochSeconds = Math.floor(dateValue.getTime() / 1000);
        return epochSeconds >= 0 ? epochSeconds : 0;
    }
    return dateValue;
}

let hasUpdates = false;
let updateOperations = {};

// Fix ratings.ratingBreakdown
if (restaurant.ratings && restaurant.ratings.ratingBreakdown) {
    print("\n⭐ Fixing ratings.ratingBreakdown:");
    
    let fixedRatingBreakdown = {};
    let needsRatingFix = false;
    
    for (let key in restaurant.ratings.ratingBreakdown) {
        const value = restaurant.ratings.ratingBreakdown[key];
        
        if (value instanceof Date) {
            const oldValue = value;
            const newValue = dateToInt(value);
            print(`  ${key}: ${oldValue} → ${newValue}`);
            fixedRatingBreakdown[key] = newValue;
            needsRatingFix = true;
        } else {
            fixedRatingBreakdown[key] = value;
        }
    }
    
    if (needsRatingFix) {
        updateOperations.ratings = {
            ...restaurant.ratings,
            ratingBreakdown: fixedRatingBreakdown
        };
        hasUpdates = true;
    }
}

// Thực hiện update
if (hasUpdates) {
    print("\n💾 Đang update restaurant...");
    
    const result = db.restaurants.updateOne(
        { _id: problematicRestaurantId },
        { $set: updateOperations }
    );
    
    if (result.modifiedCount > 0) {
        print("✅ Update thành công!");
        
        // Verify kết quả
        const updatedRestaurant = db.restaurants.findOne({ _id: problematicRestaurantId });
        
        print("\n🔍 Verify kết quả:");
        for (let key in updatedRestaurant.ratings.ratingBreakdown) {
            const value = updatedRestaurant.ratings.ratingBreakdown[key];
            print(`  ${key}: ${value} (type: ${typeof value})`);
        }
        
    } else {
        print("❌ Update thất bại!");
    }
} else {
    print("\n✅ Không có fields nào cần fix.");
}

// Final verification  
print("\n📊 KIỂM TRA CUỐI CÙNG:");
const remainingIssues = db.restaurants.countDocuments({
    $or: [
        { "ratings.ratingBreakdown.5star": { $type: "date" } },
        { "ratings.ratingBreakdown.4star": { $type: "date" } },
        { "ratings.ratingBreakdown.3star": { $type: "date" } },
        { "ratings.ratingBreakdown.2star": { $type: "date" } },
        { "ratings.ratingBreakdown.1star": { $type: "date" } }
    ]
});

print(`Restaurants còn lại có ratingBreakdown issues: ${remainingIssues}`);

if (remainingIssues === 0) {
    print("\n🎉 TẤT CẢ RATING BREAKDOWN FIELDS ĐÃ ĐƯỢC FIX!");
    print("Bây giờ có thể test lại restaurant listing API.");
} else {
    print("\n⚠️  Vẫn còn restaurants khác có ratingBreakdown issues.");
}

print("\n✅ SCRIPT HOÀN THÀNH!"); 