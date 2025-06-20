use('food_delivery_app');

// Danh sách ID nhà hàng cần cập nhật
const restaurantIds = [
    '68417874a74d530ba550eb72',
    '68478ebc07b8f321562a659e'
];

for (const restaurantId of restaurantIds) {
    // Kiểm tra nhà hàng tồn tại
    const existingRestaurant = db.restaurants.findOne({
        _id: ObjectId(restaurantId)
    });

    if (!existingRestaurant) {
        print(`Không tìm thấy nhà hàng với ID: ${restaurantId}`);
        continue;
    }

    // Tạo dữ liệu mới cho các trường còn thiếu
    const updateData = {
        $set: {
            businessInfo: {
                businessLicense: `BL${Math.floor(Math.random() * 1000000)}`,
                taxCode: `TC${Math.floor(Math.random() * 1000000)}`,
                businessType: 'Restaurant',
                cuisineTypes: ['Vietnamese', 'Asian']
            },
            delivery: {
                isDeliveryAvailable: true,
                deliveryRadius: 5,
                deliveryFee: 15000,
                freeDeliveryThreshold: 200000,
                estimatedDeliveryTime: 30,
                deliveryAreas: ['Quận 1', 'Quận 3', 'Quận Bình Thạnh']
            },
            ratings: {
                averageRating: 4.5,
                totalReviews: Math.floor(Math.random() * 100) + 50,
                ratingBreakdown: {
                    '5': Math.floor(Math.random() * 50) + 30,
                    '4': Math.floor(Math.random() * 30) + 20,
                    '3': Math.floor(Math.random() * 20) + 10,
                    '2': Math.floor(Math.random() * 10) + 5,
                    '1': Math.floor(Math.random() * 5)
                }
            },
            bankInfo: {
                bankName: 'Vietcombank',
                accountNumber: `${Math.floor(Math.random() * 1000000000000)}`,
                accountHolder: existingRestaurant.basicInfo?.name || 'Chủ nhà hàng'
            }
        }
    };

    // Cập nhật nhà hàng
    const result = db.restaurants.updateOne(
        { _id: ObjectId(restaurantId) },
        updateData
    );

    if (result.modifiedCount > 0) {
        print(`Đã cập nhật thành công nhà hàng: ${restaurantId}`);
    } else {
        print(`Không thể cập nhật nhà hàng: ${restaurantId}`);
    }
} 