// Script để kiểm tra lastLogin field trong User collection
use('food_delivery_app');

print("=== Kiểm tra lastLogin field trong User collection ===");

const users = db.users.find({}).toArray();
print(`Đang kiểm tra ${users.length} users`);

let problemCount = 0;

for (let user of users) {
    if (user.lastLogin !== undefined && user.lastLogin !== null) {
        if (typeof user.lastLogin === 'number') {
            problemCount++;
            print(`PROBLEM - User ${user.email}:`);
            print(`  lastLogin: ${user.lastLogin} (type: ${typeof user.lastLogin})`);
            print(`  Should be Date, but is number (timestamp)`);
            
            // Hiển thị giá trị Date tương ứng
            const dateValue = new Date(user.lastLogin * 1000); // Nhân 1000 nếu là Unix timestamp
            print(`  As Date: ${dateValue}`);
        } else {
            print(`OK - User ${user.email}: lastLogin is ${typeof user.lastLogin}`);
        }
    } else {
        print(`User ${user.email}: lastLogin is null/undefined`);
    }
}

print(`\n=== Tóm tắt ===`);
print(`Tổng số users có lastLogin là number: ${problemCount}`);

// Kiểm tra sample user cụ thể
print(`\n=== Chi tiết user cụ thể ===`);
const sampleUser = db.users.findOne({"_id": "68417874a74d530ba550eb69"});
if (sampleUser) {
    print(`User: ${sampleUser.email}`);
    print(`lastLogin: ${sampleUser.lastLogin} (type: ${typeof sampleUser.lastLogin})`);
    print(`loyaltyPoints: ${sampleUser.loyaltyPoints} (type: ${typeof sampleUser.loyaltyPoints})`);
} 