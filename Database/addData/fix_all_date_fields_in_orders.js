// Script comprehensive để fix tất cả Date fields trong orders collection
db = db.getSiblingDB('food_delivery_app');

print("=== COMPREHENSIVE FIX: ALL DATE FIELDS IN ORDERS ===");
print("Timestamp: " + new Date());

let totalFixed = 0;

// Function để convert int/number thành Date
function numberToDate(value) {
    if (typeof value === 'number') {
        // Nếu là epoch seconds (< 10^10), convert thành milliseconds
        if (value < 10000000000) {
            return new Date(value * 1000);
        }
        // Nếu đã là milliseconds
        return new Date(value);
    }
    return value; // Đã là Date hoặc undefined/null
}

print("\n=== FIXING ALL DATE FIELDS IN ORDERS ===");

db.orders.find({}).forEach(function(order) {
    let needUpdate = false;
    let updateDoc = {};
    
    // 1. Fix top-level Date fields
    if (typeof order.createdAt === 'number') {
        updateDoc['createdAt'] = numberToDate(order.createdAt);
        needUpdate = true;
        print(`Order ${order._id} - createdAt: ${order.createdAt} -> Date`);
    }
    
    if (typeof order.updatedAt === 'number') {
        updateDoc['updatedAt'] = numberToDate(order.updatedAt);
        needUpdate = true;
        print(`Order ${order._id} - updatedAt: ${order.updatedAt} -> Date`);
    }
    
    // 2. Fix DeliveryInfo Date fields
    if (order.deliveryInfo) {
        if (typeof order.deliveryInfo.estimatedDeliveryTime === 'number') {
            updateDoc['deliveryInfo.estimatedDeliveryTime'] = numberToDate(order.deliveryInfo.estimatedDeliveryTime);
            needUpdate = true;
            print(`Order ${order._id} - deliveryInfo.estimatedDeliveryTime: ${order.deliveryInfo.estimatedDeliveryTime} -> Date`);
        }
        
        if (typeof order.deliveryInfo.actualDeliveryTime === 'number') {
            updateDoc['deliveryInfo.actualDeliveryTime'] = numberToDate(order.deliveryInfo.actualDeliveryTime);
            needUpdate = true;
            print(`Order ${order._id} - deliveryInfo.actualDeliveryTime: ${order.deliveryInfo.actualDeliveryTime} -> Date`);
        }
    }
    
    // 3. Fix Payment Date fields
    if (order.payment && typeof order.payment.paidAt === 'number') {
        updateDoc['payment.paidAt'] = numberToDate(order.payment.paidAt);
        needUpdate = true;
        print(`Order ${order._id} - payment.paidAt: ${order.payment.paidAt} -> Date`);
    }
    
    // 4. Fix OrderStatus.history Date fields
    if (order.status && order.status.history) {
        for (let i = 0; i < order.status.history.length; i++) {
            if (typeof order.status.history[i].timestamp === 'number') {
                updateDoc[`status.history.${i}.timestamp`] = numberToDate(order.status.history[i].timestamp);
                needUpdate = true;
                print(`Order ${order._id} - status.history[${i}].timestamp: ${order.status.history[i].timestamp} -> Date`);
            }
        }
    }
    
    // 5. Fix Timing Date fields
    if (order.timing) {
        const timingFields = ['placedAt', 'confirmedAt', 'preparingAt', 'readyAt', 'pickedUpAt', 'deliveredAt'];
        timingFields.forEach(function(field) {
            if (typeof order.timing[field] === 'number') {
                updateDoc[`timing.${field}`] = numberToDate(order.timing[field]);
                needUpdate = true;
                print(`Order ${order._id} - timing.${field}: ${order.timing[field]} -> Date`);
            }
        });
    }
    
    // Apply updates if needed
    if (needUpdate) {
        db.orders.updateOne(
            { _id: order._id },
            { $set: updateDoc }
        );
        totalFixed++;
    }
});

print(`\nTotal orders fixed: ${totalFixed}`);

// Verification - check for remaining number types in Date fields
print("\n=== VERIFICATION ===");

const dateFieldsToCheck = [
    'createdAt',
    'updatedAt',
    'deliveryInfo.estimatedDeliveryTime',
    'deliveryInfo.actualDeliveryTime',
    'payment.paidAt',
    'status.history.timestamp',
    'timing.placedAt',
    'timing.confirmedAt',
    'timing.preparingAt',
    'timing.readyAt',
    'timing.pickedUpAt',
    'timing.deliveredAt'
];

let totalRemainingIssues = 0;

dateFieldsToCheck.forEach(function(field) {
    const query = {};
    query[field] = { $type: "number" };
    
    const count = db.orders.countDocuments(query);
    if (count > 0) {
        print(`${field}: ${count} documents still have number type`);
        totalRemainingIssues += count;
    }
});

if (totalRemainingIssues === 0) {
    print("✅ SUCCESS: All Date fields are now properly typed!");
} else {
    print(`⚠️ WARNING: ${totalRemainingIssues} Date field issues still remain`);
}

print("\n=== COMPREHENSIVE FIX COMPLETED ==="); 