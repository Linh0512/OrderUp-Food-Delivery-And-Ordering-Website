// Script để fix delivery time fields từ int về Date
db = db.getSiblingDB('food_delivery_app');

print("=== FIX DELIVERY TIME FIELDS ===");
print("Timestamp: " + new Date());

let totalFixed = 0;

// Function để convert int timestamp thành Date
function intToDate(intValue) {
    if (typeof intValue === 'number') {
        // Nếu là epoch seconds (< 10^10), convert thành milliseconds
        if (intValue < 10000000000) {
            return new Date(intValue * 1000);
        }
        // Nếu đã là milliseconds
        return new Date(intValue);
    }
    return intValue; // Đã là Date hoặc undefined
}

// Fix delivery time fields trong orders
print("\n=== FIXING DELIVERY TIME FIELDS IN ORDERS ===");

db.orders.find({}).forEach(function(order) {
    let needUpdate = false;
    let updateDoc = {};
    
    if (order.deliveryInfo) {
        // Fix estimatedDeliveryTime
        if (typeof order.deliveryInfo.estimatedDeliveryTime === 'number') {
            const newDate = intToDate(order.deliveryInfo.estimatedDeliveryTime);
            updateDoc['deliveryInfo.estimatedDeliveryTime'] = newDate;
            needUpdate = true;
            print(`Order ${order._id} - estimatedDeliveryTime: ${order.deliveryInfo.estimatedDeliveryTime} -> ${newDate}`);
        }
        
        // Fix actualDeliveryTime
        if (typeof order.deliveryInfo.actualDeliveryTime === 'number') {
            const newDate = intToDate(order.deliveryInfo.actualDeliveryTime);
            updateDoc['deliveryInfo.actualDeliveryTime'] = newDate;
            needUpdate = true;
            print(`Order ${order._id} - actualDeliveryTime: ${order.deliveryInfo.actualDeliveryTime} -> ${newDate}`);
        }
    }
    
    if (needUpdate) {
        db.orders.updateOne(
            { _id: order._id },
            { $set: updateDoc }
        );
        totalFixed++;
    }
});

print(`\nTotal orders fixed: ${totalFixed}`);

// Verification
print("\n=== VERIFICATION ===");
const remainingEstimatedProblems = db.orders.countDocuments({
    "deliveryInfo.estimatedDeliveryTime": { $type: "int" }
});

const remainingActualProblems = db.orders.countDocuments({
    "deliveryInfo.actualDeliveryTime": { $type: "int" }
});

print(`Remaining estimatedDeliveryTime int issues: ${remainingEstimatedProblems}`);
print(`Remaining actualDeliveryTime int issues: ${remainingActualProblems}`);

if (remainingEstimatedProblems === 0 && remainingActualProblems === 0) {
    print("✅ SUCCESS: All delivery time fields are now Date type!");
} else {
    print(`⚠️ WARNING: ${remainingEstimatedProblems + remainingActualProblems} delivery time issues still remain`);
}

print("\n=== FIX COMPLETED ==="); 