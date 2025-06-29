// Script để kiểm tra nhanh quantity fields sau restart
// Chạy ngay sau khi restart application

db = db.getSiblingDB('food_delivery_app');

print("=== KIỂM TRA NHANH QUANTITY FIELDS ===");
print("Timestamp: " + new Date());

// Kiểm tra Orders collection
print("\n--- ORDERS ---");
const orders = db.orders.find({}).limit(5);
orders.forEach(function(order) {
    if (order.orderDetails && order.orderDetails.items) {
        order.orderDetails.items.forEach(function(item, index) {
            if (item.quantity instanceof Date) {
                print(`❌ Order ${order._id} - Item[${index}] quantity is Date: ${item.quantity}`);
            } else {
                print(`✅ Order ${order._id} - Item[${index}] quantity OK: ${item.quantity} (${typeof item.quantity})`);
            }
        });
    }
});

// Kiểm tra Shopping Carts collection
print("\n--- SHOPPING CARTS ---");
const carts = db.shopping_carts.find({}).limit(3);
carts.forEach(function(cart) {
    if (cart.items) {
        cart.items.forEach(function(item, index) {
            if (item.quantity instanceof Date) {
                print(`❌ Cart ${cart._id} - Item[${index}] quantity is Date: ${item.quantity}`);
            } else {
                print(`✅ Cart ${cart._id} - Item[${index}] quantity OK: ${item.quantity} (${typeof item.quantity})`);
            }
        });
    }
});

// Kiểm tra Reviews collection
print("\n--- REVIEWS ---");
const reviews = db.reviews.find({}).limit(3);
reviews.forEach(function(review) {
    if (review.rating instanceof Date) {
        print(`❌ Review ${review._id} rating is Date: ${review.rating}`);
    } else {
        print(`✅ Review ${review._id} rating OK: ${review.rating} (${typeof review.rating})`);
    }
});

print("\n=== KIỂM TRA HOÀN THÀNH ==="); 