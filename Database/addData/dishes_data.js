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

// Lấy ID của các nhà hàng (giả sử đã chạy addSampleData.js trước)
const restaurants = db.restaurants.find({}).toArray();
const restaurantIds = {};

restaurants.forEach(restaurant => {
  const name = restaurant.basicInfo.name;
  restaurantIds[name] = restaurant._id;
});

// ====== 1. Phở Bắc Hương Quê ======
if (restaurantIds["Phở Bắc Hương Quê"]) {
  db.dishes.insertMany([
    {
      restaurantId: restaurantIds["Phở Bắc Hương Quê"],
      categoryId: vietnameseCategoryId,
      basicInfo: {
        name: "Phở Bò Tái",
        description: "Phở bò tái với nước dùng trong vắt, thơm ngon",
        images: ["https://example.com/dishes/pho-bo-tai.jpg"],
        tags: ["bestseller", "traditional"]
      },
      pricing: {
        basePrice: 45000,
        isDiscounted: false
      },
      options: [
        {
          name: "Kích thước",
          type: "single",
          isRequired: true,
          choices: [
            { name: "Nhỏ", price: 0, isDefault: true },
            { name: "Lớn", price: 10000, isDefault: false }
          ]
        }
      ],
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
      restaurantId: restaurantIds["Phở Bắc Hương Quê"],
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
      restaurantId: restaurantIds["Phở Bắc Hương Quê"],
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
if (restaurantIds["Steak House"]) {
  db.dishes.insertMany([
    {
      restaurantId: restaurantIds["Steak House"],
      categoryId: westernCategoryId,
      basicInfo: {
        name: "Ribeye Steak",
        description: "Ribeye steak cao cấp nướng chín vừa với khoai tây nghiền",
        images: ["https://example.com/dishes/ribeye-steak.jpg"],
        tags: ["premium", "bestseller"]
      },
      pricing: { basePrice: 450000, isDiscounted: false },
      options: [
        {
          name: "Độ chín",
          type: "single",
          isRequired: true,
          choices: [
            { name: "Rare", price: 0, isDefault: false },
            { name: "Medium Rare", price: 0, isDefault: true },
            { name: "Medium", price: 0, isDefault: false },
            { name: "Well Done", price: 0, isDefault: false }
          ]
        }
      ],
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
      restaurantId: restaurantIds["Steak House"],
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
    },
    {
      restaurantId: restaurantIds["Steak House"],
      categoryId: westernCategoryId,
      basicInfo: {
        name: "Grilled Salmon",
        description: "Cá hồi nướng với sốt hollandaise",
        images: ["https://example.com/dishes/grilled-salmon.jpg"],
        tags: ["seafood", "healthy"]
      },
      pricing: { basePrice: 380000, isDiscounted: false },
      availability: { isAvailable: true, soldOut: false },
      ratings: { averageRating: 4.6, totalReviews: 67 },
      stats: { totalOrders: 89, viewCount: 445 },
      isActive: true,
      preparationTime: 20,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
}

// ====== 3. Taco Mexico ======
if (restaurantIds["Taco Mexico"]) {
  db.dishes.insertMany([
    {
      restaurantId: restaurantIds["Taco Mexico"],
      categoryId: asianCategoryId,
      basicInfo: {
        name: "Beef Tacos",
        description: "Taco thịt bò với rau sống và sốt salsa",
        images: ["https://example.com/dishes/beef-tacos.jpg"],
        tags: ["spicy", "authentic"]
      },
      pricing: { basePrice: 85000, isDiscounted: false },
      options: [
        {
          name: "Số lượng",
          type: "single",
          isRequired: true,
          choices: [
            { name: "2 chiếc", price: 0, isDefault: true },
            { name: "3 chiếc", price: 25000, isDefault: false }
          ]
        }
      ],
      availability: { isAvailable: true, soldOut: false },
      ratings: { averageRating: 4.4, totalReviews: 67 },
      stats: { totalOrders: 156, viewCount: 890 },
      isActive: true,
      isFeatured: true,
      preparationTime: 12,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      restaurantId: restaurantIds["Taco Mexico"],
      categoryId: asianCategoryId,
      basicInfo: {
        name: "Burrito Bowl",
        description: "Burrito bowl với thịt gà, đậu đen và guacamole",
        images: ["https://example.com/dishes/burrito-bowl.jpg"],
        tags: ["healthy", "filling"]
      },
      pricing: { basePrice: 120000, isDiscounted: false },
      availability: { isAvailable: true, soldOut: false },
      ratings: { averageRating: 4.3, totalReviews: 45 },
      stats: { totalOrders: 78, viewCount: 456 },
      isActive: true,
      preparationTime: 15,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
}

// ====== 4. Café Sáng ======
if (restaurantIds["Café Sáng"]) {
  db.dishes.insertMany([
    {
      restaurantId: restaurantIds["Café Sáng"],
      categoryId: beverageCategoryId,
      basicInfo: {
        name: "Cappuccino",
        description: "Cappuccino thơm với bọt sữa mịn",
        images: ["https://example.com/dishes/cappuccino.jpg"],
        tags: ["classic", "coffee"]
      },
      pricing: { basePrice: 35000, isDiscounted: false },
      options: [
        {
          name: "Kích thước",
          type: "single",
          isRequired: true,
          choices: [
            { name: "Nhỏ", price: 0, isDefault: true },
            { name: "Lớn", price: 10000, isDefault: false }
          ]
        }
      ],
      availability: { isAvailable: true, soldOut: false },
      ratings: { averageRating: 4.6, totalReviews: 89 },
      stats: { totalOrders: 267, viewCount: 1234 },
      isActive: true,
      isFeatured: true,
      preparationTime: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      restaurantId: restaurantIds["Café Sáng"],
      categoryId: dessertCategoryId,
      basicInfo: {
        name: "Tiramisu",
        description: "Bánh Tiramisu Italy chính gốc",
        images: ["https://example.com/dishes/tiramisu.jpg"],
        tags: ["dessert", "sweet"]
      },
      pricing: { basePrice: 65000, isDiscounted: false },
      availability: { isAvailable: true, soldOut: false },
      ratings: { averageRating: 4.7, totalReviews: 56 },
      stats: { totalOrders: 89, viewCount: 345 },
      isActive: true,
      preparationTime: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      restaurantId: restaurantIds["Café Sáng"],
      categoryId: beverageCategoryId,
      basicInfo: {
        name: "Latte",
        description: "Latte mềm mại với latte art đẹp mắt",
        images: ["https://example.com/dishes/latte.jpg"],
        tags: ["smooth", "popular"]
      },
      pricing: { basePrice: 38000, isDiscounted: false },
      availability: { isAvailable: true, soldOut: false },
      ratings: { averageRating: 4.5, totalReviews: 72 },
      stats: { totalOrders: 198, viewCount: 876 },
      isActive: true,
      preparationTime: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
}

// ====== 5. Lẩu Dê ======
if (restaurantIds["Lẩu Dê"]) {
  db.dishes.insertMany([
    {
      restaurantId: restaurantIds["Lẩu Dê"],
      categoryId: vietnameseCategoryId,
      basicInfo: {
        name: "Lẩu Dê Lá Giang",
        description: "Lẩu dê với lá giang thơm, nước dùng đậm đà",
        images: ["https://example.com/dishes/lau-de-la-giang.jpg"],
        tags: ["traditional", "hot"]
      },
      pricing: { basePrice: 280000, isDiscounted: false },
      options: [
        {
          name: "Phần ăn",
          type: "single",
          isRequired: true,
          choices: [
            { name: "2-3 người", price: 0, isDefault: true },
            { name: "4-5 người", price: 120000, isDefault: false }
          ]
        }
      ],
      availability: { isAvailable: true, soldOut: false },
      ratings: { averageRating: 4.3, totalReviews: 73 },
      stats: { totalOrders: 89, viewCount: 567 },
      isActive: true,
      isFeatured: true,
      preparationTime: 20,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      restaurantId: restaurantIds["Lẩu Dê"],
      categoryId: vietnameseCategoryId,
      basicInfo: {
        name: "Thịt Dê Nướng",
        description: "Thịt dê nướng tỏi ớt thơm ngon",
        images: ["https://example.com/dishes/thit-de-nuong.jpg"],
        tags: ["grilled", "spicy"]
      },
      pricing: { basePrice: 150000, isDiscounted: false },
      availability: { isAvailable: true, soldOut: false },
      ratings: { averageRating: 4.2, totalReviews: 45 },
      stats: { totalOrders: 67, viewCount: 234 },
      isActive: true,
      preparationTime: 18,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
}

// ====== 6. Sushi Bar ======
if (restaurantIds["Sushi Bar"]) {
  db.dishes.insertMany([
    {
      restaurantId: restaurantIds["Sushi Bar"],
      categoryId: asianCategoryId,
      basicInfo: {
        name: "Sashimi Set",
        description: "Set sashimi cá hồi và cá ngừ tươi",
        images: ["https://example.com/dishes/sashimi-set.jpg"],
        tags: ["fresh", "premium"]
      },
      pricing: { basePrice: 180000, isDiscounted: false },
      availability: { isAvailable: true, soldOut: false },
      ratings: { averageRating: 4.7, totalReviews: 92 },
      stats: { totalOrders: 123, viewCount: 678 },
      isActive: true,
      isFeatured: true,
      preparationTime: 8,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      restaurantId: restaurantIds["Sushi Bar"],
      categoryId: asianCategoryId,
      basicInfo: {
        name: "California Roll",
        description: "California roll với cua và bơ",
        images: ["https://example.com/dishes/california-roll.jpg"],
        tags: ["popular", "mild"]
      },
      pricing: { basePrice: 120000, isDiscounted: false },
      availability: { isAvailable: true, soldOut: false },
      ratings: { averageRating: 4.4, totalReviews: 67 },
      stats: { totalOrders: 156, viewCount: 789 },
      isActive: true,
      preparationTime: 10,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      restaurantId: restaurantIds["Sushi Bar"],
      categoryId: asianCategoryId,
      basicInfo: {
        name: "Dragon Roll",
        description: "Dragon roll với lươn nướng và bơ",
        images: ["https://example.com/dishes/dragon-roll.jpg"],
        tags: ["signature", "premium"]
      },
      pricing: { basePrice: 160000, isDiscounted: false },
      availability: { isAvailable: true, soldOut: false },
      ratings: { averageRating: 4.6, totalReviews: 54 },
      stats: { totalOrders: 89, viewCount: 456 },
      isActive: true,
      preparationTime: 12,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
}

// ====== 7. Bánh Tráng Nướng ======
if (restaurantIds["Bánh Tráng Nướng"]) {
  db.dishes.insertMany([
    {
      restaurantId: restaurantIds["Bánh Tráng Nướng"],
      categoryId: vietnameseCategoryId,
      basicInfo: {
        name: "Bánh Tráng Nướng Đặc Biệt",
        description: "Bánh tráng nướng với trứng, pate, tôm khô và đầy đủ topping",
        images: ["https://example.com/dishes/banh-trang-nuong-dac-biet.jpg"],
        tags: ["street_food", "complete"]
      },
      pricing: { basePrice: 25000, isDiscounted: false },
      availability: { isAvailable: true, soldOut: false },
      ratings: { averageRating: 4.3, totalReviews: 89 },
      stats: { totalOrders: 234, viewCount: 987 },
      isActive: true,
      isFeatured: true,
      preparationTime: 8,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      restaurantId: restaurantIds["Bánh Tráng Nướng"],
      categoryId: vietnameseCategoryId,
      basicInfo: {
        name: "Bánh Tráng Nướng Tôm",
        description: "Bánh tráng nướng với tôm tươi",
        images: ["https://example.com/dishes/banh-trang-nuong-tom.jpg"],
        tags: ["seafood", "crispy"]
      },
      pricing: { basePrice: 30000, isDiscounted: false },
      availability: { isAvailable: true, soldOut: false },
      ratings: { averageRating: 4.2, totalReviews: 67 },
      stats: { totalOrders: 156, viewCount: 567 },
      isActive: true,
      preparationTime: 10,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
}

// ====== 19. Pizza House Saigon ======
if (restaurantIds["Pizza House Saigon"]) {
  db.dishes.insertMany([
    {
      restaurantId: restaurantIds["Pizza House Saigon"],
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
      restaurantId: restaurantIds["Pizza House Saigon"],
      categoryId: pizzaCategoryId,
      basicInfo: {
        name: "Pizza Pepperoni",
        description: "Pizza với pepperoni, phô mai mozzarella và sốt cà chua đặc biệt",
        images: ["https://example.com/dishes/pepperoni.jpg"],
        tags: ["popular", "meat"]
      },
      pricing: { basePrice: 220000, isDiscounted: false },
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
      availability: { isAvailable: true, soldOut: false },
      ratings: { averageRating: 4.5, totalReviews: 76 },
      stats: { totalOrders: 189, viewCount: 987 },
      isActive: true,
      preparationTime: 18,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      restaurantId: restaurantIds["Pizza House Saigon"],
      categoryId: pizzaCategoryId,
      basicInfo: {
        name: "Pizza Quattro Stagioni",
        description: "Pizza 4 mùa với jambon, nấm, ô liu và atiso",
        images: ["https://example.com/dishes/quattro-stagioni.jpg"],
        tags: ["variety", "premium"]
      },
      pricing: { basePrice: 250000, isDiscounted: false },
      availability: { isAvailable: true, soldOut: false },
      ratings: { averageRating: 4.6, totalReviews: 54 },
      stats: { totalOrders: 123, viewCount: 654 },
      isActive: true,
      preparationTime: 20,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
}

// ====== 20. Phở Sài Gòn ======
if (restaurantIds["Phở Sài Gòn"]) {
  db.dishes.insertMany([
    {
      restaurantId: restaurantIds["Phở Sài Gòn"],
      categoryId: vietnameseCategoryId,
      basicInfo: {
        name: "Phở Bò Đặc Biệt",
        description: "Phở bò đặc biệt với đầy đủ loại thịt",
        images: ["https://example.com/dishes/pho-dac-biet.jpg"],
        tags: ["signature", "complete"]
      },
      pricing: { basePrice: 55000, isDiscounted: false },
      options: [
        {
          name: "Kích thước",
          type: "single",
          isRequired: true,
          choices: [
            { name: "Nhỏ", price: 0, isDefault: true },
            { name: "Lớn", price: 15000, isDefault: false }
          ]
        }
      ],
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
      restaurantId: restaurantIds["Phở Sài Gòn"],
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
    },
    {
      restaurantId: restaurantIds["Phở Sài Gòn"],
      categoryId: beverageCategoryId,
      basicInfo: {
        name: "Trà Đá",
        description: "Trà đá truyền thống giải khát",
        images: ["https://example.com/dishes/tra-da.jpg"],
        tags: ["refreshing", "traditional"]
      },
      pricing: { basePrice: 8000, isDiscounted: false },
      availability: { isAvailable: true, soldOut: false },
      ratings: { averageRating: 4.0, totalReviews: 34 },
      stats: { totalOrders: 89, viewCount: 234 },
      isActive: true,
      preparationTime: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
}

print("✅ Đã tạo xong categories và dishes!");
print("📊 Tổng kết:");
print("- Categories: 6 danh mục");
print("- Dishes: 30+ món ăn cho 7 nhà hàng đầu tiên");
print("💡 Chạy file này sau khi đã chạy addSampleData.js"); 