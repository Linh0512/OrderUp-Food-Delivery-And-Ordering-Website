// Script để sửa lastLogin từ number timestamp về Date object trong User collection
use('food_delivery_app');

print("=== Bắt đầu sửa lastLogin từ number timestamp về Date ===");

// Hàm chuyển đổi timestamp về Date
function convertTimestampToDate(timestamp) {
    if (typeof timestamp === 'number') {
        // Chuyển Unix timestamp thành Date object
        // Nhân 1000 vì JavaScript Date expects milliseconds
        return new Date(timestamp * 1000);
    }
    return timestamp; // Nếu đã là Date thì giữ nguyên
}

const users = db.users.find({}).toArray();
print(`Đang xử lý ${users.length} users`);

let updatedCount = 0;

for (let user of users) {
    let needUpdate = false;
    let updates = {};
    
    // Sửa lastLogin nếu bị lỗi
    if (user.lastLogin && typeof user.lastLogin === 'number') {
        const newLastLogin = convertTimestampToDate(user.lastLogin);
        updates.lastLogin = newLastLogin;
        needUpdate = true;
        print(`  Sửa lastLogin từ ${user.lastLogin} thành ${newLastLogin} cho user ${user.email}`);
    }
    
    // Cập nhật document nếu có thay đổi
    if (needUpdate) {
        const result = db.users.updateOne(
            { "_id": user._id },
            { "$set": updates }
        );
        
        if (result.modifiedCount > 0) {
            updatedCount++;
            print(`Đã cập nhật user: ${user._id} (${user.email})`);
        }
    }
}

print(`\n=== Hoàn thành ===`);
print(`Đã cập nhật ${updatedCount} users`);

// Kiểm tra lại sau khi sửa
print("\n=== Kiểm tra lại ===");
const problemUsers = db.users.find({
    "lastLogin": { "$type": "number" }
}).count();

print(`Users còn lại có lastLogin là number: ${problemUsers}`);

if (problemUsers === 0) {
    print("✅ Tất cả lastLogin đã được sửa thành công!");
} else {
    print("❌ Vẫn còn users có vấn đề");
}

// Hiển thị kết quả sau khi fix
print("\n=== Kết quả sau khi fix ===");
const fixedUsers = [
    db.users.findOne({"email": "22520779@gm.uit.edu.vn"}),
    db.users.findOne({"email": "host1@pizzahouse.com"})
];

for (let user of fixedUsers) {
    if (user) {
        print(`User ${user.email}:`);
        print(`  lastLogin: ${user.lastLogin} (type: ${typeof user.lastLogin})`);
        print(`  loyaltyPoints: ${user.loyaltyPoints} (type: ${typeof user.loyaltyPoints})`);
    }
} 