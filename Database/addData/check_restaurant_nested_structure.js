// Script kiểm tra đúng nested structure của restaurants theo Java entity
// Kiểm tra operatingHours.dayOfWeek, delivery.deliveryRadius, etc.

print("=== KIỂM TRA NESTED STRUCTURE RESTAURANTS ===");

// Kết nối database
use('food_delivery_app');

// Lấy 1 restaurant để xem structure thực tế
const sampleRestaurant = db.restaurants.findOne();

print("\n📋 ACTUAL RESTAURANT STRUCTURE:");
print("Restaurant ID:", sampleRestaurant._id);
print("Restaurant Name:", sampleRestaurant.basicInfo?.name);

print("\n🔍 KIỂM TRA NESTED FIELDS:");

// Kiểm tra operatingHours.dayOfWeek
if (sampleRestaurant.operatingHours && Array.isArray(sampleRestaurant.operatingHours)) {
    print("operatingHours: Array with", sampleRestaurant.operatingHours.length, "items");
    sampleRestaurant.operatingHours.forEach((hour, index) => {
        print(`  [${index}] dayOfWeek: ${hour.dayOfWeek} (type: ${typeof hour.dayOfWeek})`);
    });
} else {
    print("operatingHours: Not found or not array");
}

// Kiểm tra delivery fields
if (sampleRestaurant.delivery) {
    print("delivery object found:");
    print(`  deliveryRadius: ${sampleRestaurant.delivery.deliveryRadius} (type: ${typeof sampleRestaurant.delivery.deliveryRadius})`);
    print(`  estimatedDeliveryTime: ${sampleRestaurant.delivery.estimatedDeliveryTime} (type: ${typeof sampleRestaurant.delivery.estimatedDeliveryTime})`);
} else {
    print("delivery object: Not found");
}

// Kiểm tra ratings.totalReviews  
if (sampleRestaurant.ratings) {
    print("ratings object found:");
    print(`  totalReviews: ${sampleRestaurant.ratings.totalReviews} (type: ${typeof sampleRestaurant.ratings.totalReviews})`);
} else {
    print("ratings object: Not found");
}

print("\n🔢 THỐNG KÊ CONVERTER ISSUES ĐÚNG NESTED PATHS:");

// Tìm restaurants có nested fields bị sai type
const problematicOperatingHours = db.restaurants.countDocuments({
    "operatingHours.dayOfWeek": { $not: { $type: "number" } }
});

const problematicDeliveryRadius = db.restaurants.countDocuments({
    "delivery.deliveryRadius": { $not: { $type: "number" } }
});

const problematicEstimatedDeliveryTime = db.restaurants.countDocuments({
    "delivery.estimatedDeliveryTime": { $not: { $type: "number" } }
});

const problematicTotalReviews = db.restaurants.countDocuments({
    "ratings.totalReviews": { $not: { $type: "number" } }
});

print("Restaurants có operatingHours.dayOfWeek không phải number:", problematicOperatingHours);
print("Restaurants có delivery.deliveryRadius không phải number:", problematicDeliveryRadius);
print("Restaurants có delivery.estimatedDeliveryTime không phải number:", problematicEstimatedDeliveryTime);
print("Restaurants có ratings.totalReviews không phải number:", problematicTotalReviews);

print("\n📊 AGGREGATE KIỂM TRA NESTED TYPES:");

const nestedTypeStats = db.restaurants.aggregate([
    {
        $project: {
            name: "$basicInfo.name",
            operatingHours_count: { $size: { $ifNull: ["$operatingHours", []] } },
            operatingHours_dayOfWeek_types: {
                $map: {
                    input: { $ifNull: ["$operatingHours", []] },
                    as: "hour",
                    in: { $type: "$$hour.dayOfWeek" }
                }
            },
            delivery_deliveryRadius_type: { $type: "$delivery.deliveryRadius" },
            delivery_estimatedDeliveryTime_type: { $type: "$delivery.estimatedDeliveryTime" },
            ratings_totalReviews_type: { $type: "$ratings.totalReviews" }
        }
    },
    { $limit: 3 }
]).toArray();

print("Sample nested type analysis:");
nestedTypeStats.forEach((restaurant, index) => {
    print(`\nRestaurant ${index + 1}: ${restaurant.name}`);
    print(`  operatingHours count: ${restaurant.operatingHours_count}`);
    print(`  operatingHours dayOfWeek types: [${restaurant.operatingHours_dayOfWeek_types.join(', ')}]`);
    print(`  delivery.deliveryRadius type: ${restaurant.delivery_deliveryRadius_type}`);
    print(`  delivery.estimatedDeliveryTime type: ${restaurant.delivery_estimatedDeliveryTime_type}`);
    print(`  ratings.totalReviews type: ${restaurant.ratings_totalReviews_type}`);
});

print("\n🎯 KIỂM TRA CÁC RESTAURANTS CÓ VẤN ĐỀ:");

// Tìm restaurants có bất kỳ nested field nào bị sai type
const problematicRestaurants = db.restaurants.find({
    $or: [
        { "operatingHours.dayOfWeek": { $not: { $type: "number" } } },
        { "delivery.deliveryRadius": { $not: { $type: "number" } } },
        { "delivery.estimatedDeliveryTime": { $not: { $type: "number" } } },
        { "ratings.totalReviews": { $not: { $type: "number" } } }
    ]
}).limit(5);

print("Restaurants có nested fields bị sai type:");
problematicRestaurants.forEach(restaurant => {
    print(`\n⚠️  ${restaurant.basicInfo?.name} (${restaurant._id})`);
    
    // Check operating hours
    if (restaurant.operatingHours) {
        restaurant.operatingHours.forEach((hour, index) => {
            if (typeof hour.dayOfWeek !== 'number') {
                print(`  operatingHours[${index}].dayOfWeek: ${typeof hour.dayOfWeek} - ${hour.dayOfWeek}`);
            }
        });
    }
    
    // Check delivery fields
    if (restaurant.delivery) {
        if (typeof restaurant.delivery.deliveryRadius !== 'number') {
            print(`  delivery.deliveryRadius: ${typeof restaurant.delivery.deliveryRadius} - ${restaurant.delivery.deliveryRadius}`);
        }
        if (typeof restaurant.delivery.estimatedDeliveryTime !== 'number') {
            print(`  delivery.estimatedDeliveryTime: ${typeof restaurant.delivery.estimatedDeliveryTime} - ${restaurant.delivery.estimatedDeliveryTime}`);
        }
    }
    
    // Check ratings
    if (restaurant.ratings && typeof restaurant.ratings.totalReviews !== 'number') {
        print(`  ratings.totalReviews: ${typeof restaurant.ratings.totalReviews} - ${restaurant.ratings.totalReviews}`);
    }
});

print("\n✅ KIỂM TRA NESTED STRUCTURE HOÀN THÀNH!"); 