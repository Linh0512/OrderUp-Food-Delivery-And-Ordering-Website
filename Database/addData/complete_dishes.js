use('food_delivery_app');

// ====================================
// COMPLETE DISHES DATA - Món ăn cho tất cả nhà hàng
// ====================================
print("📝 Tạo món ăn cho tất cả nhà hàng...");

// Lấy categories đã tạo
const categories = {};
db.categories.find({}).forEach(cat => {
  categories[cat.name] = cat._id;
});

// Lấy restaurants
const restaurants = {};
db.restaurants.find({}).forEach(res => {
  restaurants[res.basicInfo.name] = res._id;
});

// ====== 3. Taco Mexico ======
if (restaurants["Taco Mexico"]) {
  db.dishes.insertMany([
    {
      restaurantId: restaurants["Taco Mexico"],
      categoryId: categories["Món Á"],
      basicInfo: {
        name: "Beef Tacos",
        description: "Taco thịt bò với rau sống và sốt salsa",
        images: ["https://example.com/dishes/beef-tacos.jpg"],
        tags: ["spicy", "authentic"]
      },
      pricing: { basePrice: 85000, isDiscounted: false },
      options: [{
        name: "Số lượng",
        type: "single",
        isRequired: true,
        choices: [
          { name: "2 chiếc", price: 0, isDefault: true },
          { name: "3 chiếc", price: 25000, isDefault: false }
        ]
      }],
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
      restaurantId: restaurants["Taco Mexico"],
      categoryId: categories["Món Á"],
      basicInfo: {
        name: "Chicken Quesadilla",
        description: "Bánh tortilla nướng với gà và phô mai",
        images: ["https://example.com/dishes/chicken-quesadilla.jpg"],
        tags: ["cheesy", "popular"]
      },
      pricing: { basePrice: 95000, isDiscounted: false },
      availability: { isAvailable: true, soldOut: false },
      ratings: { averageRating: 4.3, totalReviews: 45 },
      stats: { totalOrders: 78, viewCount: 456 },
      isActive: true,
      preparationTime: 15,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      restaurantId: restaurants["Taco Mexico"],
      categoryId: categories["Đồ Uống"],
      basicInfo: {
        name: "Horchata",
        description: "Nước uống truyền thống Mexico từ gạo và quế",
        images: ["https://example.com/dishes/horchata.jpg"],
        tags: ["traditional", "sweet"]
      },
      pricing: { basePrice: 35000, isDiscounted: false },
      availability: { isAvailable: true, soldOut: false },
      ratings: { averageRating: 4.1, totalReviews: 32 },
      stats: { totalOrders: 89, viewCount: 234 },
      isActive: true,
      preparationTime: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
}

// ====== 4. Café Sáng ======
if (restaurants["Café Sáng"]) {
  db.dishes.insertMany([
    {
      restaurantId: restaurants["Café Sáng"],
      categoryId: categories["Đồ Uống"],
      basicInfo: {
        name: "Cappuccino",
        description: "Cappuccino thơm với bọt sữa mịn",
        images: ["https://example.com/dishes/cappuccino.jpg"],
        tags: ["classic", "coffee"]
      },
      pricing: { basePrice: 35000, isDiscounted: false },
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
      ratings: { averageRating: 4.6, totalReviews: 89 },
      stats: { totalOrders: 267, viewCount: 1234 },
      isActive: true,
      isFeatured: true,
      preparationTime: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      restaurantId: restaurants["Café Sáng"],
      categoryId: categories["Tráng Miệng"],
      basicInfo: {
        name: "Cheesecake Dâu",
        description: "Bánh phô mai với topping dâu tươi",
        images: ["https://example.com/dishes/strawberry-cheesecake.jpg"],
        tags: ["sweet", "fresh"]
      },
      pricing: { basePrice: 75000, isDiscounted: false },
      availability: { isAvailable: true, soldOut: false },
      ratings: { averageRating: 4.7, totalReviews: 56 },
      stats: { totalOrders: 89, viewCount: 345 },
      isActive: true,
      preparationTime: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      restaurantId: restaurants["Café Sáng"],
      categoryId: categories["Đồ Uống"],
      basicInfo: {
        name: "Trà Sữa Trân Châu",
        description: "Trà sữa Đài Loan với trân châu đen",
        images: ["https://example.com/dishes/bubble-tea.jpg"],
        tags: ["trendy", "chewy"]
      },
      pricing: { basePrice: 45000, isDiscounted: false },
      availability: { isAvailable: true, soldOut: false },
      ratings: { averageRating: 4.4, totalReviews: 123 },
      stats: { totalOrders: 234, viewCount: 876 },
      isActive: true,
      preparationTime: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
}

// ====== 8. Indian Curry ======
if (restaurants["Indian Curry"]) {
  db.dishes.insertMany([
    {
      restaurantId: restaurants["Indian Curry"],
      categoryId: categories["Món Á"],
      basicInfo: {
        name: "Butter Chicken",
        description: "Gà cà ri bơ Ấn Độ với naan bread",
        images: ["https://example.com/dishes/butter-chicken.jpg"],
        tags: ["signature", "creamy"]
      },
      pricing: { basePrice: 180000, isDiscounted: false },
      options: [{
        name: "Độ cay",
        type: "single",
        isRequired: true,
        choices: [
          { name: "Nhẹ", price: 0, isDefault: true },
          { name: "Vừa", price: 0, isDefault: false },
          { name: "Cay", price: 0, isDefault: false }
        ]
      }],
      availability: { isAvailable: true, soldOut: false },
      ratings: { averageRating: 4.6, totalReviews: 78 },
      stats: { totalOrders: 134, viewCount: 567 },
      isActive: true,
      isFeatured: true,
      preparationTime: 20,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      restaurantId: restaurants["Indian Curry"],
      categoryId: categories["Món Á"],
      basicInfo: {
        name: "Biryani Gà",
        description: "Cơm Basmati thơm với gà gia vị Ấn Độ",
        images: ["https://example.com/dishes/chicken-biryani.jpg"],
        tags: ["aromatic", "spiced"]
      },
      pricing: { basePrice: 160000, isDiscounted: false },
      availability: { isAvailable: true, soldOut: false },
      ratings: { averageRating: 4.5, totalReviews: 65 },
      stats: { totalOrders: 98, viewCount: 456 },
      isActive: true,
      preparationTime: 25,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      restaurantId: restaurants["Indian Curry"],
      categoryId: categories["Đồ Uống"],
      basicInfo: {
        name: "Lassi Xoài",
        description: "Nước uống sữa chua với xoài tươi",
        images: ["https://example.com/dishes/mango-lassi.jpg"],
        tags: ["refreshing", "yogurt"]
      },
      pricing: { basePrice: 45000, isDiscounted: false },
      availability: { isAvailable: true, soldOut: false },
      ratings: { averageRating: 4.3, totalReviews: 43 },
      stats: { totalOrders: 67, viewCount: 234 },
      isActive: true,
      preparationTime: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
}

// ====== 9. Nhà Hàng Chay An Lạc ======
if (restaurants["Nhà Hàng Chay An Lạc"]) {
  db.dishes.insertMany([
    {
      restaurantId: restaurants["Nhà Hàng Chay An Lạc"],
      categoryId: categories["Món Việt"],
      basicInfo: {
        name: "Cơm Âm Phủ Chay",
        description: "Cơm âm phủ chay với đậu hũ và rau củ",
        images: ["https://example.com/dishes/com-am-phu-chay.jpg"],
        tags: ["healthy", "traditional"]
      },
      pricing: { basePrice: 65000, isDiscounted: false },
      availability: { isAvailable: true, soldOut: false },
      ratings: { averageRating: 4.4, totalReviews: 89 },
      stats: { totalOrders: 145, viewCount: 678 },
      isActive: true,
      isFeatured: true,
      preparationTime: 15,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      restaurantId: restaurants["Nhà Hàng Chay An Lạc"],
      categoryId: categories["Món Việt"],
      basicInfo: {
        name: "Bún Riêu Chay",
        description: "Bún riêu chay với đậu hũ và cà chua",
        images: ["https://example.com/dishes/bun-rieu-chay.jpg"],
        tags: ["soup", "tomato"]
      },
      pricing: { basePrice: 55000, isDiscounted: false },
      availability: { isAvailable: true, soldOut: false },
      ratings: { averageRating: 4.2, totalReviews: 67 },
      stats: { totalOrders: 89, viewCount: 345 },
      isActive: true,
      preparationTime: 12,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
}

// ====== 10. Hamburger Haven ======
if (restaurants["Hamburger Haven"]) {
  db.dishes.insertMany([
    {
      restaurantId: restaurants["Hamburger Haven"],
      categoryId: categories["Món Âu"],
      basicInfo: {
        name: "Classic Burger",
        description: "Burger cổ điển với thịt bò, rau sống và sốt đặc biệt",
        images: ["https://example.com/dishes/classic-burger.jpg"],
        tags: ["classic", "beef"]
      },
      pricing: { basePrice: 120000, isDiscounted: false },
      options: [{
        name: "Combo",
        type: "single",
        isRequired: false,
        choices: [
          { name: "Chỉ burger", price: 0, isDefault: true },
          { name: "Combo khoai tây", price: 25000, isDefault: false },
          { name: "Combo full", price: 40000, isDefault: false }
        ]
      }],
      availability: { isAvailable: true, soldOut: false },
      ratings: { averageRating: 4.3, totalReviews: 156 },
      stats: { totalOrders: 234, viewCount: 987 },
      isActive: true,
      isFeatured: true,
      preparationTime: 15,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      restaurantId: restaurants["Hamburger Haven"],
      categoryId: categories["Món Âu"],
      basicInfo: {
        name: "Chicken Wings",
        description: "Cánh gà nướng BBQ giòn tan",
        images: ["https://example.com/dishes/chicken-wings.jpg"],
        tags: ["crispy", "bbq"]
      },
      pricing: { basePrice: 95000, isDiscounted: false },
      availability: { isAvailable: true, soldOut: false },
      ratings: { averageRating: 4.4, totalReviews: 78 },
      stats: { totalOrders: 123, viewCount: 456 },
      isActive: true,
      preparationTime: 12,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
}

// ====== 11. Lẩu Thái Lan ======
if (restaurants["Lẩu Thái Lan"]) {
  db.dishes.insertMany([
    {
      restaurantId: restaurants["Lẩu Thái Lan"],
      categoryId: categories["Món Á"],
      basicInfo: {
        name: "Tom Yum Hotpot",
        description: "Lẩu Tom Yum chua cay đặc trưng Thái Lan",
        images: ["https://example.com/dishes/tom-yum-hotpot.jpg"],
        tags: ["spicy", "sour", "signature"]
      },
      pricing: { basePrice: 280000, isDiscounted: false },
      options: [{
        name: "Phần ăn",
        type: "single",
        isRequired: true,
        choices: [
          { name: "2-3 người", price: 0, isDefault: true },
          { name: "4-5 người", price: 150000, isDefault: false }
        ]
      }],
      availability: { isAvailable: true, soldOut: false },
      ratings: { averageRating: 4.5, totalReviews: 89 },
      stats: { totalOrders: 67, viewCount: 345 },
      isActive: true,
      isFeatured: true,
      preparationTime: 18,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      restaurantId: restaurants["Lẩu Thái Lan"],
      categoryId: categories["Món Á"],
      basicInfo: {
        name: "Pad Thai",
        description: "Mì xào Thái Lan với tôm và đậu phộng",
        images: ["https://example.com/dishes/pad-thai.jpg"],
        tags: ["noodles", "sweet"]
      },
      pricing: { basePrice: 85000, isDiscounted: false },
      availability: { isAvailable: true, soldOut: false },
      ratings: { averageRating: 4.3, totalReviews: 56 },
      stats: { totalOrders: 98, viewCount: 567 },
      isActive: true,
      preparationTime: 12,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
}

// ====== 12. Trà Đào Nhà Làm ======
if (restaurants["Trà Đào Nhà Làm"]) {
  db.dishes.insertMany([
    {
      restaurantId: restaurants["Trà Đào Nhà Làm"],
      categoryId: categories["Đồ Uống"],
      basicInfo: {
        name: "Trà Đào Cam Sả",
        description: "Trà đào với cam tươi và sả thơm",
        images: ["https://example.com/dishes/tra-dao-cam-sa.jpg"],
        tags: ["refreshing", "fruity", "signature"]
      },
      pricing: { basePrice: 35000, isDiscounted: false },
      options: [{
        name: "Đá",
        type: "single",
        isRequired: true,
        choices: [
          { name: "Nhiều đá", price: 0, isDefault: true },
          { name: "Ít đá", price: 0, isDefault: false },
          { name: "Không đá", price: 0, isDefault: false }
        ]
      }],
      availability: { isAvailable: true, soldOut: false },
      ratings: { averageRating: 4.6, totalReviews: 134 },
      stats: { totalOrders: 345, viewCount: 1234 },
      isActive: true,
      isFeatured: true,
      preparationTime: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      restaurantId: restaurants["Trà Đào Nhà Làm"],
      categoryId: categories["Đồ Uống"],
      basicInfo: {
        name: "Trà Chanh Leo",
        description: "Trà chanh leo chua ngọt mát lạnh",
        images: ["https://example.com/dishes/tra-chanh-leo.jpg"],
        tags: ["sour", "sweet"]
      },
      pricing: { basePrice: 32000, isDiscounted: false },
      availability: { isAvailable: true, soldOut: false },
      ratings: { averageRating: 4.4, totalReviews: 89 },
      stats: { totalOrders: 234, viewCount: 678 },
      isActive: true,
      preparationTime: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
}

// ====== 13. Nhà Hàng Ý ======
if (restaurants["Nhà Hàng Ý"]) {
  db.dishes.insertMany([
    {
      restaurantId: restaurants["Nhà Hàng Ý"],
      categoryId: categories["Pizza"],
      basicInfo: {
        name: "Pizza Napoletana",
        description: "Pizza Naples truyền thống với sốt San Marzano",
        images: ["https://example.com/dishes/pizza-napoletana.jpg"],
        tags: ["authentic", "traditional"]
      },
      pricing: { basePrice: 190000, isDiscounted: false },
      options: [{
        name: "Kích thước",
        type: "single",
        isRequired: true,
        choices: [
          { name: "Cá nhân", price: 0, isDefault: true },
          { name: "Gia đình", price: 80000, isDefault: false }
        ]
      }],
      availability: { isAvailable: true, soldOut: false },
      ratings: { averageRating: 4.7, totalReviews: 67 },
      stats: { totalOrders: 89, viewCount: 456 },
      isActive: true,
      isFeatured: true,
      preparationTime: 16,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      restaurantId: restaurants["Nhà Hàng Ý"],
      categoryId: categories["Pizza"],
      basicInfo: {
        name: "Spaghetti Carbonara",
        description: "Mì Ý với bacon, trứng và phô mai Parmesan",
        images: ["https://example.com/dishes/spaghetti-carbonara.jpg"],
        tags: ["creamy", "classic"]
      },
      pricing: { basePrice: 145000, isDiscounted: false },
      availability: { isAvailable: true, soldOut: false },
      ratings: { averageRating: 4.6, totalReviews: 78 },
      stats: { totalOrders: 123, viewCount: 567 },
      isActive: true,
      preparationTime: 14,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
}

// ====== 14. Bún Chả Hà Nội ======
if (restaurants["Bún Chả Hà Nội"]) {
  db.dishes.insertMany([
    {
      restaurantId: restaurants["Bún Chả Hà Nội"],
      categoryId: categories["Món Việt"],
      basicInfo: {
        name: "Bún Chả Đặc Biệt",
        description: "Bún chả Hà Nội với thịt nướng và chả cá",
        images: ["https://example.com/dishes/bun-cha-dac-biet.jpg"],
        tags: ["signature", "grilled"]
      },
      pricing: { basePrice: 65000, isDiscounted: false },
      availability: { isAvailable: true, soldOut: false },
      ratings: { averageRating: 4.5, totalReviews: 123 },
      stats: { totalOrders: 234, viewCount: 890 },
      isActive: true,
      isFeatured: true,
      preparationTime: 15,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      restaurantId: restaurants["Bún Chả Hà Nội"],
      categoryId: categories["Món Việt"],
      basicInfo: {
        name: "Nem Cua Bể",
        description: "Nem cuốn cua bể tươi ngon",
        images: ["https://example.com/dishes/nem-cua-be.jpg"],
        tags: ["fresh", "seafood"]
      },
      pricing: { basePrice: 45000, isDiscounted: false },
      availability: { isAvailable: true, soldOut: false },
      ratings: { averageRating: 4.3, totalReviews: 67 },
      stats: { totalOrders: 89, viewCount: 345 },
      isActive: true,
      preparationTime: 8,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
}

print("✅ Đã tạo xong món ăn cho tất cả nhà hàng!");
print("📊 Tổng kết món ăn đã thêm:");
print("- Taco Mexico: 3 món");
print("- Café Sáng: 3 món");
print("- Indian Curry: 3 món");
print("- Nhà Hàng Chay: 2 món");
print("- Hamburger Haven: 2 món");
print("- Lẩu Thái Lan: 2 món");
print("- Trà Đào Nhà Làm: 2 món");
print("- Nhà Hàng Ý: 2 món");
print("- Bún Chả Hà Nội: 2 món");
print("💡 Tổng cộng: 21 món ăn mới cho 9 nhà hàng"); 