// Script để kiểm tra ShoppingCart collection
use('food_delivery_app');

print("=== Kiểm tra ShoppingCart collection ===");

const cartCount = db.shopping_carts.countDocuments();
print(`Tổng số shopping carts: ${cartCount}`);

if (cartCount > 0) {
    const sampleCart = db.shopping_carts.findOne({});
    print(`\nKiểm tra shopping cart ID: ${sampleCart._id}`);
    
    // Kiểm tra các field chính
    if (sampleCart.quantity !== undefined) {
        print(`quantity: ${sampleCart.quantity} (type: ${typeof sampleCart.quantity})`);
        if (sampleCart.quantity instanceof Date) {
            print("  >>> PROBLEM: quantity is Date instead of int!");
        }
    }
    
    if (sampleCart.createdAt !== undefined) {
        print(`createdAt: ${sampleCart.createdAt} (type: ${typeof sampleCart.createdAt})`);
    }
    
    if (sampleCart.updatedAt !== undefined) {
        print(`updatedAt: ${sampleCart.updatedAt} (type: ${typeof sampleCart.updatedAt})`);
    }
    
    // Kiểm tra nested objects nếu có
    if (sampleCart.items && Array.isArray(sampleCart.items)) {
        print(`\nKiểm tra items array (${sampleCart.items.length} items):`);
        for (let i = 0; i < Math.min(2, sampleCart.items.length); i++) {
            const item = sampleCart.items[i];
            if (item.quantity !== undefined) {
                print(`  items[${i}].quantity: ${item.quantity} (type: ${typeof item.quantity})`);
                if (item.quantity instanceof Date) {
                    print("    >>> PROBLEM: item quantity is Date instead of int!");
                }
            }
        }
    }
    
    print("\n=== Toàn bộ structure của sample cart ===");
    print(JSON.stringify(sampleCart, null, 2));
}

// Tìm các shopping carts có quantity bị lỗi
print("\n=== Tìm shopping carts có vấn đề ===");

const problemCarts1 = db.shopping_carts.find({
    "quantity": { $type: "date" }
}).toArray();

print(`Shopping carts có quantity là Date: ${problemCarts1.length}`);

const problemCarts2 = db.shopping_carts.find({
    "items.quantity": { $type: "date" }
}).toArray();

print(`Shopping carts có items.quantity là Date: ${problemCarts2.length}`);

if (problemCarts1.length > 0) {
    print("\nSample cart có quantity bị lỗi:");
    const sample = problemCarts1[0];
    print(`ID: ${sample._id}, quantity: ${sample.quantity}`);
}

if (problemCarts2.length > 0) {
    print("\nSample cart có items.quantity bị lỗi:");
    const sample = problemCarts2[0];
    print(`ID: ${sample._id}`);
    if (sample.items && sample.items.length > 0) {
        print(`items[0].quantity: ${sample.items[0].quantity}`);
    }
} 