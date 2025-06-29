// Script để kiểm tra Map fields trong restaurants
use('food_delivery_app');

print("=== Kiểm tra Map fields trong restaurants ===");

const sampleRestaurant = db.restaurants.findOne({});
if (!sampleRestaurant) {
    print("Không tìm thấy restaurant nào!");
    quit();
}

print(`Kiểm tra restaurant ID: ${sampleRestaurant._id}`);

// Kiểm tra ratingBreakdown trong ratings
if (sampleRestaurant.ratings && sampleRestaurant.ratings.ratingBreakdown) {
    print("\n=== RatingBreakdown ===");
    const ratingBreakdown = sampleRestaurant.ratings.ratingBreakdown;
    print(`ratingBreakdown: ${JSON.stringify(ratingBreakdown)}`);
    
    for (let [key, value] of Object.entries(ratingBreakdown)) {
        print(`  ${key}: ${value} (type: ${typeof value})`);
        if (value instanceof Date) {
            print(`    >>> PROBLEM: ${key} is Date instead of Integer!`);
        }
    }
}

// Tìm tất cả restaurants có vấn đề với ratingBreakdown
print("\n=== Tìm restaurants có vấn đề với ratingBreakdown ===");

const allRestaurants = db.restaurants.find({}).toArray();
let problemCount = 0;

for (let restaurant of allRestaurants) {
    if (restaurant.ratings && restaurant.ratings.ratingBreakdown) {
        let hasDateValues = false;
        const breakdown = restaurant.ratings.ratingBreakdown;
        
        for (let [key, value] of Object.entries(breakdown)) {
            if (value instanceof Date) {
                hasDateValues = true;
                print(`Restaurant ${restaurant._id}: ratingBreakdown.${key} = ${value} (Date instead of Integer)`);
            }
        }
        
        if (hasDateValues) {
            problemCount++;
        }
    }
}

print(`\nTổng cộng ${problemCount} restaurants có vấn đề với ratingBreakdown`);

// Kiểm tra xem có field Map nào khác không
print("\n=== Kiểm tra các field Map khác ===");
if (sampleRestaurant.businessInfo && sampleRestaurant.businessInfo.additionalInfo) {
    print("BusinessInfo additionalInfo found");
    print(`additionalInfo: ${JSON.stringify(sampleRestaurant.businessInfo.additionalInfo)}`);
} 