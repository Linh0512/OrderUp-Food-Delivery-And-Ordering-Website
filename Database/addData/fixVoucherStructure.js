use('food_delivery_app');

// Xóa toàn bộ dữ liệu cũ trong collection vouchers
db.vouchers.drop();

// Tạo collection mới với validator
db.createCollection("vouchers", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["code", "value", "type", "conditions", "validity", "remainingValue", "createdAt", "updatedAt", "isActive"],
            properties: {
                code: {
                    bsonType: "string",
                    description: "Mã voucher - bắt buộc và phải là string"
                },
                value: {
                    bsonType: ["double", "int"],
                    description: "Giá trị voucher - bắt buộc và phải là số"
                },
                type: {
                    bsonType: "string",
                    enum: ["GLOBAL", "LOCAL"],
                    description: "Loại voucher (GLOBAL cho admin, LOCAL cho nhà hàng) - bắt buộc"
                },
                restaurantId: {
                    bsonType: ["string", "null"],
                    description: "ID của nhà hàng (null nếu là voucher global)"
                },
                conditions: {
                    bsonType: "object",
                    required: ["minimumOrderAmount"],
                    properties: {
                        minimumOrderAmount: {
                            bsonType: ["double", "int"],
                            description: "Giá trị đơn hàng tối thiểu"
                        }
                    }
                },
                validity: {
                    bsonType: "object",
                    required: ["issuedAt", "expiresAt"],
                    properties: {
                        issuedAt: {
                            bsonType: "date",
                            description: "Thời gian bắt đầu có hiệu lực"
                        },
                        expiresAt: {
                            bsonType: "date",
                            description: "Thời gian hết hạn"
                        }
                    }
                },
                usage: {
                    bsonType: "array",
                    items: {
                        bsonType: "object",
                        required: ["userId", "usedAt"],
                        properties: {
                            userId: {
                                bsonType: "string",
                                description: "ID của người dùng đã sử dụng voucher"
                            },
                            usedAt: {
                                bsonType: "date",
                                description: "Thời gian sử dụng"
                            }
                        }
                    }
                },
                remainingValue: {
                    bsonType: "int",
                    description: "Số lần còn lại có thể sử dụng voucher"
                },
                createdAt: {
                    bsonType: "date",
                    description: "Thời gian tạo voucher"
                },
                updatedAt: {
                    bsonType: "date",
                    description: "Thời gian cập nhật voucher gần nhất"
                },
                isActive: {
                    bsonType: "bool",
                    description: "Trạng thái hoạt động của voucher, nếu user đã sử dụng voucher vượt quá remainingValue thì isActive = false"
                }
            }
        }
    }
});

// // Tạo index cho các trường thường được query
// db.vouchers.createIndex({ "code": 1 }, { unique: true });
// db.vouchers.createIndex({ "type": 1 });
// db.vouchers.createIndex({ "restaurantId": 1 });
// db.vouchers.createIndex({ "isActive": 1 });
// db.vouchers.createIndex({ "validity.expiresAt": 1 });

// Lấy một số userId có role là user để tạo sample data
const userIds = db.users.find({ "role": "user" }, { _id: 1 }).limit(3).map(user => user._id.toString());
const restaurantIds = db.restaurants.find({}, { _id: 1 }).limit(2).map(restaurant => restaurant._id.toString());

// Tạo sample data cho voucher global (admin)
const globalVouchers = [
    {
        code: "WELCOME2024",
        value: NumberInt(50000),
        type: "GLOBAL",
        restaurantId: null,
        conditions: {
            minimumOrderAmount: NumberInt(200000)
        },
        validity: {
            issuedAt: new Date(),
            expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 3))
        },
        usage: [],
        remainingValue: NumberInt(1000),
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
    },
    {
        code: "TETHOLIDAY",
        value: NumberInt(100000),
        type: "GLOBAL",
        restaurantId: null,
        conditions: {
            minimumOrderAmount: NumberInt(500000)
        },
        validity: {
            issuedAt: new Date(),
            expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 1))
        },
        usage: [],
        remainingValue: NumberInt(500),
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
    }
];

db.vouchers.insertMany(globalVouchers);

// Tạo sample data cho voucher local (nhà hàng)
let localVouchers = [];
restaurantIds.forEach((restaurantId, idx) => {
    localVouchers.push({
        code: `RES${idx + 1}_NEW2024`,
        value: NumberInt(30000),
        type: "LOCAL",
        restaurantId: restaurantId,
        conditions: {
            minimumOrderAmount: NumberInt(150000)
        },
        validity: {
            issuedAt: new Date(),
            expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 2))
        },
        usage: [],
        remainingValue: NumberInt(200),
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
    });
    
    localVouchers.push({
        code: `RES${idx + 1}_SPECIAL`,
        value: NumberInt(75000),
        type: "LOCAL",
        restaurantId: restaurantId,
        conditions: {
            minimumOrderAmount: NumberInt(300000)
        },
        validity: {
            issuedAt: new Date(),
            expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 1))
        },
        usage: [],
        remainingValue: NumberInt(100),
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
    });
});

db.vouchers.insertMany(localVouchers);

// Thêm usage history cho một số voucher
const allVouchers = db.vouchers.find().toArray();
allVouchers.forEach((voucher, index) => {
    // Đảm bảo 30% voucher đầu tiên có usage
    if (index < Math.ceil(allVouchers.length * 0.3)) {
        const numUsages = Math.min(3, voucher.remainingValue); // Tối đa 3 lần sử dụng
        const usages = [];
        
        for (let i = 0; i < numUsages; i++) {
            usages.push({
                userId: userIds[Math.floor(Math.random() * userIds.length)],
                usedAt: new Date(new Date().setDate(new Date().getDate() - i * 2)) // Cách nhau 2 ngày
            });
        }
        
        const newRemainingValue = NumberInt(voucher.remainingValue - usages.length);
        const isStillActive = newRemainingValue > 0;
        
        db.vouchers.updateOne(
            { _id: voucher._id },
            { 
                $set: { 
                    usage: usages,
                    remainingValue: newRemainingValue,
                    isActive: isStillActive,
                    updatedAt: new Date()
                }
            }
        );
    }
});

// In thông báo kết quả
const totalVouchers = db.vouchers.count();
const vouchersWithUsage = db.vouchers.count({ "usage.0": { $exists: true } });
const inactiveVouchers = db.vouchers.count({ isActive: false });

print("Đã cập nhật cấu trúc và tạo dữ liệu mẫu cho collection vouchers thành công!");
print(`Tổng số voucher đã tạo: ${totalVouchers}`);
print(`Số voucher có lịch sử sử dụng: ${vouchersWithUsage}`);
print(`Số voucher không còn active: ${inactiveVouchers}`); 