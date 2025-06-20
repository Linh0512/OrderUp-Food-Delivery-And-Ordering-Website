use("food_delivery_app");

// Xóa dữ liệu cũ nếu cần
print("Xóa dữ liệu cũ...");
const deleteOrdersResult = db.orders.deleteMany({});
const deleteReviewsResult = db.reviews.deleteMany({});
print(`Đã xóa ${deleteOrdersResult.deletedCount} orders và ${deleteReviewsResult.deletedCount} reviews cũ`);

// Hàm tạo mã order ngẫu nhiên
function generateOrderNumber() {
  const currentDate = new Date();
  const year = currentDate.getFullYear().toString().slice(-2);
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `FE${year}${month}${day}${random}`;
}

// Hàm tạo thời gian ngẫu nhiên trong khoảng 30 ngày gần đây
function getRandomDate() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
  return new Date(thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime()));
}

// Lấy danh sách users có role là "user"
const validUsers = db.users.find({ role: "user" }).toArray();
if (validUsers.length === 0) {
  print("Không tìm thấy user nào có role 'user'. Kết thúc script.");
} else {
  // Tạo 10 orders mới
  print("Bắt đầu tạo orders mới...");
  let successfulOrders = 0;

  while (successfulOrders < 10) {
    try {
      // Lấy ngẫu nhiên một user từ danh sách đã lọc
      const randomCustomer = validUsers[Math.floor(Math.random() * validUsers.length)];
      
      if (!randomCustomer) {
        print("Không tìm thấy user, bỏ qua order này");
        continue;
      }

      const randomRestaurant = db.restaurants.aggregate([{ $sample: { size: 1 } }]).next();
      
      if (!randomRestaurant) {
        print("Không tìm thấy restaurant, bỏ qua order này");
        continue;
      }

      // Lấy ngẫu nhiên 1-3 món từ restaurant đó
      const randomDishes = db.dishes.aggregate([
        { $match: { restaurantId: randomRestaurant._id } },
        { $sample: { size: Math.floor(Math.random() * 2) + 1 } }
      ]).toArray();

      if (!randomDishes.length) {
        print(`Không tìm thấy món ăn cho restaurant ${randomRestaurant._id}, bỏ qua order này`);
        continue;
      }

      // Tạo danh sách items
      const items = randomDishes.map(dish => {
        const quantity = Math.floor(Math.random() * 2) + 1;
        const subtotal = (dish.price || 50000) * quantity;
        return {
          dishId: dish._id,
          dishName: dish.name || "Món ăn không tên",
          dishImage: dish.images && dish.images.length > 0 ? dish.images[0] : "https://example.com/default-dish-image.jpg",
          quantity: quantity,
          unitPrice: dish.price || 50000,
          selectedOptions: [],
          subtotal: subtotal,
          specialInstructions: ""
        };
      });

      // Tính tổng tiền
      const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
      const deliveryFee = 15000;
      const serviceFee = Math.round(subtotal * 0.05);
      const discount = Math.random() < 0.3 ? 20000 : 0;
      const totalAmount = subtotal + deliveryFee + serviceFee - discount;

      // Lấy ngẫu nhiên một driver
      const randomDriver = db.drivers.aggregate([{ $sample: { size: 1 } }]).next();

      if (!randomDriver) {
        print("Không tìm thấy driver, bỏ qua order này");
        continue;
      }

      // Tạo thời gian cho order
      const placedAt = getRandomDate();
      const confirmedAt = new Date(placedAt.getTime() + 5 * 60 * 1000);
      const preparingAt = new Date(confirmedAt.getTime() + 5 * 60 * 1000);
      const readyAt = new Date(preparingAt.getTime() + 15 * 60 * 1000);
      const pickedUpAt = new Date(readyAt.getTime() + 5 * 60 * 1000);
      const deliveredAt = new Date(pickedUpAt.getTime() + 15 * 60 * 1000);

      const order = {
        orderNumber: generateOrderNumber(),
        customerId: randomCustomer._id,
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
          address: randomCustomer.address || {
            fullAddress: "123 Đường mặc định",
            district: "Quận mặc định",
            city: "TP.HCM",
            coordinates: {
              lat: 10.7769,
              lng: 106.7009
            }
          },
          customerName: randomCustomer.profile ? `${randomCustomer.profile.firstName} ${randomCustomer.profile.lastName}` : "Khách hàng",
          customerPhone: randomCustomer.profile ? randomCustomer.profile.phone : "0123456789",
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

      db.orders.insertOne(order);
      successfulOrders++;
      print(`Đã tạo order thứ ${successfulOrders}`);
    } catch (error) {
      print(`Lỗi khi tạo order: ${error.message}`);
      continue;
    }
  }

  print(`Đã tạo xong ${successfulOrders} orders`);

  // Tạo review cho 80% orders
  print("Bắt đầu tạo reviews...");

  const comments = [
    "Món ăn rất ngon, giao hàng nhanh!",
    "Đồ ăn còn nóng khi nhận được, rất hài lòng",
    "Shipper thân thiện, đóng gói cẩn thận",
    "Chất lượng món ăn tuyệt vời, sẽ đặt lại",
    "Giá cả hợp lý, portion size vừa đủ",
    "Đồ ăn tươi ngon, presentation đẹp",
    "Giao hàng đúng giờ, service tốt",
    "Món ăn đúng vị, rất authentic",
    "Đóng gói sạch sẽ, giao hàng chuyên nghiệp",
    "Quán ăn chất lượng, sẽ giới thiệu cho bạn bè"
  ];

  const orders = db.orders.find().toArray();
  const reviewCount = Math.floor(orders.length * 0.8);

  for (let i = 0; i < reviewCount; i++) {
    try {
      const order = orders[i];
      const randomComment = comments[Math.floor(Math.random() * comments.length)];
      
      const review = {
        orderId: order._id,
        customerId: order.customerId,
        restaurantId: order.restaurantId,
        rating: Math.floor(Math.random() * 3) + 3, // Rating từ 3-5 sao
        images: [
          "https://example.com/reviews/food-1.jpg",
          "https://example.com/reviews/food-2.jpg"
        ],
        userComment: randomComment,
        restaurantReply: null,
        likes: Math.floor(Math.random() * 50),
        isActive: true,
        createdAt: new Date(order.timing.deliveredAt.getTime() + Math.random() * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      };

      db.reviews.insertOne(review);
      print(`Đã tạo review thứ ${i + 1}`);
    } catch (error) {
      print(`Lỗi khi tạo review thứ ${i + 1}: ${error.message}`);
      continue;
    }
  }

  print(`Đã tạo ${reviewCount} reviews cho các order`);
}