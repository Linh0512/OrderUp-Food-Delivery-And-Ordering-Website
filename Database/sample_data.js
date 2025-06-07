// ====================================
// SCRIPT KHỞI TẠO SAMPLE DATA CHO FOOD DELIVERY APP
// ====================================

// Kết nối database
use('food_delivery_app');

print("🚀 Bắt đầu khởi tạo sample data cho Food Delivery App...");

// ====================================
// HELPER FUNCTIONS
// ====================================

// Tạo random date trong khoảng thời gian
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// ====================================
// 1. APP_SETTINGS - Cài đặt ứng dụng
// ====================================
print("📝 Tạo app settings...");

const adminSettingResult = db.app_settings.insertOne({
  category: "general",
  settings: {
    general: {
      appName: "FoodieExpress",
      appVersion: "1.0.0",
      maintenanceMode: false,
      maintenanceMessage: "",
      supportEmail: "support@foodieexpress.com",
      supportPhone: "1900-123-456",
      privacyPolicyUrl: "https://foodieexpress.com/privacy",
      termsOfServiceUrl: "https://foodieexpress.com/terms"
    }
  },
  updatedAt: new Date(),
  createdAt: new Date()
});
const adminSettingId = adminSettingResult.insertedId;

db.app_settings.insertOne({
  category: "payment",
  settings: {
    payment: {
      enabledMethods: ["cash", "card", "ewallet"],
      defaultCurrency: "VND",
      serviceFeePercentage: 5,
      minimumOrderAmount: 50000,
      cashOnDeliveryFee: 5000
    }
  },
  updatedAt: new Date(),
  createdAt: new Date()
});

// ====================================
// 2. USERS - Người dùng
// ====================================
print("📝 Tạo users...");

// Admin user
const adminUserResult = db.users.insertOne({
  email: "admin@foodieexpress.com",
  password: "$2b$10$hashedPasswordAdmin123",
  role: "admin",
  profile: {
    firstName: "Admin",
    lastName: "System",
    phone: "0901234567",
    avatar: "https://example.com/avatars/admin.jpg",
    dateOfBirth: new Date("1990-01-01"),
    gender: "other"
  },
  preferences: {
    language: "vi",
    notifications: {
      email: true,
      push: true,
      sms: true,
      orderUpdates: true,
      promotions: true
    }
  },
  isActive: true,
  isVerified: true,
  lastLogin: new Date(),
  createdAt: new Date(),
  updatedAt: new Date()
});
const adminUserId = adminUserResult.insertedId;

// Restaurant Host
const hostUserResult = db.users.insertOne({
  email: "host1@pizzahouse.com",
  password: "$2b$10$hashedPasswordHost123",
  role: "restaurantHost",
  profile: {
    firstName: "Nguyễn",
    lastName: "Văn A",
    phone: "0987654321",
    avatar: "https://example.com/avatars/host1.jpg",
    dateOfBirth: new Date("1985-05-15"),
    gender: "male"
  },
  preferences: {
    language: "vi",
    notifications: {
      email: true,
      push: true,
      sms: false,
      orderUpdates: true,
      promotions: false
    }
  },
  isActive: true,
  isVerified: true,
  lastLogin: new Date(),
  createdAt: new Date("2024-01-15"),
  updatedAt: new Date()
});
const hostUserId = hostUserResult.insertedId;

// Regular User 1
const customerResult = db.users.insertOne({
  email: "john.doe@gmail.com",
  password: "$2b$10$hashedPasswordUser123",
  role: "user",
  profile: {
    firstName: "John",
    lastName: "Doe",
    phone: "0912345678",
    avatar: "https://example.com/avatars/john.jpg",
    dateOfBirth: new Date("1995-03-20"),
    gender: "male"
  },
  addresses: [{
    title: "Nhà riêng",
    fullAddress: "123 Nguyễn Văn Cừ, Phường 4, Quận 5, TP.HCM",
    district: "Quận 5",
    city: "TP.HCM",
    isDefault: true,
    coordinates: {
      lat: 10.7589,
      lng: 106.6750
    }
  }],
  paymentMethods: [{
    type: "ewallet",
    ewalletType: "momo",
    ewalletAccount: "0912345678",
    isDefault: true
  }],
  preferences: {
    language: "vi",
    notifications: {
      email: true,
      push: true,
      sms: false,
      orderUpdates: true,
      promotions: true
    }
  },
  loyaltyPoints: 150,
  isActive: true,
  isVerified: true,
  lastLogin: new Date(),
  createdAt: new Date("2024-02-01"),
  updatedAt: new Date()
});
const customerId = customerResult.insertedId;

// Regular User 2
const customer2Result = db.users.insertOne({
  email: "jane.smith@gmail.com",
  password: "$2b$10$hashedPasswordUser456",
  role: "user",
  profile: {
    firstName: "Jane",
    lastName: "Smith",
    phone: "0923456789",
    avatar: "https://example.com/avatars/jane.jpg",
    dateOfBirth: new Date("1992-07-10"),
    gender: "female"
  },
  addresses: [{
    title: "Văn phòng",
    fullAddress: "456 Lê Văn Sỹ, Phường 12, Quận 3, TP.HCM",
    district: "Quận 3",
    city: "TP.HCM",
    isDefault: true,
    coordinates: {
      lat: 10.7829,
      lng: 106.6934
    }
  }],
  loyaltyPoints: 75,
  isActive: true,
  isVerified: true,
  createdAt: new Date("2024-02-15"),
  updatedAt: new Date()
});
const customer2Id = customer2Result.insertedId;

// ====================================
// 3. CATEGORIES - Danh mục món ăn
// ====================================
print("📝 Tạo categories...");

// Main category 1: Fast Food
const fastFoodResult = db.categories.insertOne({
  name: "Fast Food",
  description: "Đồ ăn nhanh",
  image: "https://example.com/categories/fastfood.jpg",
  icon: "🍔",
  level: 1,
  sortOrder: 1,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});
const fastFoodId = fastFoodResult.insertedId;

// Main category 2: Món Việt
const vietnameseFoodResult = db.categories.insertOne({
  name: "Món Việt",
  description: "Các món ăn truyền thống Việt Nam",
  image: "https://example.com/categories/vietnamese.jpg",
  icon: "🍜",
  level: 1,
  sortOrder: 2,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});
const vietnameseFoodId = vietnameseFoodResult.insertedId;

// Main category 3: Đồ uống
const drinksResult = db.categories.insertOne({
  name: "Đồ uống",
  description: "Nước uống, trà sữa, cà phê",
  image: "https://example.com/categories/drinks.jpg",
  icon: "🥤",
  level: 1,
  sortOrder: 3,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});
const drinksId = drinksResult.insertedId;

// Subcategory 1: Pizza (thuộc Fast Food)
const pizzaCategoryResult = db.categories.insertOne({
  name: "Pizza",
  description: "Bánh pizza các loại",
  parentId: fastFoodId,
  level: 2,
  sortOrder: 1,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});
const pizzaCategoryId = pizzaCategoryResult.insertedId;

// Subcategory 2: Burger (thuộc Fast Food)
const burgerCategoryResult = db.categories.insertOne({
  name: "Burger",
  description: "Hamburger và cheeseburger",
  parentId: fastFoodId,
  level: 2,
  sortOrder: 2,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});
const burgerCategoryId = burgerCategoryResult.insertedId;

// ====================================
// 4. RESTAURANTS - Nhà hàng
// ====================================
print("📝 Tạo restaurants...");

const restaurantResult = db.restaurants.insertOne({
  hostId: hostUserId,
  basicInfo: {
    name: "Pizza House Saigon",
    description: "Nhà hàng pizza số 1 TP.HCM với công thức Italy chính thống",
    phone: "028-3456-7890",
    email: "info@pizzahouse.com",
    website: "https://pizzahouse.com",
    images: [
      "https://example.com/restaurants/pizza-house-1.jpg",
      "https://example.com/restaurants/pizza-house-2.jpg"
    ],
    logo: "https://example.com/restaurants/pizza-house-logo.jpg",
    coverImage: "https://example.com/restaurants/pizza-house-cover.jpg"
  },
  address: {
    fullAddress: "789 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM",
    district: "Quận 1",
    city: "TP.HCM",
    coordinates: {
      lat: 10.7745,
      lng: 106.7058
    }
  },
  businessInfo: {
    businessLicense: "0123456789",
    taxCode: "0987654321",
    businessType: "restaurant",
    cuisineTypes: ["italian", "pizza", "western"]
  },
  operatingHours: [
    { dayOfWeek: 1, isOpen: true, openTime: "10:00", closeTime: "22:00" },
    { dayOfWeek: 2, isOpen: true, openTime: "10:00", closeTime: "22:00" },
    { dayOfWeek: 3, isOpen: true, openTime: "10:00", closeTime: "22:00" },
    { dayOfWeek: 4, isOpen: true, openTime: "10:00", closeTime: "22:00" },
    { dayOfWeek: 5, isOpen: true, openTime: "10:00", closeTime: "23:00" },
    { dayOfWeek: 6, isOpen: true, openTime: "09:00", closeTime: "23:00" },
    { dayOfWeek: 0, isOpen: true, openTime: "09:00", closeTime: "22:00" }
  ],
  delivery: {
    isDeliveryAvailable: true,
    deliveryRadius: 10,
    deliveryFee: 15000,
    freeDeliveryThreshold: 200000,
    estimatedDeliveryTime: 30,
    deliveryAreas: ["Quận 1", "Quận 3", "Quận 5", "Quận 10"]
  },
  ratings: {
    averageRating: 4.5,
    totalReviews: 127,
    ratingBreakdown: {
      "5star": 65,
      "4star": 45,
      "3star": 12,
      "2star": 3,
      "1star": 2
    }
  },
  tags: ["pizza", "italian", "fast_delivery", "popular"],
  isActive: true,
  isVerified: true,
  isFeatured: true,
  verificationStatus: "approved",
  bankInfo: {
    bankName: "Vietcombank",
    accountNumber: "1234567890",
    accountHolder: "PIZZA HOUSE SAIGON"
  },
  createdAt: new Date("2024-01-15"),
  updatedAt: new Date()
});
const restaurantId = restaurantResult.insertedId;

// ====================================
// 5. DISHES - Món ăn
// ====================================
print("📝 Tạo dishes...");

// Dish 1: Pizza Margherita
const dish1Result = db.dishes.insertOne({
  restaurantId: restaurantId,
  categoryId: pizzaCategoryId,
  basicInfo: {
    name: "Pizza Margherita",
    description: "Pizza cổ điển với sốt cà chua, phô mai mozzarella và lá húng quế tươi",
    images: [
      "https://example.com/dishes/margherita-1.jpg",
      "https://example.com/dishes/margherita-2.jpg"
    ],
    tags: ["vegetarian", "bestseller", "classic"]
  },
  pricing: {
    basePrice: 180000,
    discountPrice: 150000,
    isDiscounted: true
  },
  nutritionInfo: {
    calories: 280,
    protein: 12,
    carbs: 36,
    fat: 10,
    ingredients: ["Bột mì", "Sốt cà chua", "Phô mai Mozzarella", "Lá húng quế", "Dầu olive"],
    allergens: ["Gluten", "Dairy"]
  },
  options: [
    {
      name: "Kích thước",
      type: "single",
      isRequired: true,
      choices: [
        { name: "Nhỏ (20cm)", price: 0, isDefault: true },
        { name: "Vừa (25cm)", price: 30000, isDefault: false },
        { name: "Lớn (30cm)", price: 60000, isDefault: false }
      ]
    },
    {
      name: "Loại đế",
      type: "single",
      isRequired: false,
      choices: [
        { name: "Đế mỏng", price: 0, isDefault: true },
        { name: "Đế dày", price: 15000, isDefault: false }
      ]
    }
  ],
  availability: {
    isAvailable: true,
    availableTimes: [
      { start: "10:00", end: "22:00" }
    ],
    stockQuantity: null,
    soldOut: false
  },
  ratings: {
    averageRating: 4.7,
    totalReviews: 89
  },
  stats: {
    totalOrders: 234,
    viewCount: 1520
  },
  isActive: true,
  isFeatured: true,
  preparationTime: 15,
  createdAt: new Date("2024-01-20"),
  updatedAt: new Date()
});
const dish1Id = dish1Result.insertedId;

// Dish 2: Pizza Pepperoni
const dish2Result = db.dishes.insertOne({
  restaurantId: restaurantId,
  categoryId: pizzaCategoryId,
  basicInfo: {
    name: "Pizza Pepperoni",
    description: "Pizza với pepperoni, phô mai mozzarella và sốt cà chua đặc biệt",
    images: [
      "https://example.com/dishes/pepperoni-1.jpg"
    ],
    tags: ["popular", "meat"]
  },
  pricing: {
    basePrice: 220000,
    isDiscounted: false
  },
  options: [
    {
      name: "Kích thước",
      type: "single",
      isRequired: true,
      choices: [
        { name: "Nhỏ (20cm)", price: 0, isDefault: true },
        { name: "Vừa (25cm)", price: 30000, isDefault: false },
        { name: "Lớn (30cm)", price: 60000, isDefault: false }
      ]
    }
  ],
  availability: {
    isAvailable: true,
    stockQuantity: null,
    soldOut: false
  },
  ratings: {
    averageRating: 4.3,
    totalReviews: 56
  },
  stats: {
    totalOrders: 156,
    viewCount: 890
  },
  isActive: true,
  isFeatured: false,
  preparationTime: 18,
  createdAt: new Date("2024-01-22"),
  updatedAt: new Date()
});
const dish2Id = dish2Result.insertedId;

// ====================================
// 6. DRIVERS - Tài xế
// ====================================
print("📝 Tạo drivers...");

const driverResult = db.drivers.insertOne({
  personalInfo: {
    firstName: "Trần",
    lastName: "Văn B",
    phone: "0934567890",
    email: "driver1@foodieexpress.com",
    nationalId: "123456789",
    dateOfBirth: new Date("1988-12-05"),
    avatar: "https://example.com/avatars/driver1.jpg"
  },
  workInfo: {
    driverLicense: "B2-123456",
    vehicleType: "motorbike",
    vehicleNumber: "59-X1 12345",
    vehicleModel: "Honda Wave Alpha",
    insuranceNumber: "INS-123456",
    workingAreas: ["Quận 1", "Quận 3", "Quận 5"],
    shiftSchedule: [
      { dayOfWeek: 1, startTime: "08:00", endTime: "17:00" },
      { dayOfWeek: 2, startTime: "08:00", endTime: "17:00" },
      { dayOfWeek: 3, startTime: "08:00", endTime: "17:00" },
      { dayOfWeek: 4, startTime: "08:00", endTime: "17:00" },
      { dayOfWeek: 5, startTime: "08:00", endTime: "17:00" },
      { dayOfWeek: 6, startTime: "09:00", endTime: "18:00" }
    ]
  },
  status: {
    isOnline: true,
    isAvailable: true,
    currentLocation: {
      lat: 10.7758,
      lng: 106.7014,
      lastUpdated: new Date()
    },
    isVerified: true,
    verificationStatus: "approved"
  },
  stats: {
    totalDeliveries: 450,
    successfulDeliveries: 425,
    cancelledDeliveries: 25,
    averageRating: 4.6,
    totalEarnings: 12500000,
    totalDistance: 2340
  },
  ratings: {
    averageRating: 4.6,
    totalReviews: 312,
    ratingBreakdown: {
      "5star": 198,
      "4star": 89,
      "3star": 20,
      "2star": 3,
      "1star": 2
    }
  },
  bankInfo: {
    bankName: "Techcombank",
    accountNumber: "9876543210",
    accountHolder: "TRAN VAN B"
  },
  isActive: true,
  createdAt: new Date("2024-01-10"),
  updatedAt: new Date()
});
const driverId = driverResult.insertedId;

// ====================================
// 7. PROMOTIONS - Khuyến mãi (Tạo trước orders để dùng trong order)
// ====================================
print("📝 Tạo promotions...");

const promoResult = db.promotions.insertOne({
  code: "WELCOME20",
  name: "Chào mừng thành viên mới",
  description: "Giảm 20,000đ cho đơn hàng đầu tiên",
  type: "fixed_amount",
  value: 20000,
  conditions: {
    minimumOrderAmount: 100000,
    maximumDiscountAmount: 20000,
    applicableRestaurants: [],
    newCustomersOnly: true,
    firstOrderOnly: true
  },
  usage: {
    totalUsageLimit: 1000,
    perUserLimit: 1,
    currentUsage: 123,
    usedBy: [customerId]
  },
  schedule: {
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-12-31"),
    applicableDays: [],
    applicableHours: []
  },
  targeting: {
    userSegments: ["new"],
    cities: ["TP.HCM"],
    districts: []
  },
  status: "active",
  createdBy: adminUserId,
  isActive: true,
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date()
});
const promoId = promoResult.insertedId;

// ====================================
// 8. VOUCHERS - Voucher cá nhân
// ====================================
print("📝 Tạo vouchers...");

const voucherResult = db.vouchers.insertOne({
  userId: customerId,
  promotionId: promoId,
  code: "WELCOME20-USER001",
  type: "discount",
  value: 20000,
  originalValue: 20000,
  conditions: {
    minimumOrderAmount: 100000,
    maximumDiscountAmount: 20000,
    applicableRestaurants: [],
    applicableCategories: []
  },
  validity: {
    issuedAt: new Date("2024-02-01"),
    expiresAt: new Date("2024-12-31"),
    isActive: true
  },
  source: "promotion",
  metadata: {
    campaignId: "WELCOME_2024",
    issueReason: "Thành viên mới"
  },
  createdAt: new Date("2024-02-01"),
  updatedAt: new Date()
});
const voucherId = voucherResult.insertedId;

// ====================================
// 9. ORDERS - Đơn hàng
// ====================================
print("📝 Tạo orders...");

const orderResult = db.orders.insertOne({
  orderNumber: "FE240301001",
  customerId: customerId,
  restaurantId: restaurantId,
  orderDetails: {
    items: [
      {
        dishId: dish1Id,
        dishName: "Pizza Margherita",
        dishImage: "https://example.com/dishes/margherita-1.jpg",
        quantity: 1,
        unitPrice: 150000,
        selectedOptions: [
          { optionName: "Kích thước", choiceName: "Vừa (25cm)", additionalPrice: 30000 },
          { optionName: "Loại đế", choiceName: "Đế dày", additionalPrice: 15000 }
        ],
        subtotal: 195000,
        specialInstructions: "Ít phô mai"
      }
    ],
    subtotal: 195000,
    deliveryFee: 15000,
    serviceFee: 9750,
    tax: 0,
    discount: 20000,
    totalAmount: 199750
  },
  deliveryInfo: {
    address: {
      fullAddress: "123 Nguyễn Văn Cừ, Phường 4, Quận 5, TP.HCM",
      district: "Quận 5",
      city: "TP.HCM",
      coordinates: {
        lat: 10.7589,
        lng: 106.6750
      }
    },
    customerName: "John Doe",
    customerPhone: "0912345678",
    deliveryInstructions: "Gọi khi đến tầng trệt",
    deliveryType: "delivery",
    estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000),
    actualDeliveryTime: new Date(Date.now() + 28 * 60 * 1000)
  },
  payment: {
    method: "ewallet",
    status: "paid",
    transactionId: "TXN123456789",
    paidAt: new Date()
  },
  promocode: {
    code: "WELCOME20",
    discountAmount: 20000,
    discountType: "fixed"
  },
  status: {
    current: "delivered",
    history: [
      { status: "pending", timestamp: new Date(Date.now() - 45 * 60 * 1000), note: "Đơn hàng được tạo" },
      { status: "confirmed", timestamp: new Date(Date.now() - 40 * 60 * 1000), note: "Nhà hàng xác nhận" },
      { status: "preparing", timestamp: new Date(Date.now() - 35 * 60 * 1000), note: "Đang chuẩn bị" },
      { status: "ready", timestamp: new Date(Date.now() - 20 * 60 * 1000), note: "Sẵn sàng giao" },
      { status: "delivering", timestamp: new Date(Date.now() - 15 * 60 * 1000), note: "Đang giao hàng" },
      { status: "delivered", timestamp: new Date(Date.now() - 2 * 60 * 1000), note: "Đã giao thành công" }
    ]
  },
  timing: {
    placedAt: new Date(Date.now() - 45 * 60 * 1000),
    confirmedAt: new Date(Date.now() - 40 * 60 * 1000),
    preparingAt: new Date(Date.now() - 35 * 60 * 1000),
    readyAt: new Date(Date.now() - 20 * 60 * 1000),
    pickedUpAt: new Date(Date.now() - 15 * 60 * 1000),
    deliveredAt: new Date(Date.now() - 2 * 60 * 1000)
  },
  assignedDriver: driverId,
  createdAt: new Date(Date.now() - 45 * 60 * 1000),
  updatedAt: new Date()
});
const orderId = orderResult.insertedId;

// Cập nhật voucher với orderId
db.vouchers.updateOne(
  { _id: voucherId },
  {
    $set: {
      "usage": {
        isUsed: true,
        usedAt: new Date(Date.now() - 45 * 60 * 1000),
        orderId: orderId,
        remainingValue: 0
      }
    }
  }
);

// ====================================
// 10. REVIEWS - Đánh giá
// ====================================
print("📝 Tạo reviews...");

const reviewResult = db.reviews.insertOne({
  orderId: orderId,
  customerId: customerId,
  restaurantId: restaurantId,
  dishReviews: [
    {
      dishId: dish1Id,
      rating: 5,
      comment: "Pizza rất ngon, đế bánh giòn tan, phô mai thơm",
      images: ["https://example.com/reviews/pizza-review-1.jpg"]
    }
  ],
  restaurantReview: {
    rating: 5,
    comment: "Nhà hàng tuyệt vời! Đồ ăn ngon, giao hàng nhanh",
    categories: {
      food: 5,
      service: 4,
      delivery: 5,
      packaging: 5
    }
  },
  deliveryReview: {
    rating: 5,
    comment: "Tài xế giao hàng rất nhiệt tình và đúng giờ"
  },
  images: ["https://example.com/reviews/overall-1.jpg"],
  isVerified: true,
  likes: 12,
  isHelpful: [customer2Id],
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});
const reviewId = reviewResult.insertedId;

// ====================================
// 11. NOTIFICATIONS - Thông báo
// ====================================
print("📝 Tạo notifications...");

const notificationResult = db.notifications.insertOne({
  recipientId: customerId,
  recipientType: "user",
  type: "order_status",
  title: "Đơn hàng đã được giao thành công",
  message: "Đơn hàng #FE240301001 đã được giao đến địa chỉ của bạn. Cảm ơn bạn đã sử dụng dịch vụ!",
  data: {
    orderId: orderId,
    deepLink: "/orders/FE240301001",
    actionType: "rate_order"
  },
  delivery: {
    channels: ["push", "in_app"],
    sentAt: new Date(Date.now() - 2 * 60 * 1000),
    deliveryStatus: {
      push: "delivered",
      email: null,
      sms: null
    }
  },
  interaction: {
    isRead: true,
    readAt: new Date(Date.now() - 1 * 60 * 1000),
    isClicked: false
  },
  priority: "normal",
  isActive: true,
  createdAt: new Date(Date.now() - 2 * 60 * 1000),
  updatedAt: new Date()
});
const notificationId = notificationResult.insertedId;

// ====================================
// 12. BLOGS - Blog và tin tức
// ====================================
print("📝 Tạo blogs...");

const blogResult = db.blogs.insertOne({
  title: "Top 10 món pizza phải thử tại TP.HCM",
  slug: "top-10-mon-pizza-phai-thu-tai-tp-hcm",
  excerpt: "Khám phá những món pizza ngon nhất tại Thành phố Hồ Chí Minh",
  content: "<h1>Top 10 món pizza phải thử tại TP.HCM</h1><p>Pizza đã trở thành một món ăn quen thuộc...</p>",
  featuredImage: "https://example.com/blogs/pizza-blog-featured.jpg",
  images: ["https://example.com/blogs/pizza-1.jpg", "https://example.com/blogs/pizza-2.jpg"],
  author: {
    id: adminUserId,
    name: "Admin System",
    avatar: "https://example.com/avatars/admin.jpg"
  },
  category: "food_tips",
  tags: ["pizza", "food", "saigon", "review"],
  status: "published",
  visibility: "public",
  seo: {
    metaTitle: "Top 10 món pizza ngon nhất TP.HCM - FoodieExpress",
    metaDescription: "Tìm hiểu những món pizza ngon nhất tại TP.HCM qua bài viết của FoodieExpress",
    keywords: ["pizza", "TP.HCM", "food", "review"]
  },
  engagement: {
    viewCount: 1520,
    likeCount: 89,
    shareCount: 23,
    commentCount: 15
  },
  schedule: {
    publishAt: new Date("2024-02-15"),
    unpublishAt: null
  },
  isActive: true,
  isFeatured: true,
  publishedAt: new Date("2024-02-15"),
  createdAt: new Date("2024-02-14"),
  updatedAt: new Date()
});
const blogId = blogResult.insertedId;

// ====================================
// 13. ANALYTICS - Dữ liệu phân tích
// ====================================
print("📝 Tạo analytics...");

const analyticsResult = db.analytics.insertOne({
  type: "daily",
  date: new Date("2024-03-01"),
  metrics: {
    orders: {
      total: 156,
      completed: 142,
      cancelled: 14,
      revenue: 3450000,
      averageOrderValue: 221154
    },
    users: {
      totalUsers: 2340,
      newUsers: 23,
      activeUsers: 456,
      retentionRate: 0.75
    },
    restaurants: {
      totalRestaurants: 45,
      activeRestaurants: 42,
      newRestaurants: 2,
      averageRating: 4.3
    },
    dishes: {
      totalDishes: 567,
      topSellingDishes: [
        {
          dishId: dish1Id, // Sử dụng ID thực tế của Pizza Margherita đã tạo trước đó
          name: "Pizza Margherita",
          orderCount: 34,
          revenue: 510000
        }
      ]
    },
    deliveries: {
      totalDeliveries: 142,
      averageDeliveryTime: 28,
      onTimeDeliveryRate: 0.89
    }
  },
  breakdown: {
    byCity: [{ city: "TP.HCM", orders: 156, revenue: 3450000 }],
    byCategory: [
      { 
        category: "Pizza", 
        categoryId: pizzaCategoryId, // Thêm tham chiếu đến ID category
        orders: 67, 
        revenue: 1450000 
      }
    ],
    byHour: [],
    byPaymentMethod: [
      { method: "ewallet", orders: 89, revenue: 1950000 },
      { method: "cash", orders: 67, revenue: 1500000 }
    ],
    byRestaurant: [
      {
        restaurantId: restaurantId, // Thêm tham chiếu đến ID nhà hàng
        restaurantName: "Pizza House Saigon",
        orders: 35,
        revenue: 870000
      }
    ]
  },
  createdAt: new Date("2024-03-02")
});
const analyticsId = analyticsResult.insertedId;

// ====================================
// Kết thúc khởi tạo sample data
print("✅ Tất cả sample data đã được tạo thành công!");
print("📊 Thống kê data đã tạo:");
print(`   - Users: ${db.users.countDocuments()}`);
print(`   - Restaurants: ${db.restaurants.countDocuments()}`);
print(`   - Categories: ${db.categories.countDocuments()}`);
print(`   - Dishes: ${db.dishes.countDocuments()}`);
print(`   - Orders: ${db.orders.countDocuments()}`);
print(`   - Reviews: ${db.reviews.countDocuments()}`);
print(`   - Promotions: ${db.promotions.countDocuments()}`);
print(`   - Vouchers: ${db.vouchers.countDocuments()}`);
print(`   - Drivers: ${db.drivers.countDocuments()}`);
print(`   - Notifications: ${db.notifications.countDocuments()}`);
print(`   - Blogs: ${db.blogs.countDocuments()}`);
print(`   - Analytics: ${db.analytics.countDocuments()}`);
print(`   - App Settings: ${db.app_settings.countDocuments()}`);

print("\n🎉 Database đã sẵn sàng để sử dụng!");
print("💡 Tip: Sử dụng MongoDB Compass để xem dữ liệu một cách trực quan");
print("💡 Tip: Chạy script create_indexes.js để tạo indexes cho performance tối ưu"); 