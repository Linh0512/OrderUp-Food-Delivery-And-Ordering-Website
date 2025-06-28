// Script để fix voucher remainingValue bị corrupt thành Date object
// Chạy script này trong MongoDB Compass hoặc mongo shell

print("=== FIX VOUCHER REMAINING VALUE ===");

// Kết nối với database
use('orderup');

// Tìm tất cả voucher có remainingValue là Date object
const corruptedVouchers = db.vouchers.find({
    "remainingValue": { $type: "date" }
});

print("Vouchers với remainingValue bị corrupt (Date objects):");
corruptedVouchers.forEach(voucher => {
    print(`- ID: ${voucher._id}, Code: ${voucher.code}, RemainingValue: ${voucher.remainingValue}`);
});

// Fix bằng cách set remainingValue về giá trị int hợp lý
print("\n=== FIXING CORRUPTED DATA ===");

// Option 1: Set tất cả voucher bị corrupt về 10 lần sử dụng còn lại
const result1 = db.vouchers.updateMany(
    { "remainingValue": { $type: "date" } },
    { $set: { "remainingValue": 10 } }
);

print(`Updated ${result1.modifiedCount} vouchers with remainingValue = 10`);

// Option 2: Hoặc có thể set dựa trên logic khác
// Uncomment nếu muốn set khác:
/*
db.vouchers.updateMany(
    { 
        "remainingValue": { $type: "date" },
        "type": "GLOBAL"
    },
    { $set: { "remainingValue": 100 } }
);

db.vouchers.updateMany(
    { 
        "remainingValue": { $type: "date" },
        "type": "LOCAL" 
    },
    { $set: { "remainingValue": 50 } }
);
*/

// Verify kết quả
print("\n=== VERIFICATION ===");
const remainingCorrupted = db.vouchers.find({
    "remainingValue": { $type: "date" }
}).count();

print(`Remaining corrupted vouchers: ${remainingCorrupted}`);

// Hiển thị tất cả voucher sau khi fix
print("\nAll vouchers after fix:");
db.vouchers.find({}, {
    _id: 1,
    code: 1,
    type: 1,
    remainingValue: 1,
    isActive: 1
}).forEach(voucher => {
    print(`- ID: ${voucher._id}, Code: ${voucher.code}, Type: ${voucher.type}, RemainingValue: ${voucher.remainingValue} (${typeof voucher.remainingValue}), Active: ${voucher.isActive}`);
});

print("\n=== SCRIPT COMPLETED ==="); 