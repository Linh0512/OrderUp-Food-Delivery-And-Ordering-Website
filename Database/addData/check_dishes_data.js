// Sử dụng database food_delivery_app
use('food_delivery_app');

print('=== Kiểm tra Dishes collection ===');

// Đếm tổng số dishes
const totalDishes = db.dishes.countDocuments();
print(`Tổng số dishes: ${totalDishes}`);

if (totalDishes === 0) {
    print('Không có dishes nào trong collection!');
} else {
    // Lấy 1 sample dish
    const sampleDish = db.dishes.findOne();
    print('\n=== Sample dish structure ===');
    print(JSON.stringify(sampleDish, null, 2));
    
    // Kiểm tra các field int trong Java entity
    print('\n=== Kiểm tra type của các field ===');
    
    if (sampleDish.pricing) {
        print(`pricing.basePrice: ${sampleDish.pricing.basePrice} (type: ${typeof sampleDish.pricing.basePrice})`);
        print(`pricing.discountPrice: ${sampleDish.pricing.discountPrice} (type: ${typeof sampleDish.pricing.discountPrice})`);
    }
    
    if (sampleDish.preparationTime !== undefined) {
        print(`preparationTime: ${sampleDish.preparationTime} (type: ${typeof sampleDish.preparationTime})`);
    }
    
    if (sampleDish.ratings) {
        print(`ratings.totalReviews: ${sampleDish.ratings.totalReviews} (type: ${typeof sampleDish.ratings.totalReviews})`);
    }
    
    if (sampleDish.stats) {
        print(`stats.totalOrders: ${sampleDish.stats.totalOrders} (type: ${typeof sampleDish.stats.totalOrders})`);
        print(`stats.viewCount: ${sampleDish.stats.viewCount} (type: ${typeof sampleDish.stats.viewCount})`);
    }
    
    // Kiểm tra nested objects như options
    if (sampleDish.options && sampleDish.options.length > 0) {
        print('\n=== Kiểm tra Options ===');
        sampleDish.options.forEach((option, i) => {
            if (option.choices && option.choices.length > 0) {
                option.choices.forEach((choice, j) => {
                    print(`options[${i}].choices[${j}].price: ${choice.price} (type: ${typeof choice.price})`);
                });
            }
        });
    }
    
    // Tìm các dishes có field type mismatch
    print('\n=== Tìm dishes có vấn đề type ===');
    
    // Kiểm tra basePrice
    const badBasePrice = db.dishes.find({
        'pricing.basePrice': { $type: 'date' }
    }).count();
    print(`Dishes có pricing.basePrice là Date: ${badBasePrice}`);
    
    // Kiểm tra discountPrice  
    const badDiscountPrice = db.dishes.find({
        'pricing.discountPrice': { $type: 'date' }
    }).count();
    print(`Dishes có pricing.discountPrice là Date: ${badDiscountPrice}`);
    
    // Kiểm tra preparationTime
    const badPrepTime = db.dishes.find({
        'preparationTime': { $type: 'date' }
    }).count();
    print(`Dishes có preparationTime là Date: ${badPrepTime}`);
    
    // Kiểm tra choice prices trong options
    const badChoicePrice = db.dishes.find({
        'options.choices.price': { $type: 'date' }
    }).count();
    print(`Dishes có options.choices.price là Date: ${badChoicePrice}`);
    
    // Nếu có vấn đề, hiển thị chi tiết
    if (badBasePrice > 0 || badDiscountPrice > 0 || badPrepTime > 0 || badChoicePrice > 0) {
        print('\n=== Chi tiết dishes có vấn đề ===');
        
        const problemDishes = db.dishes.find({
            $or: [
                { 'pricing.basePrice': { $type: 'date' } },
                { 'pricing.discountPrice': { $type: 'date' } },
                { 'preparationTime': { $type: 'date' } },
                { 'options.choices.price': { $type: 'date' } }
            ]
        }).toArray();
        
        problemDishes.forEach((dish, i) => {
            print(`\nProblem dish ${i + 1}: ${dish._id}`);
            if (dish.basicInfo && dish.basicInfo.name) {
                print(`Name: ${dish.basicInfo.name}`);
            }
            
            if (dish.pricing) {
                print(`basePrice: ${dish.pricing.basePrice} (${typeof dish.pricing.basePrice})`);
                print(`discountPrice: ${dish.pricing.discountPrice} (${typeof dish.pricing.discountPrice})`);
            }
            
            if (dish.preparationTime !== undefined) {
                print(`preparationTime: ${dish.preparationTime} (${typeof dish.preparationTime})`);
            }
        });
    }
} 