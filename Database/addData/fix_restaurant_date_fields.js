// Script fix restaurant "Trà Đào Nhà Làm" có nested int fields bị convert thành Date
// Target: restaurant ID 684844b71a05cf815c50eb79

print("=== FIX RESTAURANT DATE FIELDS ===");

// Kết nối database
use('food_delivery_app');

const problematicRestaurantId = ObjectId('684844b71a05cf815c50eb79');

// Lấy restaurant có vấn đề
const restaurant = db.restaurants.findOne({ _id: problematicRestaurantId });

if (!restaurant) {
    print("❌ Không tìm thấy restaurant với ID:", problematicRestaurantId);
    exit;
}

print(`🔧 Đang fix restaurant: ${restaurant.basicInfo?.name} (${restaurant._id})`);

// Helper function để convert Date back to appropriate int
function dateToInt(dateValue, fieldName) {
    if (dateValue instanceof Date) {
        const epochSeconds = Math.floor(dateValue.getTime() / 1000);
        
        switch(fieldName) {
            case 'dayOfWeek':
                // dayOfWeek: 0-6 (Sunday=0, Monday=1, etc.)
                return (epochSeconds >= 0 && epochSeconds <= 6) ? epochSeconds : epochSeconds % 7;
            case 'deliveryRadius':
                // deliveryRadius: usually 3-15 km
                return (epochSeconds > 0 && epochSeconds <= 50) ? epochSeconds : 5;
            case 'estimatedDeliveryTime':
                // delivery time: usually 15-60 minutes
                return (epochSeconds > 0 && epochSeconds <= 120) ? epochSeconds : 30;
            case 'totalReviews':
                // number of reviews: can be large
                return epochSeconds > 0 ? epochSeconds : 0;
            default:
                return epochSeconds;
        }
    }
    return dateValue;
}

let hasUpdates = false;
let updateOperations = {};

// Fix operatingHours.dayOfWeek
if (restaurant.operatingHours && Array.isArray(restaurant.operatingHours)) {
    print("\n🕐 Fixing operatingHours:");
    
    const fixedOperatingHours = restaurant.operatingHours.map((hour, index) => {
        if (hour.dayOfWeek instanceof Date) {
            const oldValue = hour.dayOfWeek;
            const newValue = dateToInt(hour.dayOfWeek, 'dayOfWeek');
            print(`  [${index}] dayOfWeek: ${oldValue} → ${newValue}`);
            
            return {
                ...hour,
                dayOfWeek: newValue
            };
        }
        return hour;
    });
    
    updateOperations.operatingHours = fixedOperatingHours;
    hasUpdates = true;
}

// Fix delivery fields
if (restaurant.delivery) {
    print("\n🚚 Fixing delivery fields:");
    let fixedDelivery = { ...restaurant.delivery };
    
    if (restaurant.delivery.deliveryRadius instanceof Date) {
        const oldValue = restaurant.delivery.deliveryRadius;
        const newValue = dateToInt(restaurant.delivery.deliveryRadius, 'deliveryRadius');
        print(`  deliveryRadius: ${oldValue} → ${newValue}`);
        fixedDelivery.deliveryRadius = newValue;
        hasUpdates = true;
    }
    
    if (restaurant.delivery.estimatedDeliveryTime instanceof Date) {
        const oldValue = restaurant.delivery.estimatedDeliveryTime;
        const newValue = dateToInt(restaurant.delivery.estimatedDeliveryTime, 'estimatedDeliveryTime');
        print(`  estimatedDeliveryTime: ${oldValue} → ${newValue}`);
        fixedDelivery.estimatedDeliveryTime = newValue;
        hasUpdates = true;
    }
    
    if (hasUpdates) {
        updateOperations.delivery = fixedDelivery;
    }
}

// Fix ratings.totalReviews
if (restaurant.ratings && restaurant.ratings.totalReviews instanceof Date) {
    print("\n⭐ Fixing ratings:");
    const oldValue = restaurant.ratings.totalReviews;
    const newValue = dateToInt(restaurant.ratings.totalReviews, 'totalReviews');
    print(`  totalReviews: ${oldValue} → ${newValue}`);
    
    updateOperations.ratings = {
        ...restaurant.ratings,
        totalReviews: newValue
    };
    hasUpdates = true;
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
        print("operatingHours dayOfWeek types:", 
              updatedRestaurant.operatingHours.map(h => typeof h.dayOfWeek));
        print("delivery.deliveryRadius type:", typeof updatedRestaurant.delivery.deliveryRadius);
        print("delivery.estimatedDeliveryTime type:", typeof updatedRestaurant.delivery.estimatedDeliveryTime);
        print("ratings.totalReviews type:", typeof updatedRestaurant.ratings.totalReviews);
        
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
        { "operatingHours.dayOfWeek": { $not: { $type: "number" } } },
        { "delivery.deliveryRadius": { $not: { $type: "number" } } },
        { "delivery.estimatedDeliveryTime": { $not: { $type: "number" } } },
        { "ratings.totalReviews": { $not: { $type: "number" } } }
    ]
});

print(`Restaurants còn lại có vấn đề: ${remainingIssues}`);

if (remainingIssues === 0) {
    print("\n🎉 TẤT CẢ NESTED INT FIELDS TRONG RESTAURANTS ĐÃ ĐƯỢC FIX!");
    print("Bây giờ có thể test lại restaurant listing API.");
} else {
    print("\n⚠️  Vẫn còn restaurants khác có vấn đề.");
}

print("\n✅ SCRIPT HOÀN THÀNH!"); 