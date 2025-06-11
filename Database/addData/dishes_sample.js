use('food_delivery_app');

// ====================================
// CATEGORIES - Danh mục món ăn
// ====================================
print("📝 Tạo categories...");

const vietnameseCategory = db.categories.insertOne({
  name: "Món Việt",
  description: "Các món ăn truyền thống Việt Nam",
  icon: "🇻🇳",
  isActive: true,
  sortOrder: 1,
  createdAt: new Date(),
  updatedAt: new Date()
});
const vietnameseCategoryId = vietnameseCategory.insertedId;

const pizzaCategory = db.categories.insertOne({
  name: "Pizza",
  description: "Pizza và món Ý",
  icon: "🍕",
  isActive: true,
  sortOrder: 2,
  createdAt: new Date(),
  updatedAt: new Date()
});
const pizzaCategoryId = pizzaCategory.insertedId;

const westernCategory = db.categories.insertOne({
  name: "Món Âu",
  description: "Các món ăn phương Tây",
  icon: "🥩",
  isActive: true,
  sortOrder: 3,
  createdAt: new Date(),
  updatedAt: new Date()
});
const westernCategoryId = westernCategory.insertedId;

const asianCategory = db.categories.insertOne({
  name: "Món Á",
  description: "Các món ăn châu Á",
  icon: "🍜",
  isActive: true,
  sortOrder: 4,
  createdAt: new Date(),
  updatedAt: new Date()
});
const asianCategoryId = asianCategory.insertedId;

const beverageCategory = db.categories.insertOne({
  name: "Đồ Uống",
  description: "Nước uống và thức uống",
  icon: "🥤",
  isActive: true,
  sortOrder: 5,
  createdAt: new Date(),
  updatedAt: new Date()
});
const beverageCategoryId = beverageCategory.insertedId;

const dessertCategory = db.categories.insertOne({
  name: "Tráng Miệng",
  description: "Món tráng miệng và bánh ngọt",
  icon: "🍰",
  isActive: true,
  sortOrder: 6,
  createdAt: new Date(),
  updatedAt: new Date()
});
const dessertCategoryId = dessertCategory.insertedId;

// ====================================
// DISHES - Món ăn cho từng nhà hàng
// ====================================
print("📝 Tạo dishes...");

// Lấy ID của các nhà hàng
const restaurants = db.restaurants.find({}).toArray();
const restaurantMap = {};

restaurants.forEach(restaurant => {
  const name = restaurant.basicInfo.name;
  restaurantMap[name] = restaurant._id;
});

// ====== 1. Phở Bắc Hương Quê ======
if (restaurantMap["Phở Bắc Hương Quê"]) {
  db.dishes.insertMany([
    {
      restaurantId: restaurantMap["Phở Bắc Hương Quê"],
      categoryId: vietnameseCategoryId,
      basicInfo: {
        name: "Phở Bò Tái",
        description: "Phở bò tái với nước dùng trong vắt, thơm ngon",
        images: ["https://example.com/dishes/pho-bo-tai.jpg"],
        tags: ["bestseller", "traditional"]
      },
      pricing: { basePrice: 45000, isDiscounted: false },
      options: [{
        name: "Kích thước",
        type: "single",
        isRequired: true,
        choices: [
          { name: "Nhỏ", price: 0, isDefault: true },
          { name: "Lớn", price: 10000, isDefault: false }
        ]
      }],
      availability: { isAvailable: true, soldOut: false },
      ratings: { averageRating: 4.5, totalReviews: 120 },
      stats: { totalOrders: 234, viewCount: 1520 },
      isActive: true,
      isFeatured: true,
      preparationTime: 10,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      restaurantId: restaurantMap["Phở Bắc Hương Quê"],
      categoryId: vietnameseCategoryId,
      basicInfo: {
        name: "Phở Bò Chín",
        description: "Phở bò chín với thịt bò nấu chín mềm",
        images: ["https://example.com/dishes/pho-bo-chin.jpg"],
        tags: ["traditional", "comfort"]
      },
      pricing: { basePrice: 50000, isDiscounted: false },
      availability: { isAvailable: true, soldOut: false },
      ratings: { averageRating: 4.3, totalReviews: 85 },
      stats: { totalOrders: 189, viewCount: 980 },
      isActive: true,
      preparationTime: 10,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      restaurantId: restaurantMap["Phở Bắc Hương Quê"],
      categoryId: vietnameseCategoryId,
      basicInfo: {
        name: "Phở Gà",
        description: "Phở gà với nước dùng ngọt thanh",
        images: ["https://example.com/dishes/pho-ga.jpg"],
        tags: ["light", "healthy"]
      },
      pricing: { basePrice: 40000, isDiscounted: false },
      availability: { isAvailable: true, soldOut: false },
      ratings: { averageRating: 4.2, totalReviews: 65 },
      stats: { totalOrders: 134, viewCount: 750 },
      isActive: true,
      preparationTime: 10,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
}

// ====== 2. Steak House ======
if (restaurantMap["Steak House"]) {
  db.dishes.insertMany([
    {
      restaurantId: restaurantMap["Steak House"],
      categoryId: westernCategoryId,
      basicInfo: {
        name: "Ribeye Steak",
        description: "Ribeye steak cao cấp nướng chín vừa với khoai tây nghiền",
        images: ["https://example.com/dishes/ribeye-steak.jpg"],
        tags: ["premium", "bestseller"]
      },
      pricing: { basePrice: 450000, isDiscounted: false },
      options: [{
        name: "Độ chín",
        type: "single",
        isRequired: true,
        choices: [
          { name: "Rare", price: 0, isDefault: false },
          { name: "Medium Rare", price: 0, isDefault: true },
          { name: "Medium", price: 0, isDefault: false },
          { name: "Well Done", price: 0, isDefault: false }
        ]
      }],
      availability: { isAvailable: true, soldOut: false },
      ratings: { averageRating: 4.8, totalReviews: 95 },
      stats: { totalOrders: 145, viewCount: 890 },
      isActive: true,
      isFeatured: true,
      preparationTime: 25,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      restaurantId: restaurantMap["Steak House"],
      categoryId: westernCategoryId,
      basicInfo: {
        name: "Beef Tenderloin",
        description: "Thăn ngoại bò mềm với sốt mushroom",
        images: ["https://example.com/dishes/beef-tenderloin.jpg"],
        tags: ["premium", "tender"]
      },
      pricing: { basePrice: 520000, isDiscounted: false },
      availability: { isAvailable: true, soldOut: false },
      ratings: { averageRating: 4.9, totalReviews: 78 },
      stats: { totalOrders: 98, viewCount: 567 },
      isActive: true,
      preparationTime: 30,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
}

// ====== 19. Pizza House Saigon ======
if (restaurantMap["Pizza House Saigon"]) {
  db.dishes.insertMany([
    {
      restaurantId: restaurantMap["Pizza House Saigon"],
      categoryId: pizzaCategoryId,
      basicInfo: {
        name: "Pizza Margherita",
        description: "Pizza cổ điển với sốt cà chua, phô mai mozzarella và lá húng quế tươi",
        images: ["https://example.com/dishes/margherita.jpg"],
        tags: ["vegetarian", "bestseller", "classic"]
      },
      pricing: {
        basePrice: 180000,
        discountPrice: 150000,
        isDiscounted: true
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
      availability: { isAvailable: true, soldOut: false },
      ratings: { averageRating: 4.7, totalReviews: 89 },
      stats: { totalOrders: 234, viewCount: 1520 },
      isActive: true,
      isFeatured: true,
      preparationTime: 15,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      restaurantId: restaurantMap["Pizza House Saigon"],
      categoryId: pizzaCategoryId,
      basicInfo: {
        name: "Pizza Pepperoni",
        description: "Pizza với pepperoni, phô mai mozzarella và sốt cà chua đặc biệt",
        images: ["https://example.com/dishes/pepperoni.jpg"],
        tags: ["popular", "meat"]
      },
      pricing: { basePrice: 220000, isDiscounted: false },
      options: [{
        name: "Kích thước",
        type: "single",
        isRequired: true,
        choices: [
          { name: "Nhỏ (20cm)", price: 0, isDefault: true },
          { name: "Vừa (25cm)", price: 30000, isDefault: false },
          { name: "Lớn (30cm)", price: 60000, isDefault: false }
        ]
      }],
      availability: { isAvailable: true, soldOut: false },
      ratings: { averageRating: 4.5, totalReviews: 76 },
      stats: { totalOrders: 189, viewCount: 987 },
      isActive: true,
      preparationTime: 18,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
}

// ====== 20. Phở Sài Gòn ======
if (restaurantMap["Phở Sài Gòn"]) {
  db.dishes.insertMany([
    {
      restaurantId: restaurantMap["Phở Sài Gòn"],
      categoryId: vietnameseCategoryId,
      basicInfo: {
        name: "Phở Bò Đặc Biệt",
        description: "Phở bò đặc biệt với đầy đủ loại thịt",
        images: ["https://example.com/dishes/pho-dac-biet.jpg"],
        tags: ["signature", "complete"]
      },
      pricing: { basePrice: 55000, isDiscounted: false },
      options: [{
        name: "Kích thước",
        type: "single",
        isRequired: true,
        choices: [
          { name: "Nhỏ", price: 0, isDefault: true },
          { name: "Lớn", price: 15000, isDefault: false }
        ]
      }],
      availability: { isAvailable: true, soldOut: false },
      ratings: { averageRating: 4.4, totalReviews: 78 },
      stats: { totalOrders: 156, viewCount: 789 },
      isActive: true,
      isFeatured: true,
      preparationTime: 12,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      restaurantId: restaurantMap["Phở Sài Gòn"],
      categoryId: vietnameseCategoryId,
      basicInfo: {
        name: "Phở Tái Nạm",
        description: "Phở với thịt tái và nạm",
        images: ["https://example.com/dishes/pho-tai-nam.jpg"],
        tags: ["traditional", "popular"]
      },
      pricing: { basePrice: 50000, isDiscounted: false },
      availability: { isAvailable: true, soldOut: false },
      ratings: { averageRating: 4.2, totalReviews: 65 },
      stats: { totalOrders: 134, viewCount: 567 },
      isActive: true,
      preparationTime: 10,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
}

print("✅ Đã tạo xong categories và dishes mẫu!");
print("📊 Tổng kết:");
print("- Categories: 6 danh mục");
print("- Dishes: Món ăn cho 4 nhà hàng mẫu");
print("💡 Chạy file này sau khi đã chạy addSampleData.js"); 