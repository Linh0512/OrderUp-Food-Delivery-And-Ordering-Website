// Script để kiểm tra conversion issues trong orders collection
// Chạy trong MongoDB shell hoặc MongoDB Compass

print("=== KIỂM TRA CONVERSION ISSUES TRONG ORDERS COLLECTION ===");

// Kết nối database
use('food_delivery_app');

// Lấy sample order để kiểm tra
const sampleOrder = db.orders.findOne({});
if (!sampleOrder) {
    print("❌ Không tìm thấy order nào trong database");
    exit();
}

print("\n📋 KIỂM TRA CẤU TRÚC ORDER:");
print("Order ID:", sampleOrder._id);
print("Order Number:", sampleOrder.orderNumber);

// Kiểm tra các Date fields chính
print("\n🕐 KIỂM TRA CÁC DATE FIELDS:");

// 1. createdAt
print("1. createdAt:");
print("   Type:", typeof sampleOrder.createdAt);
print("   Value:", sampleOrder.createdAt);
print("   Is Date:", sampleOrder.createdAt instanceof Date);

// 2. updatedAt  
print("2. updatedAt:");
print("   Type:", typeof sampleOrder.updatedAt);
print("   Value:", sampleOrder.updatedAt);
print("   Is Date:", sampleOrder.updatedAt instanceof Date);

// Kiểm tra DeliveryInfo dates
if (sampleOrder.deliveryInfo) {
    print("\n📦 DELIVERY INFO DATES:");
    
    if (sampleOrder.deliveryInfo.estimatedDeliveryTime) {
        print("3. estimatedDeliveryTime:");
        print("   Type:", typeof sampleOrder.deliveryInfo.estimatedDeliveryTime);
        print("   Value:", sampleOrder.deliveryInfo.estimatedDeliveryTime);
        print("   Is Date:", sampleOrder.deliveryInfo.estimatedDeliveryTime instanceof Date);
    }
    
    if (sampleOrder.deliveryInfo.actualDeliveryTime) {
        print("4. actualDeliveryTime:");
        print("   Type:", typeof sampleOrder.deliveryInfo.actualDeliveryTime);
        print("   Value:", sampleOrder.deliveryInfo.actualDeliveryTime);
        print("   Is Date:", sampleOrder.deliveryInfo.actualDeliveryTime instanceof Date);
    }
}

// Kiểm tra Payment dates
if (sampleOrder.payment && sampleOrder.payment.paidAt) {
    print("\n💳 PAYMENT DATES:");
    print("5. payment.paidAt:");
    print("   Type:", typeof sampleOrder.payment.paidAt);
    print("   Value:", sampleOrder.payment.paidAt);
    print("   Is Date:", sampleOrder.payment.paidAt instanceof Date);
}

// Kiểm tra Timing dates
if (sampleOrder.timing) {
    print("\n⏰ TIMING DATES:");
    const timingFields = ['placedAt', 'confirmedAt', 'preparingAt', 'readyAt', 'pickedUpAt', 'deliveredAt'];
    
    timingFields.forEach((field, index) => {
        if (sampleOrder.timing[field]) {
            print(`${index + 6}. timing.${field}:`);
            print("   Type:", typeof sampleOrder.timing[field]);
            print("   Value:", sampleOrder.timing[field]);
            print("   Is Date:", sampleOrder.timing[field] instanceof Date);
        }
    });
}

// Kiểm tra OrderStatus history dates
if (sampleOrder.status && sampleOrder.status.history) {
    print("\n📊 STATUS HISTORY DATES:");
    sampleOrder.status.history.forEach((historyItem, index) => {
        if (historyItem.timestamp) {
            print(`History ${index + 1} timestamp:`);
            print("   Type:", typeof historyItem.timestamp);
            print("   Value:", historyItem.timestamp);
            print("   Is Date:", historyItem.timestamp instanceof Date);
        }
    });
}

// Kiểm tra quantity fields (có thể bị convert thành Date)
print("\n🔢 KIỂM TRA QUANTITY FIELDS:");
if (sampleOrder.orderDetails && sampleOrder.orderDetails.items) {
    sampleOrder.orderDetails.items.forEach((item, index) => {
        print(`Item ${index + 1} quantity:`);
        print("   Type:", typeof item.quantity);
        print("   Value:", item.quantity);
        print("   Is Number:", typeof item.quantity === 'number');
        print("   Is Date:", item.quantity instanceof Date);
    });
}

// Đếm orders có vấn đề converter
print("\n🔍 THỐNG KÊ VẤN ĐỀ CONVERTER:");

// Đếm orders có createdAt không phải Date
const createdAtIssues = db.orders.countDocuments({
    createdAt: { $not: { $type: "date" } }
});
print("Orders có createdAt không phải Date:", createdAtIssues);

// Đếm orders có quantity không phải number trong items
const quantityIssues = db.orders.countDocuments({
    "orderDetails.items.quantity": { $not: { $type: "number" } }
});
print("Orders có quantity không phải number:", quantityIssues);

// Đếm orders có timing fields không phải Date
const timingIssues = db.orders.countDocuments({
    $or: [
        { "timing.placedAt": { $exists: true, $not: { $type: "date" } } },
        { "timing.confirmedAt": { $exists: true, $not: { $type: "date" } } },
        { "timing.preparingAt": { $exists: true, $not: { $type: "date" } } },
        { "timing.readyAt": { $exists: true, $not: { $type: "date" } } },
        { "timing.pickedUpAt": { $exists: true, $not: { $type: "date" } } },
        { "timing.deliveredAt": { $exists: true, $not: { $type: "date" } } }
    ]
});
print("Orders có timing fields không phải Date:", timingIssues);

// Tìm orders có vấn đề cụ thể
print("\n⚠️  ORDERS CÓ VẤN ĐỀ CỤ THỂ:");
const problematicOrders = db.orders.find({
    $or: [
        { createdAt: { $not: { $type: "date" } } },
        { "orderDetails.items.quantity": { $not: { $type: "number" } } },
        { "timing.placedAt": { $exists: true, $not: { $type: "date" } } }
    ]
}).limit(3);

problematicOrders.forEach((order, index) => {
    print(`\nProblematic Order ${index + 1}:`);
    print("  ID:", order._id);
    print("  Order Number:", order.orderNumber);
    print("  createdAt type:", typeof order.createdAt);
    if (order.orderDetails && order.orderDetails.items) {
        order.orderDetails.items.forEach((item, itemIndex) => {
            if (typeof item.quantity !== 'number') {
                print(`  Item ${itemIndex + 1} quantity type:`, typeof item.quantity);
                print(`  Item ${itemIndex + 1} quantity value:`, item.quantity);
            }
        });
    }
});

print("\n✅ KIỂM TRA HOÀN THÀNH!");
print("Nếu có issues, cần chạy scripts fix để sửa data types trước khi test API."); 