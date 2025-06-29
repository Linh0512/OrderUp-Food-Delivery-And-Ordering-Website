// Sử dụng database food_delivery_app
use('food_delivery_app');

print('=== Fix Dishes Options Choice Price ===');

// Tìm tất cả dishes có vấn đề với choices.price
const problemDishes = db.dishes.find({
    'options.choices.price': { $type: 'date' }
}).toArray();

print(`Tìm thấy ${problemDishes.length} dishes cần fix`);

let fixedCount = 0;
let totalChoicesFixed = 0;

problemDishes.forEach((dish, index) => {
    print(`\n--- Dish ${index + 1}: ${dish._id} (${dish.basicInfo?.name || 'Unnamed'}) ---`);
    
    let dishUpdated = false;
    
    if (dish.options) {
        dish.options.forEach((option, optionIndex) => {
            if (option.choices) {
                option.choices.forEach((choice, choiceIndex) => {
                    if (choice.price instanceof Date) {
                        // Convert Date back to number (milliseconds since epoch)
                        const originalTimestamp = choice.price.getTime();
                        
                        print(`  Choice "${choice.name}": ${choice.price} -> ${originalTimestamp}`);
                        
                        // Update the choice price
                        choice.price = originalTimestamp;
                        dishUpdated = true;
                        totalChoicesFixed++;
                    }
                });
            }
        });
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
print(`Total choices đã fix: ${totalChoicesFixed}`);

// Verify the fix
print('\n=== Verification ===');
const remainingProblems = db.dishes.find({
    'options.choices.price': { $type: 'date' }
}).count();

print(`Dishes còn lại có vấn đề: ${remainingProblems}`);

if (remainingProblems === 0) {
    print('✓ Tất cả dishes đã được fix thành công!');
} else {
    print('✗ Vẫn còn vấn đề, cần kiểm tra lại');
} 