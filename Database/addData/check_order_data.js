// Script để kiểm tra Order collection
use('food_delivery_app');

print("=== Kiểm tra Order collection ===");

const orderCount = db.orders.countDocuments();
print(`Tổng số orders: ${orderCount}`);

if (orderCount > 0) {
    const sampleOrder = db.orders.findOne({});
    print(`\nKiểm tra order ID: ${sampleOrder._id}`);
    
    // Kiểm tra các field có thể bị lỗi kiểu dữ liệu
    const fieldsToCheck = [
        'quantity',
        'totalAmount',
        'deliveryFee',
        'serviceFee',
        'tax',
        'discount',
        'finalAmount',
        'loyaltyPointsEarned',
        'loyaltyPointsUsed'
    ];
    
    for (let field of fieldsToCheck) {
        if (sampleOrder[field] !== undefined) {
            print(`${field}: ${sampleOrder[field]} (type: ${typeof sampleOrder[field]})`);
            if (sampleOrder[field] instanceof Date) {
                print(`  >>> PROBLEM: ${field} is Date instead of number!`);
                const seconds = Math.floor(sampleOrder[field].getTime() / 1000);
                print(`  >>> Should be: ${seconds}`);
            }
        }
    }
    
    // Kiểm tra items array
    if (sampleOrder.items && Array.isArray(sampleOrder.items)) {
        print(`\n=== Kiểm tra items array (${sampleOrder.items.length} items) ===`);
        for (let i = 0; i < sampleOrder.items.length; i++) {
            const item = sampleOrder.items[i];
            if (item.quantity !== undefined) {
                print(`items[${i}].quantity: ${item.quantity} (type: ${typeof item.quantity})`);
                if (item.quantity instanceof Date) {
                    print(`  >>> PROBLEM: items[${i}].quantity is Date!`);
                }
            }
            if (item.unitPrice !== undefined) {
                print(`items[${i}].unitPrice: ${item.unitPrice} (type: ${typeof item.unitPrice})`);
                if (item.unitPrice instanceof Date) {
                    print(`  >>> PROBLEM: items[${i}].unitPrice is Date!`);
                }
            }
        }
    }
    
    // Kiểm tra deliveryInfo
    if (sampleOrder.deliveryInfo) {
        print(`\n=== Kiểm tra deliveryInfo ===`);
        const deliveryInfo = sampleOrder.deliveryInfo;
        if (deliveryInfo.estimatedDeliveryTime !== undefined) {
            print(`estimatedDeliveryTime: ${deliveryInfo.estimatedDeliveryTime} (type: ${typeof deliveryInfo.estimatedDeliveryTime})`);
            if (typeof deliveryInfo.estimatedDeliveryTime === 'number') {
                print(`  >>> PROBLEM: estimatedDeliveryTime is number instead of Date!`);
            }
        }
    }
    
    print("\n=== Toàn bộ structure của sample order ===");
    print(JSON.stringify(sampleOrder, null, 2));
}

// Tìm orders có vấn đề
print("\n=== Tìm orders có vấn đề ===");

// Kiểm tra quantity field
const problemOrders1 = db.orders.find({
    "quantity": { "$type": "date" }
}).count();
print(`Orders có quantity là Date: ${problemOrders1}`);

// Kiểm tra items.quantity field
const problemOrders2 = db.orders.find({
    "items.quantity": { "$type": "date" }
}).count();
print(`Orders có items.quantity là Date: ${problemOrders2}`);

// Kiểm tra các field number khác
const numberFields = ['totalAmount', 'deliveryFee', 'serviceFee', 'tax', 'discount'];
for (let field of numberFields) {
    const count = db.orders.find({
        [field]: { "$type": "date" }
    }).count();
    if (count > 0) {
        print(`Orders có ${field} là Date: ${count}`);
    }
} 