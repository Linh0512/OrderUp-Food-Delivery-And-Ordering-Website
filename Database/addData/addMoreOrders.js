use("food_delivery_app");

// Hàm tạo mã order ngẫu nhiên
function generateOrderNumber() {
  const currentDate = new Date();
  const year = currentDate.getFullYear().toString().slice(-2);
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `FE${year}${month}${day}${random}`;
}

// Hàm tạo thời gian ngẫu nhiên từ tháng 1 đến tháng 6 năm 2025
function getRandomDateIn2025() {
  const startDate = new Date('2025-01-01T00:00:00Z');
  const endDate = new Date('2025-06-30T23:59:59Z');
  return new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
}

// Hàm tạo trạng thái order ngẫu nhiên
function getRandomOrderStatus() {
  const statuses = ['delivered', 'processing', 'cancelled'];
  const weights = [0.7, 0.2, 0.1]; // 70% delivered, 20% processing, 10% cancelled
  
  const random = Math.random();
  let sum = 0;
  for (let i = 0; i < weights.length; i++) {
    sum += weights[i];
    if (random < sum) return statuses[i];
  }
  return statuses[0];
}

// Lấy danh sách users có role là "user"
const validUsers = db.users.find({ role: "user" }).toArray();
if (validUsers.length === 0) {
  print("Không tìm thấy user nào có role 'user'. Kết thúc script.");
} else {
  print("Bắt đầu tạo thêm 20 orders mới...");
  let successfulOrders = 0;

  while (successfulOrders < 20) {
    try {
      // Lấy ngẫu nhiên một user
      const randomCustomer = validUsers[Math.floor(Math.random() * validUsers.length)];
      
      if (!randomCustomer) {
        print("Không tìm thấy user, bỏ qua order này");
        continue;
      }

      // Lấy ngẫu nhiên một restaurant
      const randomRestaurant = db.restaurants.aggregate([{ $sample: { size: 1 } }]).next();
      
      if (!randomRestaurant) {
        print("Không tìm thấy restaurant, bỏ qua order này");
        continue;
      }

      // Lấy ngẫu nhiên 1-4 món từ restaurant đó
      const randomDishes = db.dishes.aggregate([
        { $match: { restaurantId: randomRestaurant._id } },
        { $sample: { size: Math.floor(Math.random() * 3) + 1 } }
      ]).toArray();

      if (!randomDishes.length) {
        print(`Không tìm thấy món ăn cho restaurant ${randomRestaurant._id}, bỏ qua order này`);
        continue;
      }

      // Tạo danh sách items với số lượng đa dạng hơn
      const items = randomDishes.map(dish => {
        const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 món
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

      // Tính tổng tiền với các fee đa dạng hơn
      const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
      const deliveryFee = Math.random() < 0.3 ? 25000 : 15000; // 30% chance phí cao hơn
      const serviceFee = Math.round(subtotal * 0.05);
      const discount = Math.random() < 0.4 ? Math.floor(Math.random() * 3 + 1) * 10000 : 0; // 40% chance giảm giá 10k-30k
      const totalAmount = subtotal + deliveryFee + serviceFee - discount;

      // Lấy ngẫu nhiên một driver
      const randomDriver = db.drivers.aggregate([{ $sample: { size: 1 } }]).next();

      // Tạo thời gian ngẫu nhiên trong 6 tháng đầu năm 2025
      const placedAt = getRandomDateIn2025();
      const orderStatus = getRandomOrderStatus();

      // Khởi tạo các mốc thời gian dựa trên trạng thái
      let confirmedAt, preparingAt, readyAt, pickedUpAt, deliveredAt;
      let statusHistory = [
        { status: "pending", timestamp: placedAt, note: "Đơn hàng được tạo" }
      ];

      if (orderStatus !== "cancelled") {
        confirmedAt = new Date(placedAt.getTime() + 5 * 60 * 1000);
        statusHistory.push({ status: "confirmed", timestamp: confirmedAt, note: "Nhà hàng xác nhận" });

        if (orderStatus === "processing" || orderStatus === "delivered") {
          preparingAt = new Date(confirmedAt.getTime() + 5 * 60 * 1000);
          statusHistory.push({ status: "preparing", timestamp: preparingAt, note: "Đang chuẩn bị" });
        }

        if (orderStatus === "delivered") {
          readyAt = new Date(preparingAt.getTime() + 15 * 60 * 1000);
          pickedUpAt = new Date(readyAt.getTime() + 5 * 60 * 1000);
          deliveredAt = new Date(pickedUpAt.getTime() + 15 * 60 * 1000);
          
          statusHistory.push(
            { status: "ready", timestamp: readyAt, note: "Sẵn sàng giao" },
            { status: "delivering", timestamp: pickedUpAt, note: "Đang giao hàng" },
            { status: "delivered", timestamp: deliveredAt, note: "Đã giao thành công" }
          );
        }
      } else {
        confirmedAt = new Date(placedAt.getTime() + Math.floor(Math.random() * 10) * 60 * 1000);
        statusHistory.push({ status: "cancelled", timestamp: confirmedAt, note: "Đơn hàng đã hủy" });
      }

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
          estimatedDeliveryTime: orderStatus !== "cancelled" ? new Date(placedAt.getTime() + 45 * 60 * 1000) : null,
          actualDeliveryTime: deliveredAt || null
        },
        payment: {
          method: Math.random() < 0.7 ? "ewallet" : "cod",
          status: orderStatus === "cancelled" ? "refunded" : "paid",
          transactionId: "TXN" + Math.random().toString(36).substr(2, 9),
          paidAt: orderStatus === "cancelled" ? null : placedAt
        },
        promocode: discount > 0 ? {
          code: "WELCOME" + discount/1000,
          discountAmount: discount,
          discountType: "fixed"
        } : null,
        status: {
          current: orderStatus,
          history: statusHistory
        },
        timing: {
          placedAt: placedAt,
          confirmedAt: confirmedAt,
          preparingAt: preparingAt || null,
          readyAt: readyAt || null,
          pickedUpAt: pickedUpAt || null,
          deliveredAt: deliveredAt || null
        },
        assignedDriver: orderStatus === "cancelled" ? null : randomDriver._id,
        createdAt: placedAt,
        updatedAt: deliveredAt || confirmedAt
      };

      db.orders.insertOne(order);
      successfulOrders++;
      print(`Đã tạo order thứ ${successfulOrders} - Trạng thái: ${orderStatus}`);
    } catch (error) {
      print(`Lỗi khi tạo order: ${error.message}`);
      continue;
    }
  }

  print(`Đã tạo xong ${successfulOrders} orders mới`);

  // Tạo review cho các đơn hàng đã giao thành công
  print("Bắt đầu tạo reviews cho orders mới...");

  const comments = [
    "Món ăn rất ngon và đúng vị, sẽ quay lại lần sau!",
    "Đồ ăn nóng hổi, giao hàng nhanh chóng",
    "Shipper rất thân thiện và chuyên nghiệp",
    "Chất lượng món ăn xứng đáng với giá tiền",
    "Portion size hơi nhỏ nhưng bù lại rất ngon",
    "Đóng gói cẩn thận, presentation đẹp mắt",
    "Nhà hàng phục vụ rất tốt, món ăn ngon",
    "Đồ ăn tươi ngon, giá cả hợp lý",
    "Giao hàng đúng giờ, shipper rất thân thiện",
    "Sẽ tiếp tục ủng hộ quán trong tương lai"
  ];

  const newOrders = db.orders.find({ 
    createdAt: { 
      $gte: new Date('2025-01-01'), 
      $lte: new Date('2025-06-30') 
    },
    "status.current": "delivered"
  }).toArray();

  for (const order of newOrders) {
    try {
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
        restaurantReply: Math.random() < 0.3 ? "Cảm ơn quý khách đã ủng hộ nhà hàng. Hẹn gặp lại quý khách!" : null,
        likes: Math.floor(Math.random() * 50),
        isActive: true,
        createdAt: new Date(order.timing.deliveredAt.getTime() + Math.random() * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      };

      db.reviews.insertOne(review);
      print(`Đã tạo review cho order ${order.orderNumber}`);
    } catch (error) {
      print(`Lỗi khi tạo review cho order ${order.orderNumber}: ${error.message}`);
      continue;
    }
  }

  print(`Hoàn thành tạo reviews cho các đơn hàng đã giao thành công`);
} 