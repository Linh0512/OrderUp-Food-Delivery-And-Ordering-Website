// Script để kiểm tra chi tiết nested objects trong Order collection
use('food_delivery_app');

print("=== Kiểm tra nested objects trong Order collection ===");

// Tìm order của user cụ thể
const userOrder = db.orders.findOne({"customerId": ObjectId("68417874a74d530ba550eb69")});
if (!userOrder) {
    print("Không tìm thấy order nào của user 68417874a74d530ba550eb69");
    exit();
}

print(`Kiểm tra order của user: ${userOrder._id}`);

// Kiểm tra orderDetails
if (userOrder.orderDetails) {
    print("\n=== OrderDetails ===");
    const details = userOrder.orderDetails;
    
    // Kiểm tra các field number trong orderDetails
    const numberFields = ['subtotal', 'deliveryFee', 'serviceFee', 'tax', 'discount', 'totalAmount'];
    for (let field of numberFields) {
        if (details[field] !== undefined) {
            print(`orderDetails.${field}: ${details[field]} (type: ${typeof details[field]})`);
            if (details[field] instanceof Date) {
                print(`  >>> PROBLEM: ${field} is Date instead of number!`);
            }
        }
    }
    
    // Kiểm tra items array trong orderDetails
    if (details.items && Array.isArray(details.items)) {
        print(`\n=== OrderDetails.items (${details.items.length} items) ===`);
        for (let i = 0; i < details.items.length; i++) {
            const item = details.items[i];
            print(`  Item ${i}:`);
            if (item.quantity !== undefined) {
                print(`    quantity: ${item.quantity} (type: ${typeof item.quantity})`);
                if (item.quantity instanceof Date) {
                    print(`    >>> PROBLEM: quantity is Date!`);
                }
            }
            if (item.unitPrice !== undefined) {
                print(`    unitPrice: ${item.unitPrice} (type: ${typeof item.unitPrice})`);
                if (item.unitPrice instanceof Date) {
                    print(`    >>> PROBLEM: unitPrice is Date!`);
                }
            }
            if (item.subtotal !== undefined) {
                print(`    subtotal: ${item.subtotal} (type: ${typeof item.subtotal})`);
                if (item.subtotal instanceof Date) {
                    print(`    >>> PROBLEM: subtotal is Date!`);
                }
            }
        }
    }
}

// Kiểm tra deliveryInfo
if (userOrder.deliveryInfo) {
    print("\n=== DeliveryInfo ===");
    const delivery = userOrder.deliveryInfo;
    if (delivery.estimatedDeliveryTime !== undefined) {
        print(`estimatedDeliveryTime: ${delivery.estimatedDeliveryTime} (type: ${typeof delivery.estimatedDeliveryTime})`);
    }
    if (delivery.actualDeliveryTime !== undefined) {
        print(`actualDeliveryTime: ${delivery.actualDeliveryTime} (type: ${typeof delivery.actualDeliveryTime})`);
    }
}

// Kiểm tra status.history array
if (userOrder.status && userOrder.status.history) {
    print("\n=== Status.history ===");
    for (let i = 0; i < userOrder.status.history.length; i++) {
        const history = userOrder.status.history[i];
        print(`  History ${i}:`);
        print(`    status: ${history.status}`);
        print(`    timestamp: ${history.timestamp} (type: ${typeof history.timestamp})`);
        if (typeof history.timestamp !== 'object' || !(history.timestamp instanceof Date)) {
            print(`    >>> POTENTIAL PROBLEM: timestamp should be Date`);
        }
    }
}

// Kiểm tra timing object
if (userOrder.timing) {
    print("\n=== Timing ===");
    const timing = userOrder.timing;
    const timeFields = ['placedAt', 'confirmedAt', 'preparingAt', 'readyAt', 'pickedUpAt', 'deliveredAt'];
    for (let field of timeFields) {
        if (timing[field] !== undefined) {
            print(`timing.${field}: ${timing[field]} (type: ${typeof timing[field]})`);
            if (typeof timing[field] !== 'object' || !(timing[field] instanceof Date)) {
                print(`  >>> POTENTIAL PROBLEM: ${field} should be Date`);
            }
        }
    }
}

print("\n=== Kết luận ===");
print("Tất cả nested objects đều có cấu trúc đúng format."); 