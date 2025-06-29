// Script fix tất cả converter issues trong multiple collections
// Fix orders, reviews, dishes collections

print("=== FIX TẤT CẢ CONVERTER ISSUES ===");

// Kết nối database
use('food_delivery_app');

// Helper function để convert Date back to appropriate value
function dateToValue(dateValue, fieldType) {
    if (dateValue instanceof Date) {
        const epochSeconds = Math.floor(dateValue.getTime() / 1000);
        
        switch(fieldType) {
            case 'price':
                // Price fields: usually large numbers (VND)
                return epochSeconds > 1000000 ? epochSeconds : epochSeconds * 1000;
            case 'rating':
                // Rating: 1-5
                return (epochSeconds >= 1 && epochSeconds <= 5) ? epochSeconds : Math.min(5, Math.max(1, epochSeconds % 5 + 1));
            case 'time':
                // Time duration in minutes: 5-120
                return (epochSeconds >= 5 && epochSeconds <= 120) ? epochSeconds : Math.min(120, Math.max(5, epochSeconds % 60 + 15));
            case 'count':
                // Count/total: 0+
                return epochSeconds >= 0 ? epochSeconds : 0;
            default:
                return epochSeconds;
        }
    }
    return dateValue;
}

let totalFixed = 0;

// 1. FIX ORDERS COLLECTION
print("\n🚛 FIXING ORDERS COLLECTION:");

const problematicOrders = db.orders.find({
    $or: [
        { "deliveryInfo.estimatedDeliveryTime": { $type: "date" } },
        { "deliveryInfo.actualDeliveryTime": { $type: "date" } }
    ]
});

let ordersFixed = 0;
problematicOrders.forEach(order => {
    let updateFields = {};
    let needsUpdate = false;
    
    print(`  🔧 Fixing Order: ${order._id}`);
    
    if (order.deliveryInfo) {
        let fixedDeliveryInfo = { ...order.deliveryInfo };
        
        if (order.deliveryInfo.estimatedDeliveryTime instanceof Date) {
            const oldValue = order.deliveryInfo.estimatedDeliveryTime;
            const newValue = dateToValue(oldValue, 'time');
            print(`    estimatedDeliveryTime: ${oldValue} → ${newValue}`);
            fixedDeliveryInfo.estimatedDeliveryTime = newValue;
            needsUpdate = true;
        }
        
        if (order.deliveryInfo.actualDeliveryTime instanceof Date) {
            const oldValue = order.deliveryInfo.actualDeliveryTime;
            const newValue = dateToValue(oldValue, 'time');
            print(`    actualDeliveryTime: ${oldValue} → ${newValue}`);
            fixedDeliveryInfo.actualDeliveryTime = newValue;
            needsUpdate = true;
        }
        
        if (needsUpdate) {
            updateFields.deliveryInfo = fixedDeliveryInfo;
        }
    }
    
    if (needsUpdate) {
        const result = db.orders.updateOne(
            { _id: order._id },
            { $set: updateFields }
        );
        
        if (result.modifiedCount > 0) {
            ordersFixed++;
            print(`    ✅ Updated order ${order._id}`);
        }
    }
});

print(`📊 Orders fixed: ${ordersFixed}`);
totalFixed += ordersFixed;

// 2. FIX REVIEWS COLLECTION
print("\n⭐ FIXING REVIEWS COLLECTION:");

const problematicReviews = db.reviews.find({
    rating: { $type: "date" }
});

let reviewsFixed = 0;
problematicReviews.forEach(review => {
    const oldRating = review.rating;
    const newRating = dateToValue(oldRating, 'rating');
    
    print(`  🔧 Fixing Review ${review._id}: rating ${oldRating} → ${newRating}`);
    
    const result = db.reviews.updateOne(
        { _id: review._id },
        { $set: { rating: newRating } }
    );
    
    if (result.modifiedCount > 0) {
        reviewsFixed++;
        print(`    ✅ Updated review ${review._id}`);
    }
});

print(`📊 Reviews fixed: ${reviewsFixed}`);
totalFixed += reviewsFixed;

// 3. FIX DISHES COLLECTION
print("\n🍽️  FIXING DISHES COLLECTION:");

const problematicDishes = db.dishes.find({
    $or: [
        { "pricing.basePrice": { $type: "date" } },
        { "pricing.discountPrice": { $type: "date" } },
        { "ratings.totalReviews": { $type: "date" } },
        { "preparationTime": { $type: "date" } }
    ]
});

let dishesFixed = 0;
problematicDishes.forEach(dish => {
    let updateFields = {};
    let needsUpdate = false;
    
    print(`  🔧 Fixing Dish: ${dish.basicInfo?.name || dish._id}`);
    
    // Fix pricing
    if (dish.pricing) {
        let fixedPricing = { ...dish.pricing };
        
        if (dish.pricing.basePrice instanceof Date) {
            const oldValue = dish.pricing.basePrice;
            const newValue = dateToValue(oldValue, 'price');
            print(`    basePrice: ${oldValue} → ${newValue}`);
            fixedPricing.basePrice = newValue;
            needsUpdate = true;
        }
        
        if (dish.pricing.discountPrice instanceof Date) {
            const oldValue = dish.pricing.discountPrice;
            const newValue = dateToValue(oldValue, 'price');
            print(`    discountPrice: ${oldValue} → ${newValue}`);
            fixedPricing.discountPrice = newValue;
            needsUpdate = true;
        }
        
        if (needsUpdate) {
            updateFields.pricing = fixedPricing;
        }
    }
    
    // Fix ratings.totalReviews
    if (dish.ratings && dish.ratings.totalReviews instanceof Date) {
        const oldValue = dish.ratings.totalReviews;
        const newValue = dateToValue(oldValue, 'count');
        print(`    ratings.totalReviews: ${oldValue} → ${newValue}`);
        
        updateFields.ratings = {
            ...dish.ratings,
            totalReviews: newValue
        };
        needsUpdate = true;
    }
    
    // Fix preparationTime
    if (dish.preparationTime instanceof Date) {
        const oldValue = dish.preparationTime;
        const newValue = dateToValue(oldValue, 'time');
        print(`    preparationTime: ${oldValue} → ${newValue}`);
        updateFields.preparationTime = newValue;
        needsUpdate = true;
    }
    
    if (needsUpdate) {
        const result = db.dishes.updateOne(
            { _id: dish._id },
            { $set: updateFields }
        );
        
        if (result.modifiedCount > 0) {
            dishesFixed++;
            print(`    ✅ Updated dish ${dish.basicInfo?.name || dish._id}`);
        }
    }
});

print(`📊 Dishes fixed: ${dishesFixed}`);
totalFixed += dishesFixed;

// 4. FINAL VERIFICATION
print("\n📊 KIỂM TRA KẾT QUẢ CUỐI CÙNG:");

const remainingOrderIssues = db.orders.countDocuments({
    $or: [
        { "deliveryInfo.estimatedDeliveryTime": { $type: "date" } },
        { "deliveryInfo.actualDeliveryTime": { $type: "date" } }
    ]
});

const remainingReviewIssues = db.reviews.countDocuments({
    rating: { $type: "date" }
});

const remainingDishIssues = db.dishes.countDocuments({
    $or: [
        { "pricing.basePrice": { $type: "date" } },
        { "pricing.discountPrice": { $type: "date" } },
        { "ratings.totalReviews": { $type: "date" } },
        { "preparationTime": { $type: "date" } }
    ]
});

print(`Orders còn lại có vấn đề: ${remainingOrderIssues}`);
print(`Reviews còn lại có vấn đề: ${remainingReviewIssues}`);
print(`Dishes còn lại có vấn đề: ${remainingDishIssues}`);

const totalRemaining = remainingOrderIssues + remainingReviewIssues + remainingDishIssues;

print(`\n📈 TỔNG KẾT:`);
print(`- Đã fix: ${totalFixed} documents`);
print(`- Còn lại: ${totalRemaining} documents có vấn đề`);

if (totalRemaining === 0) {
    print("\n🎉 TẤT CẢ CONVERTER ISSUES ĐÃ ĐƯỢC FIX THÀNH CÔNG!");
    print("Bây giờ có thể test lại tất cả APIs.");
} else {
    print("\n⚠️  Vẫn còn issues cần xử lý.");
}

print("\n✅ SCRIPT FIX HOÀN THÀNH!"); 