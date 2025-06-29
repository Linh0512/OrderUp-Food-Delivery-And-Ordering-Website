// Script để sửa loyaltyPoints từ Date về Integer trong User collection
use('food_delivery_app');

print("=== Bắt đầu sửa loyaltyPoints từ Date về Integer ===");

// Hàm chuyển đổi Date về int
function convertDateToInt(dateValue) {
    if (dateValue instanceof Date) {
        // Lấy số giây từ epoch time
        // Ví dụ: 1970-01-01T00:10:40.000Z = 640 giây = 640
        const seconds = Math.floor(dateValue.getTime() / 1000);
        return seconds;
    }
    return dateValue; // Nếu đã là số thì giữ nguyên
}

const users = db.users.find({}).toArray();
print(`Đang xử lý ${users.length} users`);

let updatedCount = 0;

for (let user of users) {
    let needUpdate = false;
    let updates = {};
    
    // Sửa loyaltyPoints nếu bị lỗi
    if (user.loyaltyPoints instanceof Date) {
        const newLoyaltyPoints = convertDateToInt(user.loyaltyPoints);
        updates.loyaltyPoints = newLoyaltyPoints;
        needUpdate = true;
        print(`  Sửa loyaltyPoints từ ${user.loyaltyPoints} thành ${newLoyaltyPoints} cho user ${user.email}`);
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
    "loyaltyPoints": { "$type": "date" }
}).count();

print(`Users còn lại có loyaltyPoints là Date: ${problemUsers}`);

if (problemUsers === 0) {
    print("✅ Tất cả loyaltyPoints đã được sửa thành công!");
} else {
    print("❌ Vẫn còn users có vấn đề");
}

// Hiển thị kết quả sau khi fix
print("\n=== Kết quả sau khi fix ===");
const fixedUser = db.users.findOne({"_id": "68417874a74d530ba550eb69"});
if (fixedUser) {
    print(`User ${fixedUser.email}:`);
    print(`loyaltyPoints: ${fixedUser.loyaltyPoints} (type: ${typeof fixedUser.loyaltyPoints})`);
} 