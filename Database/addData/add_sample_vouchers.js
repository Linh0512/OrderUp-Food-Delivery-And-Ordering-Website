// Script để thêm sample voucher data
// Chạy script này trong MongoDB Compass hoặc mongo shell

print("=== ADD SAMPLE VOUCHERS ===");

// Kết nối với database
use('food_delivery_app');

// Xóa voucher cũ nếu có (optional)
db.vouchers.deleteMany({});

// Sample vouchers
const sampleVouchers = [
    {
        code: "GLOBAL10",
        value: 10000,
        type: "GLOBAL",
        restaurantId: null,
        conditions: {
            minimumOrderAmount: 50000
        },
        validity: {
            issuedAt: new Date(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 ngày từ bây giờ
        },
        usage: [],
        remainingValue: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
    },
    {
        code: "GLOBAL20",
        value: 20000,
        type: "GLOBAL", 
        restaurantId: null,
        conditions: {
            minimumOrderAmount: 100000
        },
        validity: {
            issuedAt: new Date(),
            expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // 15 ngày từ bây giờ
        },
        usage: [],
        remainingValue: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
    },
    {
        code: "LOCAL5K",
        value: 5000,
        type: "LOCAL",
        restaurantId: "68478ebc07b8f321562a659e", // Restaurant ID từ test
        conditions: {
            minimumOrderAmount: 30000
        },
        validity: {
            issuedAt: new Date(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 ngày từ bây giờ
        },
        usage: [],
        remainingValue: 25,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
    },
    {
        code: "EXPIRED10",
        value: 10000,
        type: "GLOBAL",
        restaurantId: null,
        conditions: {
            minimumOrderAmount: 40000
        },
        validity: {
            issuedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 ngày trước
            expiresAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // Hết hạn 1 ngày trước
        },
        usage: [],
        remainingValue: 30,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
        isActive: false
    },
    {
        code: "OUTOFSTOCK",
        value: 15000,
        type: "GLOBAL",
        restaurantId: null,
        conditions: {
            minimumOrderAmount: 60000
        },
        validity: {
            issuedAt: new Date(),
            expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000) // 20 ngày từ bây giờ
        },
        usage: [],
        remainingValue: 0, // Hết voucher
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: false
    }
];

// Insert vouchers
const result = db.vouchers.insertMany(sampleVouchers);
print(`Inserted ${result.insertedIds.length} sample vouchers`);

// Hiển thị tất cả vouchers
print("\nAll vouchers in database:");
db.vouchers.find({}, {
    _id: 1,
    code: 1,
    type: 1,
    value: 1,
    remainingValue: 1,
    "validity.expiresAt": 1,
    isActive: 1,
    restaurantId: 1
}).forEach(voucher => {
    print(`- ID: ${voucher._id}`);
    print(`  Code: ${voucher.code}`);
    print(`  Type: ${voucher.type}`);
    print(`  Value: ${voucher.value}`);
    print(`  Remaining: ${voucher.remainingValue}`);
    print(`  Expires: ${voucher.validity.expiresAt}`);
    print(`  Active: ${voucher.isActive}`);
    print(`  RestaurantId: ${voucher.restaurantId}`);
    print("  ---");
});

print("\n=== SAMPLE VOUCHERS ADDED ==="); 