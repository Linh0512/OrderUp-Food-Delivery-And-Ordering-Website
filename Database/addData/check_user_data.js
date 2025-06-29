// Script để kiểm tra User collection
use('food_delivery_app');

print("=== Kiểm tra User collection ===");

const userCount = db.users.countDocuments();
print(`Tổng số users: ${userCount}`);

if (userCount > 0) {
    const sampleUser = db.users.findOne({});
    print(`\nKiểm tra user ID: ${sampleUser._id}`);
    print(`Email: ${sampleUser.email}`);
    
    // Kiểm tra loyaltyPoints field
    if (sampleUser.loyaltyPoints !== undefined) {
        print(`loyaltyPoints: ${sampleUser.loyaltyPoints} (type: ${typeof sampleUser.loyaltyPoints})`);
        if (sampleUser.loyaltyPoints instanceof Date) {
            print("  >>> PROBLEM: loyaltyPoints is Date instead of Integer!");
            const seconds = Math.floor(sampleUser.loyaltyPoints.getTime() / 1000);
            print(`  >>> Should be: ${seconds}`);
        }
    }
    
    // Kiểm tra các field Date
    if (sampleUser.createdAt) {
        print(`createdAt: ${sampleUser.createdAt} (type: ${typeof sampleUser.createdAt})`);
    }
    if (sampleUser.updatedAt) {
        print(`updatedAt: ${sampleUser.updatedAt} (type: ${typeof sampleUser.updatedAt})`);
    }
    if (sampleUser.lastLogin) {
        print(`lastLogin: ${sampleUser.lastLogin} (type: ${typeof sampleUser.lastLogin})`);
    }
    
    // Kiểm tra nested objects có field int không
    if (sampleUser.profile) {
        print("\n=== Profile info ===");
        const profile = sampleUser.profile;
        for (let [key, value] of Object.entries(profile)) {
            if (value instanceof Date && key !== 'dateOfBirth' && key !== 'createdAt' && key !== 'updatedAt') {
                print(`  profile.${key}: ${value} (type: ${typeof value}) >>> POTENTIAL PROBLEM!`);
            }
        }
    }
    
    print("\n=== Toàn bộ structure của sample user ===");
    print(JSON.stringify(sampleUser, null, 2));
}

// Đếm users có loyaltyPoints bị lỗi
print("\n=== Tìm users có vấn đề ===");
const problemUsers = db.users.find({
    "loyaltyPoints": { "$type": "date" }
}).count();

print(`Users có loyaltyPoints là Date: ${problemUsers}`);

if (problemUsers > 0) {
    print("\nSample user có loyaltyPoints bị lỗi:");
    const problemUser = db.users.findOne({
        "loyaltyPoints": { "$type": "date" }
    });
    print(`ID: ${problemUser._id}`);
    print(`loyaltyPoints: ${problemUser.loyaltyPoints}`);
    print(`Should be: ${Math.floor(problemUser.loyaltyPoints.getTime() / 1000)}`);
} 