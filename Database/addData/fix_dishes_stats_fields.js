// Sử dụng database food_delivery_app
use('food_delivery_app');

print('=== Fix Dishes Stats Fields ===');

// Tìm tất cả dishes có vấn đề với stats fields
const problemDishes = db.dishes.find({
    $or: [
        { 'stats.totalOrders': { $type: 'date' } },
        { 'stats.viewCount': { $type: 'date' } }
    ]
}).toArray();

print(`Tìm thấy ${problemDishes.length} dishes cần fix stats fields`);

let fixedCount = 0;
let totalFieldsFixed = 0;

problemDishes.forEach((dish, index) => {
    print(`\n--- Dish ${index + 1}: ${dish._id} (${dish.basicInfo?.name || 'Unnamed'}) ---`);
    
    let dishUpdated = false;
    
    if (dish.stats) {
        // Fix totalOrders if it's a Date
        if (dish.stats.totalOrders instanceof Date) {
            const originalTimestamp = dish.stats.totalOrders.getTime();
            print(`  totalOrders: ${dish.stats.totalOrders} -> ${originalTimestamp}`);
            dish.stats.totalOrders = originalTimestamp;
            dishUpdated = true;
            totalFieldsFixed++;
        }
        
        // Fix viewCount if it's a Date  
        if (dish.stats.viewCount instanceof Date) {
            const originalTimestamp = dish.stats.viewCount.getTime();
            print(`  viewCount: ${dish.stats.viewCount} -> ${originalTimestamp}`);
            dish.stats.viewCount = originalTimestamp;
            dishUpdated = true;
            totalFieldsFixed++;
        }
    }
    
    // Update the dish in database if any changes made
    if (dishUpdated) {
        try {
            db.dishes.replaceOne(
                { _id: dish._id },
                dish
            );
            fixedCount++;
            print(`  ✓ Updated dish ${dish._id}`);
        } catch (error) {
            print(`  ✗ Error updating dish ${dish._id}: ${error}`);
        }
    }
});

print(`\n=== Summary ===`);
print(`Dishes cần fix: ${problemDishes.length}`);
print(`Dishes đã fix: ${fixedCount}`);
print(`Total fields đã fix: ${totalFieldsFixed}`);

// Verify the fix
print('\n=== Verification ===');
const remainingProblems = db.dishes.find({
    $or: [
        { 'stats.totalOrders': { $type: 'date' } },
        { 'stats.viewCount': { $type: 'date' } }
    ]
}).count();

print(`Dishes còn lại có vấn đề: ${remainingProblems}`);

if (remainingProblems === 0) {
    print('✓ Tất cả dishes stats fields đã được fix thành công!');
} else {
    print('✗ Vẫn còn vấn đề, cần kiểm tra lại');
}

// Kiểm tra cụ thể restaurant đang gặp lỗi
print('\n=== Kiểm tra lại Restaurant 684844b71a05cf815c50eb79 ===');
const restaurantDishesFixed = db.dishes.find({
    "restaurantId": ObjectId("684844b71a05cf815c50eb79"),
    $or: [
        { 'stats.totalOrders': { $type: 'date' } },
        { 'stats.viewCount': { $type: 'date' } }
    ]
}).count();

print(`Restaurant dishes còn vấn đề: ${restaurantDishesFixed}`);
if (restaurantDishesFixed === 0) {
    print('✅ Restaurant này đã OK!');
} else {
    print('❌ Restaurant này vẫn còn vấn đề!');
} 