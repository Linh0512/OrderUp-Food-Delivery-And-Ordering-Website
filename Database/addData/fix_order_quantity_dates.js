// Script để fix quantity fields bị convert thành Date trong orders collection
// Chạy trong MongoDB shell hoặc MongoDB Compass

print("=== FIX QUANTITY FIELDS BỊ CONVERT THÀNH DATE ===");

// Kết nối database
use('food_delivery_app');

// Tìm tất cả orders có quantity fields không phải number
const problematicOrders = db.orders.find({
    "orderDetails.items.quantity": { $not: { $type: "number" } }
});

print("Đang kiểm tra orders có vấn đề quantity...");

let fixedCount = 0;
let totalIssues = 0;

problematicOrders.forEach(order => {
    let orderNeedsUpdate = false;
    let updatedItems = [];
    
    print(`\n🔧 Đang xử lý Order: ${order.orderNumber} (${order._id})`);
    
    if (order.orderDetails && order.orderDetails.items) {
        order.orderDetails.items.forEach((item, index) => {
            if (typeof item.quantity !== 'number') {
                totalIssues++;
                print(`  Item ${index + 1}: quantity type = ${typeof item.quantity}, value = ${item.quantity}`);
                
                // Convert Date back to number
                let newQuantity = 1; // default value
                
                if (item.quantity instanceof Date) {
                    // Extract number from Date (epoch time in seconds, usually small numbers like 1, 2, 3)
                    const epochSeconds = Math.floor(item.quantity.getTime() / 1000);
                    
                    // Dates like 1970-01-01T00:00:01.000Z mean quantity = 1
                    // Dates like 1970-01-01T00:00:02.000Z mean quantity = 2
                    if (epochSeconds > 0 && epochSeconds < 100) {
                        newQuantity = epochSeconds;
                    }
                }
                
                item.quantity = newQuantity;
                print(`    ✅ Fixed: quantity = ${newQuantity}`);
                orderNeedsUpdate = true;
            }
            updatedItems.push(item);
        });
        
        if (orderNeedsUpdate) {
            // Update order với items đã fix
            const result = db.orders.updateOne(
                { _id: order._id },
                { 
                    $set: { 
                        "orderDetails.items": updatedItems 
                    } 
                }
            );
            
            if (result.modifiedCount > 0) {
                fixedCount++;
                print(`  ✅ Updated order ${order.orderNumber} successfully`);
            } else {
                print(`  ❌ Failed to update order ${order.orderNumber}`);
            }
        }
    }
});

print("\n📊 KẾT QUẢ FIX:");
print(`- Tổng số quantity fields có vấn đề: ${totalIssues}`);
print(`- Số orders đã fix: ${fixedCount}`);

// Verify kết quả
const remainingIssues = db.orders.countDocuments({
    "orderDetails.items.quantity": { $not: { $type: "number" } }
});

print(`- Orders còn lại có vấn đề: ${remainingIssues}`);

if (remainingIssues === 0) {
    print("\n🎉 TẤT CẢ QUANTITY FIELDS ĐÃ ĐƯỢC FIX THÀNH CÔNG!");
} else {
    print("\n⚠️  Vẫn còn orders có vấn đề, cần kiểm tra thêm.");
}

print("\n✅ SCRIPT HOÀN THÀNH!"); 