// Script để kiểm tra tất cả các field int trong restaurants
use('food_delivery_app');

print("=== Kiểm tra các field int trong restaurants ===");

const sampleRestaurant = db.restaurants.findOne({});
if (!sampleRestaurant) {
    print("Không tìm thấy restaurant nào!");
    quit();
}

print(`Kiểm tra restaurant ID: ${sampleRestaurant._id}`);

// Kiểm tra các field int có thể có vấn đề
const fieldsToCheck = [
    'delivery.deliveryRadius',
    'delivery.estimatedDeliveryTime', 
    'ratings.totalReviews',
    'operatingHours.*.dayOfWeek'
];

// Kiểm tra delivery info
if (sampleRestaurant.delivery) {
    print("\n=== Delivery Info ===");
    print(`deliveryRadius: ${sampleRestaurant.delivery.deliveryRadius} (type: ${typeof sampleRestaurant.delivery.deliveryRadius})`);
    print(`estimatedDeliveryTime: ${sampleRestaurant.delivery.estimatedDeliveryTime} (type: ${typeof sampleRestaurant.delivery.estimatedDeliveryTime})`);
    print(`deliveryFee: ${sampleRestaurant.delivery.deliveryFee} (type: ${typeof sampleRestaurant.delivery.deliveryFee})`);
    print(`freeDeliveryThreshold: ${sampleRestaurant.delivery.freeDeliveryThreshold} (type: ${typeof sampleRestaurant.delivery.freeDeliveryThreshold})`);
}

// Kiểm tra ratings info
if (sampleRestaurant.ratings) {
    print("\n=== Ratings Info ===");
    print(`totalReviews: ${sampleRestaurant.ratings.totalReviews} (type: ${typeof sampleRestaurant.ratings.totalReviews})`);
    print(`averageRating: ${sampleRestaurant.ratings.averageRating} (type: ${typeof sampleRestaurant.ratings.averageRating})`);
}

// Kiểm tra operating hours 
if (sampleRestaurant.operatingHours && sampleRestaurant.operatingHours.length > 0) {
    print("\n=== Operating Hours ===");
    for (let i = 0; i < Math.min(3, sampleRestaurant.operatingHours.length); i++) {
        const hour = sampleRestaurant.operatingHours[i];
        print(`  operatingHours[${i}].dayOfWeek: ${hour.dayOfWeek} (type: ${typeof hour.dayOfWeek})`);
        if (hour.dayOfWeek instanceof Date) {
            print(`    >>> PROBLEM: dayOfWeek is Date instead of int!`);
        }
    }
}

// Tìm tất cả restaurants có vấn đề với int fields
print("\n=== Tìm tất cả restaurants có vấn đề ===");

// Tìm restaurants có delivery.deliveryRadius là Date thay vì int
const problemRestaurants1 = db.restaurants.find({
    "delivery.deliveryRadius": { $type: "date" }
}).toArray();

print(`Restaurants có delivery.deliveryRadius là Date: ${problemRestaurants1.length}`);

// Tìm restaurants có delivery.estimatedDeliveryTime là Date thay vì int  
const problemRestaurants2 = db.restaurants.find({
    "delivery.estimatedDeliveryTime": { $type: "date" }
}).toArray();

print(`Restaurants có delivery.estimatedDeliveryTime là Date: ${problemRestaurants2.length}`);

// Tìm restaurants có ratings.totalReviews là Date thay vì int
const problemRestaurants3 = db.restaurants.find({
    "ratings.totalReviews": { $type: "date" }
}).toArray();

print(`Restaurants có ratings.totalReviews là Date: ${problemRestaurants3.length}`);

// Liệt kê một vài sample restaurants có vấn đề
if (problemRestaurants1.length > 0) {
    print("\nSample restaurant có delivery.deliveryRadius là Date:");
    const sample = problemRestaurants1[0];
    print(`ID: ${sample._id}`);
    print(`deliveryRadius: ${sample.delivery.deliveryRadius} (type: ${typeof sample.delivery.deliveryRadius})`);
}

if (problemRestaurants2.length > 0) {
    print("\nSample restaurant có delivery.estimatedDeliveryTime là Date:");
    const sample = problemRestaurants2[0];
    print(`ID: ${sample._id}`);
    print(`estimatedDeliveryTime: ${sample.delivery.estimatedDeliveryTime} (type: ${typeof sample.delivery.estimatedDeliveryTime})`);
}

if (problemRestaurants3.length > 0) {
    print("\nSample restaurant có ratings.totalReviews là Date:");
    const sample = problemRestaurants3[0];
    print(`ID: ${sample._id}`);
    print(`totalReviews: ${sample.ratings.totalReviews} (type: ${typeof sample.ratings.totalReviews})`);
} 