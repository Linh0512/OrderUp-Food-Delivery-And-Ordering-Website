// EMERGENCY: Fix tất cả quantity fields bị convert thành Date
// Chạy script này ngay lập tức để sửa toàn bộ vấn đề conversion

db = db.getSiblingDB('food_delivery_app');

print("=== EMERGENCY FIX: QUANTITY FIELDS CONVERSION ===");
print("Timestamp: " + new Date());

let totalFixed = 0;

// Helper function để convert Date back to int
function dateToInt(dateValue, fieldName = 'quantity') {
    if (dateValue instanceof Date) {
        const epochSeconds = Math.floor(dateValue.getTime() / 1000);
        
        // For quantity fields, use reasonable defaults
        switch(fieldName) {
            case 'quantity':
                // Quantity should be 1-20 for most cases
                return (epochSeconds >= 1 && epochSeconds <= 100) ? epochSeconds : 1;
            default:
                return (epochSeconds >= 1 && epochSeconds <= 100) ? epochSeconds : 1;
        }
    }
    
    if (typeof dateValue === 'string') {
        const num = parseInt(dateValue);
        return isNaN(num) ? 1 : num;
    }
    
    return dateValue; // already correct
}

// 1. Fix Orders collection - orderDetails.items.quantity
print("\n=== FIXING ORDERS ===");
let ordersFixed = 0;

db.orders.find({}).forEach(function(order) {
    let needUpdate = false;
    let updateDoc = {};
    
    if (order.orderDetails && order.orderDetails.items) {
        for (let i = 0; i < order.orderDetails.items.length; i++) {
            if (order.orderDetails.items[i].quantity instanceof Date) {
                needUpdate = true;
                const newQuantity = dateToInt(order.orderDetails.items[i].quantity);
                updateDoc[`orderDetails.items.${i}.quantity`] = newQuantity;
                print(`Order ${order._id} - Item[${i}] quantity: ${order.orderDetails.items[i].quantity} -> ${newQuantity}`);
            }
        }
    }
    
    if (needUpdate) {
        db.orders.updateOne(
            { _id: order._id },
            { $set: updateDoc }
        );
        ordersFixed++;
        totalFixed++;
    }
});

print(`Orders fixed: ${ordersFixed}`);

// 2. Fix Shopping Carts collection - items.quantity
print("\n=== FIXING SHOPPING CARTS ===");
let cartsFixed = 0;

db.shopping_carts.find({}).forEach(function(cart) {
    let needUpdate = false;
    let updateDoc = {};
    
    if (cart.items) {
        for (let i = 0; i < cart.items.length; i++) {
            if (cart.items[i].quantity instanceof Date) {
                needUpdate = true;
                const newQuantity = dateToInt(cart.items[i].quantity);
                updateDoc[`items.${i}.quantity`] = newQuantity;
                print(`Cart ${cart._id} - Item[${i}] quantity: ${cart.items[i].quantity} -> ${newQuantity}`);
            }
        }
    }
    
    if (needUpdate) {
        db.shopping_carts.updateOne(
            { _id: cart._id },
            { $set: updateDoc }
        );
        cartsFixed++;
        totalFixed++;
    }
});

print(`Shopping carts fixed: ${cartsFixed}`);

// 3. Fix Reviews collection - rating field
print("\n=== FIXING REVIEWS ===");
let reviewsFixed = 0;

db.reviews.find({}).forEach(function(review) {
    if (review.rating instanceof Date) {
        const newRating = dateToInt(review.rating, 'rating');
        // Rating should be 1-5
        const finalRating = Math.min(5, Math.max(1, newRating));
        
        db.reviews.updateOne(
            { _id: review._id },
            { $set: { rating: finalRating } }
        );
        
        print(`Review ${review._id} rating: ${review.rating} -> ${finalRating}`);
        reviewsFixed++;
        totalFixed++;
    }
});

print(`Reviews fixed: ${reviewsFixed}`);

// 4. Fix any other quantity-related fields
print("\n=== FIXING OTHER COLLECTIONS ===");

// Fix dishes stockQuantity
let dishesFixed = 0;
db.dishes.find({}).forEach(function(dish) {
    let needUpdate = false;
    let updateDoc = {};
    
    if (dish.stockInfo && dish.stockInfo.stockQuantity instanceof Date) {
        const newStock = dateToInt(dish.stockInfo.stockQuantity);
        updateDoc['stockInfo.stockQuantity'] = newStock;
        needUpdate = true;
        print(`Dish ${dish._id} stockQuantity: ${dish.stockInfo.stockQuantity} -> ${newStock}`);
    }
    
    if (needUpdate) {
        db.dishes.updateOne({ _id: dish._id }, { $set: updateDoc });
        dishesFixed++;
        totalFixed++;
    }
});

print(`Dishes fixed: ${dishesFixed}`);

print("\n=== EMERGENCY FIX COMPLETED ===");
print(`Total documents fixed: ${totalFixed}`);
print(`- Orders: ${ordersFixed}`);
print(`- Shopping Carts: ${cartsFixed}`);
print(`- Reviews: ${reviewsFixed}`);
print(`- Dishes: ${dishesFixed}`);

// Verification
print("\n=== VERIFICATION ===");
const remainingIssues = db.orders.countDocuments({ "orderDetails.items.quantity": { $type: "date" } }) +
                        db.shopping_carts.countDocuments({ "items.quantity": { $type: "date" } }) +
                        db.reviews.countDocuments({ "rating": { $type: "date" } });

if (remainingIssues === 0) {
    print("✅ SUCCESS: No more quantity Date issues found!");
} else {
    print(`⚠️ WARNING: ${remainingIssues} quantity Date issues still remain`);
}

print("=== END OF EMERGENCY FIX ==="); 