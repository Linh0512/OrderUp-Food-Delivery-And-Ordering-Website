// Sử dụng database food_delivery_app
use('food_delivery_app');

const restaurantId = "684844b71a05cf815c50eb79";

print(`=== Kiểm tra Dishes của Restaurant ${restaurantId} ===`);

// Tìm tất cả dishes của restaurant này
const dishes = db.dishes.find({
    "restaurantId": ObjectId(restaurantId)
}).toArray();

print(`Tìm thấy ${dishes.length} dishes của restaurant này`);

if (dishes.length === 0) {
    print('Không có dishes nào thuộc restaurant này!');
} else {
    print('\n=== Chi tiết từng dish ===');
    
    dishes.forEach((dish, index) => {
        print(`\n--- Dish ${index + 1}: ${dish._id} ---`);
        print(`Name: ${dish.basicInfo?.name || 'Unnamed'}`);
        
        // Kiểm tra pricing
        if (dish.pricing) {
            print(`pricing.basePrice: ${dish.pricing.basePrice} (${typeof dish.pricing.basePrice})`);
            if (dish.pricing.basePrice instanceof Date) {
                print(`  ⚠️  basePrice là Date - CẦN FIX!`);
            }
            
            print(`pricing.discountPrice: ${dish.pricing.discountPrice} (${typeof dish.pricing.discountPrice})`);
            if (dish.pricing.discountPrice instanceof Date) {
                print(`  ⚠️  discountPrice là Date - CẦN FIX!`);
            }
        }
        
        // Kiểm tra preparationTime
        if (dish.preparationTime !== undefined) {
            print(`preparationTime: ${dish.preparationTime} (${typeof dish.preparationTime})`);
            if (dish.preparationTime instanceof Date) {
                print(`  ⚠️  preparationTime là Date - CẦN FIX!`);
            }
        }
        
        // Kiểm tra options.choices.price
        if (dish.options && dish.options.length > 0) {
            print(`Có ${dish.options.length} options:`);
            dish.options.forEach((option, optIndex) => {
                print(`  Option ${optIndex + 1}: ${option.name}`);
                if (option.choices && option.choices.length > 0) {
                    option.choices.forEach((choice, choiceIndex) => {
                        print(`    Choice ${choiceIndex + 1}: ${choice.name} - price: ${choice.price} (${typeof choice.price})`);
                        if (choice.price instanceof Date) {
                            print(`      ⚠️  price là Date - CẦN FIX!`);
                        }
                    });
                }
            });
        }
        
        // Kiểm tra ratings
        if (dish.ratings) {
            if (dish.ratings.totalReviews !== undefined) {
                print(`ratings.totalReviews: ${dish.ratings.totalReviews} (${typeof dish.ratings.totalReviews})`);
                if (dish.ratings.totalReviews instanceof Date) {
                    print(`  ⚠️  totalReviews là Date - CẦN FIX!`);
                }
            }
        }
        
        // Kiểm tra stats
        if (dish.stats) {
            if (dish.stats.totalOrders !== undefined) {
                print(`stats.totalOrders: ${dish.stats.totalOrders} (${typeof dish.stats.totalOrders})`);
                if (dish.stats.totalOrders instanceof Date) {
                    print(`  ⚠️  totalOrders là Date - CẦN FIX!`);
                }
            }
            if (dish.stats.viewCount !== undefined) {
                print(`stats.viewCount: ${dish.stats.viewCount} (${typeof dish.stats.viewCount})`);
                if (dish.stats.viewCount instanceof Date) {
                    print(`  ⚠️  viewCount là Date - CẦN FIX!`);
                }
            }
        }
    });
    
    // Tìm tất cả dishes có vấn đề trong restaurant này
    print('\n=== Tóm tắt vấn đề ===');
    
    const badDishes = db.dishes.find({
        "restaurantId": ObjectId(restaurantId),
        $or: [
            { 'pricing.basePrice': { $type: 'date' } },
            { 'pricing.discountPrice': { $type: 'date' } },
            { 'preparationTime': { $type: 'date' } },
            { 'options.choices.price': { $type: 'date' } },
            { 'ratings.totalReviews': { $type: 'date' } },
            { 'stats.totalOrders': { $type: 'date' } },
            { 'stats.viewCount': { $type: 'date' } }
        ]
    }).count();
    
    print(`Dishes có vấn đề trong restaurant này: ${badDishes}`);
    
    if (badDishes > 0) {
        print('❌ Vẫn còn dishes có vấn đề cần fix!');
    } else {
        print('✅ Tất cả dishes đã OK!');
    }
} 