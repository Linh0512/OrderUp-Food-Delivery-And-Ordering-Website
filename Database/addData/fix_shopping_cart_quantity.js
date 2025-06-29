// Script để sửa quantity trong shopping cart items từ Date về int
use('food_delivery_app');

print("=== Bắt đầu sửa quantity trong shopping cart items ===");

// Hàm chuyển đổi Date về int
function convertDateToInt(dateValue) {
    if (dateValue instanceof Date) {
        // Lấy số giây từ epoch time
        // Ví dụ: 1970-01-01T00:00:02.000Z = 2 giây = 2
        const seconds = Math.floor(dateValue.getTime() / 1000);
        return seconds;
    }
    return dateValue; // Nếu đã là số thì giữ nguyên
}

const shoppingCarts = db.shopping_carts.find({}).toArray();
print(`Đang xử lý ${shoppingCarts.length} shopping carts`);

let updatedCount = 0;

for (let cart of shoppingCarts) {
    let needUpdate = false;
    let updates = {};
    
    // Kiểm tra và sửa items array
    if (cart.items && Array.isArray(cart.items)) {
        let newItems = cart.items.map(item => {
            let newItem = {...item};
            
            // Sửa quantity trong item
            if (item.quantity instanceof Date) {
                newItem.quantity = convertDateToInt(item.quantity);
                needUpdate = true;
                print(`  Sửa items.quantity từ ${item.quantity} thành ${newItem.quantity}`);
            }
            
            return newItem;
        });
        
        if (needUpdate) {
            updates.items = newItems;
        }
    }
    
    // Cập nhật document nếu có thay đổi
    if (needUpdate) {
        const result = db.shopping_carts.updateOne(
            { "_id": cart._id },
            { "$set": updates }
        );
        
        if (result.modifiedCount > 0) {
            updatedCount++;
            print(`Đã cập nhật shopping cart: ${cart._id}`);
        }
    }
}

print(`\n=== Hoàn thành ===`);
print(`Đã cập nhật ${updatedCount} shopping carts`);

// Kiểm tra lại sau khi sửa
print("\n=== Kiểm tra lại ===");
const problemCarts = db.shopping_carts.find({
    "items.quantity": { "$type": "date" }
}).count();

print(`Shopping carts còn lại có items.quantity là Date: ${problemCarts}`);

if (problemCarts === 0) {
    print("✅ Tất cả quantity trong items đã được sửa thành công!");
} else {
    print("❌ Vẫn còn shopping carts có vấn đề");
} 