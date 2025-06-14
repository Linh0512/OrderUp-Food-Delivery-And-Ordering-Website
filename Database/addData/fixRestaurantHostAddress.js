use("food_delivery_app");

print("Bắt đầu cập nhật địa chỉ cho restaurant hosts...");

// Danh sách quận ở TP.HCM
const districts = [
    "Quận 1", "Quận 3", "Quận 4", "Quận 5", "Quận 6", 
    "Quận 7", "Quận 8", "Quận 10", "Quận 11", "Quận 12",
    "Quận Bình Tân", "Quận Bình Thạnh", "Quận Gò Vấp", 
    "Quận Phú Nhuận", "Quận Tân Bình", "Quận Tân Phú"
];

// Danh sách tên đường phổ biến cho nhà hàng
const streets = [
    "Lê Thánh Tôn", "Nguyễn Huệ", "Đồng Khởi",
    "Hai Bà Trưng", "Pasteur", "Nam Kỳ Khởi Nghĩa",
    "Nguyễn Đình Chiểu", "Cao Thắng", "Trần Hưng Đạo", "Phạm Ngũ Lão"
];

// Hàm tạo địa chỉ ngẫu nhiên cho nhà hàng
function generateRestaurantAddress() {
    const district = districts[Math.floor(Math.random() * districts.length)];
    const street = streets[Math.floor(Math.random() * streets.length)];
    const houseNumber = Math.floor(Math.random() * 200) + 1;
    const ward = Math.floor(Math.random() * 20) + 1;

    // Tạo tọa độ quanh khu vực TP.HCM
    const lat = 10.7 + Math.random() * 0.3; // 10.7 - 11.0
    const lng = 106.6 + Math.random() * 0.3; // 106.6 - 106.9

    return {
        title: "Địa chỉ nhà hàng",
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

// Lấy danh sách restaurant hosts
const restaurantHosts = db.users.find({ role: "restaurantHost" }).toArray();

if (restaurantHosts.length === 0) {
    print("Không tìm thấy restaurant host nào. Kết thúc script.");
    quit();
}

let updatedCount = 0;
for (const host of restaurantHosts) {
    try {
        // Kiểm tra xem host đã có địa chỉ chưa
        if (!host.addresses || host.addresses.length === 0) {
            // Tạo 1-2 địa chỉ cho mỗi host
            const numAddresses = Math.floor(Math.random() * 2) + 1;
            const addresses = Array.from({ length: numAddresses }, (_, index) => {
                const address = generateRestaurantAddress();
                address.isDefault = index === 0; // Địa chỉ đầu tiên là mặc định
                return address;
            });

            const result = db.users.updateOne(
                { _id: host._id },
                { $set: { addresses: addresses } }
            );

            if (result.modifiedCount > 0) {
                updatedCount++;
                print(`Đã thêm địa chỉ cho restaurant host ${host.email}`);
            }
        } else {
            print(`Restaurant host ${host.email} đã có địa chỉ, bỏ qua`);
        }
    } catch (error) {
        print(`Lỗi khi cập nhật địa chỉ cho restaurant host ${host.email}: ${error.message}`);
    }
}

print(`Hoàn thành! Đã cập nhật địa chỉ cho ${updatedCount}/${restaurantHosts.length} restaurant hosts`); 