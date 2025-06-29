// Script để kiểm tra kiểu dữ liệu của delivery time fields
db = db.getSiblingDB('food_delivery_app');

print("=== KIỂM TRA DELIVERY TIME FIELDS TRONG ORDERS ===");

const orders = db.orders.find({}).limit(10);

orders.forEach(function(order) {
    if (order.deliveryInfo) {
        const deliveryInfo = order.deliveryInfo;
        
        print(`\nOrder: ${order._id}`);
        
        if (deliveryInfo.estimatedDeliveryTime !== undefined) {
            print(`  estimatedDeliveryTime: ${deliveryInfo.estimatedDeliveryTime} (type: ${typeof deliveryInfo.estimatedDeliveryTime})`);
            if (typeof deliveryInfo.estimatedDeliveryTime === 'number') {
                print(`    ❌ PROBLEM: estimatedDeliveryTime is number, should be Date`);
            } else if (deliveryInfo.estimatedDeliveryTime instanceof Date) {
                print(`    ✅ OK: estimatedDeliveryTime is Date`);
            }
        }
        
        if (deliveryInfo.actualDeliveryTime !== undefined) {
            print(`  actualDeliveryTime: ${deliveryInfo.actualDeliveryTime} (type: ${typeof deliveryInfo.actualDeliveryTime})`);
            if (typeof deliveryInfo.actualDeliveryTime === 'number') {
                print(`    ❌ PROBLEM: actualDeliveryTime is number, should be Date`);
            } else if (deliveryInfo.actualDeliveryTime instanceof Date) {
                print(`    ✅ OK: actualDeliveryTime is Date`);
            }
        }
    }
});

// Đếm số lượng có vấn đề
print("\n=== THỐNG KÊ ===");

const estimatedTimeProblems = db.orders.countDocuments({
    "deliveryInfo.estimatedDeliveryTime": { $type: "int" }
});

const actualTimeProblems = db.orders.countDocuments({
    "deliveryInfo.actualDeliveryTime": { $type: "int" }
});

print(`Orders có estimatedDeliveryTime type int: ${estimatedTimeProblems}`);
print(`Orders có actualDeliveryTime type int: ${actualTimeProblems}`);

if (estimatedTimeProblems > 0 || actualTimeProblems > 0) {
    print("\n❌ CẦN FIX: Có delivery time fields đang là int thay vì Date");
} else {
    print("\n✅ OK: Tất cả delivery time fields đều đúng type");
} 