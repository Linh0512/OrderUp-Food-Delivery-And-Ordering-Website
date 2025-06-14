use("food_delivery_app");

// Xóa dữ liệu orders cũ
print("Xóa dữ liệu orders cũ...");
const deleteOrdersResult = db.orders.deleteMany({});
print(`Đã xóa ${deleteOrdersResult.deletedCount} orders cũ`);

// Hàm tạo mã order
function generateOrderNumber() {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString().slice(-2);
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `FE${year}${month}${day}${random}`;
}

// Hàm tạo thời gian ngẫu nhiên trong 30 ngày gần đây
function getRandomDate() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
    return new Date(thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime()));
}

// Lấy danh sách users có role là "user"
const validUsers = db.users.find({ role: "user" }).toArray();
if (validUsers.length === 0) {
    print("Không tìm thấy user nào có role 'user'. Kết thúc script.");
    quit();
}

// Lấy danh sách nhà hàng có món ăn
const restaurantsWithDishes = db.restaurants.aggregate([
    {
        $lookup: {
            from: "dishes",
            localField: "_id",
            foreignField: "restaurantId",
            as: "dishes"
        }
    },
    {
        $match: {
            "dishes": { $ne: [] }
        }
    }
]).toArray();

if (restaurantsWithDishes.length === 0) {
    print("Không tìm thấy nhà hàng nào có món ăn. Kết thúc script.");
    quit();
}

// Lấy danh sách drivers
const drivers = db.drivers.find().toArray();
if (drivers.length === 0) {
    print("Không tìm thấy driver nào. Kết thúc script.");
    quit();
}

// Tạo orders cho mỗi user
print("Bắt đầu tạo orders mới...");
let totalOrders = 0;

for (const user of validUsers) {
    // Mỗi user sẽ có 1-3 orders
    const numOrders = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < numOrders; i++) {
        try {
            // Chọn ngẫu nhiên một nhà hàng có món ăn
            const randomRestaurant = restaurantsWithDishes[Math.floor(Math.random() * restaurantsWithDishes.length)];
            
            // Lấy danh sách món ăn của nhà hàng đó
            const restaurantDishes = db.dishes.find({ restaurantId: randomRestaurant._id }).toArray();
            
            // Chọn ngẫu nhiên 1-3 món
            const numDishes = Math.floor(Math.random() * 3) + 1;
            const selectedDishes = [];
            const usedDishIds = new Set();

            while (selectedDishes.length < numDishes && usedDishIds.size < restaurantDishes.length) {
                const randomDish = restaurantDishes[Math.floor(Math.random() * restaurantDishes.length)];
                if (!usedDishIds.has(randomDish._id.toString())) {
                    selectedDishes.push(randomDish);
                    usedDishIds.add(randomDish._id.toString());
                }
            }

            // Tạo danh sách items với options và choices
            const items = selectedDishes.map(dish => {
                const quantity = Math.floor(Math.random() * 2) + 1;
                let selectedOptions = [];

                // Xử lý options và choices nếu có
                if (dish.options && dish.options.length > 0) {
                    // Với mỗi option, có 50% cơ hội sẽ chọn
                    selectedOptions = dish.options
                        .filter(() => Math.random() < 0.5)
                        .map(option => {
                            const selectedChoice = option.choices[Math.floor(Math.random() * option.choices.length)];
                            return {
                                optionName: option.name,
                                choiceName: selectedChoice.name,
                                additionalPrice: selectedChoice.price || 0
                            };
                        });
                }

                // Tính giá cho một món
                const basePrice = dish.pricing.basePrice;
                // Tính tổng giá của các options được chọn
                const optionsPrice = selectedOptions.reduce((sum, opt) => sum + opt.additionalPrice, 0);
                // Giá cuối cùng = (giá gốc * số lượng) + giá options
                const unitPrice = basePrice;
                const subtotal = (basePrice * quantity) + optionsPrice;

                return {
                    dishId: dish._id,
                    dishName: dish.basicInfo.name,
                    dishImage: dish.basicInfo.images[0],
                    quantity: quantity,
                    unitPrice: unitPrice,
                    selectedOptions: selectedOptions,
                    subtotal: subtotal,
                    specialInstructions: ""
                };
            });

            // Tính tổng tiền
            const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
            const deliveryFee = 15000;
            const serviceFee = Math.round(subtotal * 0.05); // 5% phí dịch vụ
            const discount = Math.random() < 0.3 ? 20000 : 0;
            const totalAmount = subtotal + deliveryFee + serviceFee - discount;

            // Chọn ngẫu nhiên một driver
            const randomDriver = drivers[Math.floor(Math.random() * drivers.length)];

            // Tạo thời gian cho order
            const placedAt = getRandomDate();
            const confirmedAt = new Date(placedAt.getTime() + 5 * 60 * 1000);
            const preparingAt = new Date(confirmedAt.getTime() + 5 * 60 * 1000);
            const readyAt = new Date(preparingAt.getTime() + 15 * 60 * 1000);
            const pickedUpAt = new Date(readyAt.getTime() + 5 * 60 * 1000);
            const deliveredAt = new Date(pickedUpAt.getTime() + 15 * 60 * 1000);

            // Lấy thông tin địa chỉ từ user
            const userAddress = user.addresses && user.addresses.length > 0 
                ? user.addresses[0] 
                : null;

            if (!userAddress) {
                print(`User ${user._id} không có địa chỉ, bỏ qua tạo order`);
                continue;
            }

            // Tạo order mới
            const order = {
                orderNumber: generateOrderNumber(),
                customerId: user._id,
                restaurantId: randomRestaurant._id,
                orderDetails: {
                    items: items,
                    subtotal: subtotal,
                    deliveryFee: deliveryFee,
                    serviceFee: serviceFee,
                    tax: 0,
                    discount: discount,
                    totalAmount: totalAmount
                },
                deliveryInfo: {
                    address: userAddress,
                    customerName: `${user.profile.firstName} ${user.profile.lastName}`,
                    customerPhone: user.profile.phone,
                    deliveryInstructions: "",
                    deliveryType: "delivery",
                    estimatedDeliveryTime: new Date(placedAt.getTime() + 45 * 60 * 1000),
                    actualDeliveryTime: deliveredAt
                },
                payment: {
                    method: Math.random() < 0.7 ? "ewallet" : "cod",
                    status: "paid",
                    transactionId: "TXN" + Math.random().toString(36).substr(2, 9),
                    paidAt: placedAt
                },
                promocode: discount > 0 ? {
                    code: "WELCOME20",
                    discountAmount: discount,
                    discountType: "fixed"
                } : null,
                status: {
                    current: "delivered",
                    history: [
                        { status: "pending", timestamp: placedAt, note: "Đơn hàng được tạo" },
                        { status: "confirmed", timestamp: confirmedAt, note: "Nhà hàng xác nhận" },
                        { status: "preparing", timestamp: preparingAt, note: "Đang chuẩn bị" },
                        { status: "ready", timestamp: readyAt, note: "Sẵn sàng giao" },
                        { status: "delivering", timestamp: pickedUpAt, note: "Đang giao hàng" },
                        { status: "delivered", timestamp: deliveredAt, note: "Đã giao thành công" }
                    ]
                },
                timing: {
                    placedAt: placedAt,
                    confirmedAt: confirmedAt,
                    preparingAt: preparingAt,
                    readyAt: readyAt,
                    pickedUpAt: pickedUpAt,
                    deliveredAt: deliveredAt
                },
                assignedDriver: randomDriver._id,
                createdAt: placedAt,
                updatedAt: deliveredAt
            };

            // Kiểm tra xem có đủ thông tin cần thiết không
            if (!user.profile || !user.profile.firstName || !user.profile.phone) {
                print(`User ${user._id} thiếu thông tin profile, bỏ qua tạo order`);
                continue;
            }

            db.orders.insertOne(order);
            totalOrders++;
            print(`Đã tạo order thứ ${totalOrders} cho user ${user.profile.firstName}`);
        } catch (error) {
            print(`Lỗi khi tạo order cho user ${user._id}: ${error.message}`);
            continue;
        }
    }
}

print(`Hoàn thành! Đã tạo ${totalOrders} orders cho ${validUsers.length} users`);