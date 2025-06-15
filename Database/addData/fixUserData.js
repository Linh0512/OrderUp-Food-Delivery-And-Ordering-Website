use("food_delivery_app");

print("Bắt đầu cập nhật thông tin cho users...");

// Danh sách quận ở TP.HCM
const districts = [
    "Quận 1", "Quận 3", "Quận 4", "Quận 5", "Quận 6", 
    "Quận 7", "Quận 8", "Quận 10", "Quận 11", "Quận 12",
    "Quận Bình Tân", "Quận Bình Thạnh", "Quận Gò Vấp", 
    "Quận Phú Nhuận", "Quận Tân Bình", "Quận Tân Phú"
];

// Danh sách tên đường phổ biến
const streets = [
    "Nguyễn Văn Cừ", "Lê Hồng Phong", "Nguyễn Thị Minh Khai",
    "Điện Biên Phủ", "Cách Mạng Tháng 8", "Nguyễn Văn Linh",
    "Võ Văn Kiệt", "Phạm Văn Đồng", "Phan Văn Trị", "Quang Trung"
];

// Danh sách các loại ví điện tử
const ewalletTypes = ["momo", "zalopay", "vnpay", "visa"];

// Hàm tạo địa chỉ ngẫu nhiên
function generateRandomAddress() {
    const district = districts[Math.floor(Math.random() * districts.length)];
    const street = streets[Math.floor(Math.random() * streets.length)];
    const houseNumber = Math.floor(Math.random() * 200) + 1;
    const ward = Math.floor(Math.random() * 20) + 1;

    // Tạo tọa độ quanh khu vực TP.HCM
    const lat = 10.7 + Math.random() * 0.3; // 10.7 - 11.0
    const lng = 106.6 + Math.random() * 0.3; // 106.6 - 106.9

    return {
        title: Math.random() < 0.7 ? "Nhà riêng" : "Văn phòng",
        fullAddress: `${houseNumber} ${street}, Phường ${ward}, ${district}, TP.HCM`,
        district: district,
        city: "TP.HCM",
        isDefault: true,
        coordinates: {
            lat: Number(lat.toFixed(4)),
            lng: Number(lng.toFixed(4))
        }
    };
}

// Hàm tạo phương thức thanh toán ngẫu nhiên
function generateRandomPaymentMethod() {
    const ewalletType = ewalletTypes[Math.floor(Math.random() * ewalletTypes.length)];
    const phoneNumber = "09" + Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
    
    return {
        type: "ewallet",
        ewalletType: ewalletType,
        ewalletAccount: phoneNumber,
        isDefault: true
    };
}

// Lấy danh sách users có role là "user"
const users = db.users.find({ role: "user" }).toArray();

let updatedCount = 0;
for (const user of users) {
    try {
        const updates = {
            $set: {}
        };

        // Thêm addresses nếu chưa có
        if (!user.addresses || user.addresses.length === 0) {
            // Tạo 1-3 địa chỉ
            const numAddresses = Math.floor(Math.random() * 3) + 1;
            const addresses = Array.from({ length: numAddresses }, (_, index) => {
                const address = generateRandomAddress();
                address.isDefault = index === 0; // Địa chỉ đầu tiên là mặc định
                return address;
            });
            updates.$set.addresses = addresses;
        }

        // Thêm paymentMethods nếu chưa có
        if (!user.paymentMethods || user.paymentMethods.length === 0) {
            // Tạo 1-2 phương thức thanh toán
            const numPaymentMethods = Math.floor(Math.random() * 2) + 1;
            const paymentMethods = Array.from({ length: numPaymentMethods }, (_, index) => {
                const paymentMethod = generateRandomPaymentMethod();
                paymentMethod.isDefault = index === 0; // Phương thức đầu tiên là mặc định
                return paymentMethod;
            });
            updates.$set.paymentMethods = paymentMethods;
        }

        // Thêm hoặc cập nhật loyaltyPoints
        if (!user.loyaltyPoints) {
            // Tạo số điểm từ 0-500
            updates.$set.loyaltyPoints = Math.floor(Math.random() * 501);
        }

        // Chỉ cập nhật nếu có thay đổi
        if (Object.keys(updates.$set).length > 0) {
            const result = db.users.updateOne(
                { _id: user._id },
                updates
            );

            if (result.modifiedCount > 0) {
                updatedCount++;
                print(`Đã cập nhật thông tin cho user ${user.email}`);
            }
        }
    } catch (error) {
        print(`Lỗi khi cập nhật user ${user.email}: ${error.message}`);
    }
}

print(`Hoàn thành! Đã cập nhật ${updatedCount}/${users.length} users`); 