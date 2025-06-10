use('food_delivery_app');

// ====================================
// 1. USERS - Người dùng
// ====================================
print("📝 Tạo users...");

// Restaurant Host 1
const hostUser1Result = db.users.insertOne({
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
const hostUser1Id = hostUser1Result.insertedId;

// Restaurant Host 2
const hostUser2Result = db.users.insertOne({
    email: "host2@steakhouse.com",
    password: "$2b$10$hashedPasswordHost456",
    role: "restaurantHost",
    profile: {
      firstName: "Trần",
      lastName: "Thị B",
      phone: "0976543210",
      avatar: "https://example.com/avatars/host2.jpg",
      dateOfBirth: new Date("1988-08-22"),
      gender: "female"
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
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date()
  });
  const hostUser2Id = hostUser2Result.insertedId;

// Restaurant Host 3
const hostUser3Result = db.users.insertOne({
    email: "host3@tacomexico.com",
    password: "$2b$10$hashedPasswordHost789",
    role: "restaurantHost",
    profile: {
      firstName: "Lê",
      lastName: "Minh C",
      phone: "0965432109",
      avatar: "https://example.com/avatars/host3.jpg",
      dateOfBirth: new Date("1990-12-03"),
      gender: "male"
    },
    preferences: {
      language: "vi",
      notifications: {
        email: false,
        push: true,
        sms: false,
        orderUpdates: true,
        promotions: false
      }
    },
    isActive: true,
    isVerified: true,
    lastLogin: new Date(),
    createdAt: new Date("2024-03-05"),
    updatedAt: new Date()
  });
  const hostUser3Id = hostUser3Result.insertedId;

  // Restaurant Host 4
  const hostUser4Result = db.users.insertOne({
    email: "host4@cafesang.com",
    password: "$2b$10$hashedPasswordHost012",
    role: "restaurantHost",
    profile: {
      firstName: "Phạm",
      lastName: "Văn D",
      phone: "0954321098",
      avatar: "https://example.com/avatars/host4.jpg",
      dateOfBirth: new Date("1982-04-18"),
      gender: "male"
    },
    preferences: {
      language: "vi",
      notifications: {
        email: true,
        push: false,
        sms: true,
        orderUpdates: true,
        promotions: true
      }
    },
    isActive: true,
    isVerified: true,
    lastLogin: new Date(),
    createdAt: new Date("2024-04-12"),
    updatedAt: new Date()
  });
  const hostUser4Id = hostUser4Result.insertedId;

  // Restaurant Host 5
  const hostUser5Result = db.users.insertOne({
    email: "host5@laude.com",
    password: "$2b$10$hashedPasswordHost345",
    role: "restaurantHost",
    profile: {
      firstName: "Hoàng",
      lastName: "Thị E",
      phone: "0943210987",
      avatar: "https://example.com/avatars/host5.jpg",
      dateOfBirth: new Date("1987-07-30"),
      gender: "female"
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
    createdAt: new Date("2024-05-20"),
    updatedAt: new Date()
  });
  const hostUser5Id = hostUser5Result.insertedId;

  // Restaurant Host 6
  const hostUser6Result = db.users.insertOne({
    email: "host6@sushibar.com",
    password: "$2b$10$hashedPasswordHost678",
    role: "restaurantHost",
    profile: {
      firstName: "Vũ",
      lastName: "Minh F",
      phone: "0932109876",
      avatar: "https://example.com/avatars/host6.jpg",
      dateOfBirth: new Date("1993-11-14"),
      gender: "male"
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
    createdAt: new Date("2024-06-08"),
    updatedAt: new Date()
  });
  const hostUser6Id = hostUser6Result.insertedId;

  // Restaurant Host 7
  const hostUser7Result = db.users.insertOne({
    email: "host7@banhtrangnuong.com",
    password: "$2b$10$hashedPasswordHost901",
    role: "restaurantHost",
    profile: {
      firstName: "Đặng",
      lastName: "Thị G",
      phone: "0921098765",
      avatar: "https://example.com/avatars/host7.jpg",
      dateOfBirth: new Date("1991-09-25"),
      gender: "female"
    },
    preferences: {
      language: "vi",
      notifications: {
        email: false,
        push: true,
        sms: false,
        orderUpdates: true,
        promotions: true
      }
    },
    isActive: true,
    isVerified: true,
    lastLogin: new Date(),
    createdAt: new Date("2024-07-15"),
    updatedAt: new Date()
  });
  const hostUser7Id = hostUser7Result.insertedId;

  
// ====================================
// 2. RESTAURANTS - Nhà hàng
// ====================================

const restaurantResult = db.restaurants.insertOne({
      "hostId": hostUser1Id,
      "basicInfo": {
        "name": "Phở Bắc Hương Quê",
        "description": "Phở bò truyền thống mang đậm hương vị miền Bắc",
        "phone": "028-1234-9876",
        "email": "contact@phobachuongque.com",
        "website": "https://phobachuongque.com",
        "images": [
          "https://example.com/restaurants/phobac-1.jpg",
          "https://example.com/restaurants/phobac-2.jpg"
        ],
        "logo": "https://example.com/restaurants/phobac-logo.jpg",
        "coverImage": "https://example.com/restaurants/phobac-cover.jpg",
        "priceRange": "budget"
      },
      "address": {
        "fullAddress": "321 Hùng Vương, Phường 9, Quận 5, TP.HCM",
        "district": "Quận 5",
        "city": "TP.HCM",
        "coordinates": {
          "lat": 10.7543,
          "lng": 106.6698
        }
      },
      "businessInfo": {
        "businessLicense": "9876543210",
        "taxCode": "0123456789",
        "businessType": "restaurant",
        "cuisineTypes": ["vietnamese", "noodles"]
      },
      "operatingHours": [
        {"dayOfWeek": 1, "isOpen": true, "openTime": "06:00", "closeTime": "21:00"},
        {"dayOfWeek": 2, "isOpen": true, "openTime": "06:00", "closeTime": "21:00"},
        {"dayOfWeek": 3, "isOpen": true, "openTime": "06:00", "closeTime": "21:00"},
        {"dayOfWeek": 4, "isOpen": true, "openTime": "06:00", "closeTime": "21:00"},
        {"dayOfWeek": 5, "isOpen": true, "openTime": "06:00", "closeTime": "21:00"},
        {"dayOfWeek": 6, "isOpen": true, "openTime": "06:00", "closeTime": "21:00"},
        {"dayOfWeek": 0, "isOpen": true, "openTime": "06:00", "closeTime": "21:00"}
      ],
      "delivery": {
        "isDeliveryAvailable": true,
        "deliveryRadius": 4,
        "deliveryFee": 8000,
        "freeDeliveryThreshold": 70000,
        "estimatedDeliveryTime": 25,
        "deliveryAreas": ["Quận 5", "Quận 10"]
      },
      "ratings": {
        "averageRating": 4.3,
        "totalReviews": 80,
        "ratingBreakdown": {
          "5star": 35,
          "4star": 30,
          "3star": 10,
          "2star": 3,
          "1star": 2
        }
      },
      "tags": ["pho", "vietnamese", "budget", "noodles"],
      "isActive": true,
      "isVerified": true,
      "isFeatured": false,
      "verificationStatus": "approved",
      "bankInfo": {
        "bankName": "Agribank",
        "accountNumber": "1234567890",
        "accountHolder": "PHỞ BẮC HƯƠNG QUÊ"
      },
      "createdAt": "2025-09-01T00:00:00.000Z",
      "updatedAt": "2025-09-01T00:00:00.000Z"
    });

    const restaurant2Result = db.restaurants.insertOne({
      "hostId": hostUser2Id,
      "basicInfo": {
        "name": "Steak House",
        "description": "Nhà hàng bò bít tết cao cấp với nguyên liệu nhập khẩu",
        "phone": "028-5678-1234",
        "email": "info@steakhouse.com",
        "website": "https://steakhouse.com",
        "images": [
          "https://example.com/restaurants/steakhouse-1.jpg",
          "https://example.com/restaurants/steakhouse-2.jpg"
        ],
        "logo": "https://example.com/restaurants/steakhouse-logo.jpg",
        "coverImage": "https://example.com/restaurants/steakhouse-cover.jpg",
        "priceRange": "upscale"
      },
      "address": {
        "fullAddress": "56 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM",
        "district": "Quận 1",
        "city": "TP.HCM",
        "coordinates": {
          "lat": 10.7745,
          "lng": 106.7021
        }
      },
      "businessInfo": {
        "businessLicense": "5678901234",
        "taxCode": "7890123456",
        "businessType": "restaurant",
        "cuisineTypes": ["western", "steak"]
      },
      "operatingHours": [
        {"dayOfWeek": 1, "isOpen": true, "openTime": "11:00", "closeTime": "23:00"},
        {"dayOfWeek": 2, "isOpen": true, "openTime": "11:00", "closeTime": "23:00"},
        {"dayOfWeek": 3, "isOpen": true, "openTime": "11:00", "closeTime": "23:00"},
        {"dayOfWeek": 4, "isOpen": true, "openTime": "11:00", "closeTime": "23:00"},
        {"dayOfWeek": 5, "isOpen": true, "openTime": "11:00", "closeTime": "00:00"},
        {"dayOfWeek": 6, "isOpen": true, "openTime": "11:00", "closeTime": "00:00"},
        {"dayOfWeek": 0, "isOpen": true, "openTime": "11:00", "closeTime": "23:00"}
      ],
      "delivery": {
        "isDeliveryAvailable": false,
        "deliveryRadius": 0,
        "deliveryFee": 0,
        "freeDeliveryThreshold": 0,
        "estimatedDeliveryTime": 0,
        "deliveryAreas": []
      },
      "ratings": {
        "averageRating": 4.8,
        "totalReviews": 200,
        "ratingBreakdown": {
          "5star": 150,
          "4star": 40,
          "3star": 7,
          "2star": 2,
          "1star": 1
        }
      },
      "tags": ["steak", "western", "upscale", "fine_dining"],
      "isActive": true,
      "isVerified": true,
      "isFeatured": true,
      "verificationStatus": "approved",
      "bankInfo": {
        "bankName": "Vietcombank",
        "accountNumber": "9876543210",
        "accountHolder": "STEAK HOUSE"
      },
      "createdAt": "2025-10-01T00:00:00.000Z",
      "updatedAt": "2025-10-01T00:00:00.000Z"
    });

    const restaurant3Result = db.restaurants.insertOne({
      "hostId": hostUser3Id,
      "basicInfo": {
        "name": "Taco Mexico",
        "description": "Ẩm thực Mexico đích thực với taco và burrito",
        "phone": "028-3456-7890",
        "email": "contact@tacomexico.com",
        "website": "https://tacomexico.com",
        "images": [
          "https://example.com/restaurants/tacomexico-1.jpg",
          "https://example.com/restaurants/tacomexico-2.jpg"
        ],
        "logo": "https://example.com/restaurants/tacomexico-logo.jpg",
        "coverImage": "https://example.com/restaurants/tacomexico-cover.jpg",
        "priceRange": "mid-range"
      },
      "address": {
        "fullAddress": "789 Lý Thường Kiệt, Phường 11, Quận 10, TP.HCM",
        "district": "Quận 10",
        "city": "TP.HCM",
        "coordinates": {
          "lat": 10.7678,
          "lng": 106.6623
        }
      },
      "businessInfo": {
        "businessLicense": "3456789012",
        "taxCode": "5678901234",
        "businessType": "restaurant",
        "cuisineTypes": ["mexican", "street_food"]
      },
      "operatingHours": [
        {"dayOfWeek": 1, "isOpen": true, "openTime": "10:00", "closeTime": "22:00"},
        {"dayOfWeek": 2, "isOpen": true, "openTime": "10:00", "closeTime": "22:00"},
        {"dayOfWeek": 3, "isOpen": true, "openTime": "10:00", "closeTime": "22:00"},
        {"dayOfWeek": 4, "isOpen": true, "openTime": "10:00", "closeTime": "22:00"},
        {"dayOfWeek": 5, "isOpen": true, "openTime": "10:00", "closeTime": "23:00"},
        {"dayOfWeek": 6, "isOpen": true, "openTime": "10:00", "closeTime": "23:00"},
        {"dayOfWeek": 0, "isOpen": true, "openTime": "10:00", "closeTime": "22:00"}
      ],
      "delivery": {
        "isDeliveryAvailable": true,
        "deliveryRadius": 6,
        "deliveryFee": 12000,
        "freeDeliveryThreshold": 180000,
        "estimatedDeliveryTime": 30,
        "deliveryAreas": ["Quận 10", "Quận 5", "Quận 11"]
      },
      "ratings": {
        "averageRating": 4.4,
        "totalReviews": 90,
        "ratingBreakdown": {
          "5star": 45,
          "4star": 30,
          "3star": 10,
          "2star": 3,
          "1star": 2
        }
      },
      "tags": ["taco", "mexican", "mid-range", "street_food"],
      "isActive": true,
      "isVerified": true,
      "isFeatured": false,
      "verificationStatus": "approved",
      "bankInfo": {
        "bankName": "Techcombank",
        "accountNumber": "3456789012",
        "accountHolder": "TACO MEXICO"
      },
      "createdAt": "2025-11-01T00:00:00.000Z",
      "updatedAt": "2025-11-01T00:00:00.000Z"
    });

    const restaurant4Result = db.restaurants.insertOne({
      "hostId": hostUser4Id,
      "basicInfo": {
        "name": "Café Sáng",
        "description": "Quán cà phê yên tĩnh, phù hợp làm việc và thư giãn",
        "phone": "028-9012-3456",
        "email": "info@cafesang.com",
        "website": "https://cafesang.com",
        "images": [
          "https://example.com/restaurants/cafesang-1.jpg",
          "https://example.com/restaurants/cafesang-2.jpg"
        ],
        "logo": "https://example.com/restaurants/cafesang-logo.jpg",
        "coverImage": "https://example.com/restaurants/cafesang-cover.jpg",
        "priceRange": "mid-range"
      },
      "address": {
        "fullAddress": "123 Trường Chinh, Phường 12, Quận Tân Bình, TP.HCM",
        "district": "Tân Bình",
        "city": "TP.HCM",
        "coordinates": {
          "lat": 10.7943,
          "lng": 106.6521
        }
      },
      "businessInfo": {
        "businessLicense": "9012345678",
        "taxCode": "1234567890",
        "businessType": "cafe",
        "cuisineTypes": ["cafe", "desserts"]
      },
      "operatingHours": [
        {"dayOfWeek": 1, "isOpen": true, "openTime": "07:00", "closeTime": "22:00"},
        {"dayOfWeek": 2, "isOpen": true, "openTime": "07:00", "closeTime": "22:00"},
        {"dayOfWeek": 3, "isOpen": true, "openTime": "07:00", "closeTime": "22:00"},
        {"dayOfWeek": 4, "isOpen": true, "openTime": "07:00", "closeTime": "22:00"},
        {"dayOfWeek": 5, "isOpen": true, "openTime": "07:00", "closeTime": "23:00"},
        {"dayOfWeek": 6, "isOpen": true, "openTime": "07:00", "closeTime": "23:00"},
        {"dayOfWeek": 0, "isOpen": true, "openTime": "07:00", "closeTime": "22:00"}
      ],
      "delivery": {
        "isDeliveryAvailable": true,
        "deliveryRadius": 5,
        "deliveryFee": 10000,
        "freeDeliveryThreshold": 150000,
        "estimatedDeliveryTime": 25,
        "deliveryAreas": ["Tân Bình", "Quận 11"]
      },
      "ratings": {
        "averageRating": 4.5,
        "totalReviews": 110,
        "ratingBreakdown": {
          "5star": 60,
          "4star": 35,
          "3star": 10,
          "2star": 3,
          "1star": 2
        }
      },
      "tags": ["cafe", "relaxing", "mid-range", "work_friendly"],
      "isActive": true,
      "isVerified": true,
      "isFeatured": true,
      "verificationStatus": "approved",
      "bankInfo": {
        "bankName": "VPBank",
        "accountNumber": "9012345678",
        "accountHolder": "CAFÉ SÁNG"
      },
      "createdAt": "2025-12-01T00:00:00.000Z",
      "updatedAt": "2025-12-01T00:00:00.000Z"
    });

    const restaurant5Result = db.restaurants.insertOne({
      "hostId": hostUser5Id,
      "basicInfo": {
        "name": "Lẩu Dê",
        "description": "Lẩu dê thơm ngon, bổ dưỡng với nước dùng đậm đà",
        "phone": "028-6789-0123",
        "email": "contact@laude.com",
        "website": "https://laude.com",
        "images": [
          "https://example.com/restaurants/laude-1.jpg",
          "https://example.com/restaurants/laude-2.jpg"
        ],
        "logo": "https://example.com/restaurants/laude-logo.jpg",
        "coverImage": "https://example.com/restaurants/laude-cover.jpg",
        "priceRange": "mid-range"
      },
      "address": {
        "fullAddress": "456 Xô Viết Nghệ Tĩnh, Phường 25, Quận Bình Thạnh, TP.HCM",
        "district": "Bình Thạnh",
        "city": "TP.HCM",
        "coordinates": {
          "lat": 10.8012,
          "lng": 106.7123
        }
      },
      "businessInfo": {
        "businessLicense": "6789012345",
        "taxCode": "3456789012",
        "businessType": "restaurant",
        "cuisineTypes": ["vietnamese", "hotpot"]
      },
      "operatingHours": [
        {"dayOfWeek": 1, "isOpen": true, "openTime": "11:00", "closeTime": "22:00"},
        {"dayOfWeek": 2, "isOpen": true, "openTime": "11:00", "closeTime": "22:00"},
        {"dayOfWeek": 3, "isOpen": true, "openTime": "11:00", "closeTime": "22:00"},
        {"dayOfWeek": 4, "isOpen": true, "openTime": "11:00", "closeTime": "22:00"},
        {"dayOfWeek": 5, "isOpen": true, "openTime": "11:00", "closeTime": "23:00"},
        {"dayOfWeek": 6, "isOpen": true, "openTime": "11:00", "closeTime": "23:00"},
        {"dayOfWeek": 0, "isOpen": true, "openTime": "11:00", "closeTime": "22:00"}
      ],
      "delivery": {
        "isDeliveryAvailable": true,
        "deliveryRadius": 7,
        "deliveryFee": 15000,
        "freeDeliveryThreshold": 200000,
        "estimatedDeliveryTime": 35,
        "deliveryAreas": ["Bình Thạnh", "Quận 2"]
      },
      "ratings": {
        "averageRating": 4.2,
        "totalReviews": 85,
        "ratingBreakdown": {
          "5star": 40,
          "4star": 30,
          "3star": 10,
          "2star": 3,
          "1star": 2
        }
      },
      "tags": ["hotpot", "goat", "vietnamese", "mid-range"],
      "isActive": true,
      "isVerified": true,
      "isFeatured": false,
      "verificationStatus": "approved",
      "bankInfo": {
        "bankName": "VietinBank",
        "accountNumber": "6789012345",
        "accountHolder": "LẨU DÊ"
      },
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z"
});

    const restaurant6Result = db.restaurants.insertOne({
      "hostId": hostUser6Id,
      "basicInfo": {
        "name": "Sushi Bar",
        "description": "Quán sushi nhỏ gọn, phục vụ món ăn tươi ngon",
        "phone": "028-2345-6789",
        "email": "info@sushibar.com",
        "website": "https://sushibar.com",
        "images": [
          "https://example.com/restaurants/sushibar-1.jpg",
          "https://example.com/restaurants/sushibar-2.jpg"
        ],
        "logo": "https://example.com/restaurants/sushibar-logo.jpg",
        "coverImage": "https://example.com/restaurants/sushibar-cover.jpg",
        "priceRange": "mid-range"
      },
      "address": {
        "fullAddress": "789 Nguyễn Đình Chiểu, Phường 4, Quận 3, TP.HCM",
        "district": "Quận 3",
        "city": "TP.HCM",
        "coordinates": {
          "lat": 10.7801,
          "lng": 106.6889
        }
      },
      "businessInfo": {
        "businessLicense": "2345678901",
        "taxCode": "9012345678",
        "businessType": "restaurant",
        "cuisineTypes": ["japanese", "sushi"]
      },
      "operatingHours": [
        {"dayOfWeek": 1, "isOpen": true, "openTime": "11:00", "closeTime": "22:00"},
        {"dayOfWeek": 2, "isOpen": true, "openTime": "11:00", "closeTime": "22:00"},
        {"dayOfWeek": 3, "isOpen": true, "openTime": "11:00", "closeTime": "22:00"},
        {"dayOfWeek": 4, "isOpen": true, "openTime": "11:00", "closeTime": "22:00"},
        {"dayOfWeek": 5, "isOpen": true, "openTime": "11:00", "closeTime": "23:00"},
        {"dayOfWeek": 6, "isOpen": true, "openTime": "11:00", "closeTime": "23:00"},
        {"dayOfWeek": 0, "isOpen": true, "openTime": "11:00", "closeTime": "22:00"}
      ],
      "delivery": {
        "isDeliveryAvailable": true,
        "deliveryRadius": 5,
        "deliveryFee": 10000,
        "freeDeliveryThreshold": 150000,
        "estimatedDeliveryTime": 30,
        "deliveryAreas": ["Quận 3", "Quận 1"]
      },
      "ratings": {
        "averageRating": 4.6,
        "totalReviews": 120,
        "ratingBreakdown": {
          "5star": 70,
          "4star": 35,
          "3star": 10,
          "2star": 3,
          "1star": 2
        }
      },
      "tags": ["sushi", "japanese", "mid-range", "seafood"],
      "isActive": true,
      "isVerified": true,
      "isFeatured": true,
      "verificationStatus": "approved",
      "bankInfo": {
        "bankName": "Sacombank",
        "accountNumber": "2345678901",
        "accountHolder": "SUSHI BAR"
      },
      "createdAt": "2026-02-01T00:00:00.000Z",
      "updatedAt": "2026-02-01T00:00:00.000Z"
    });

    const restaurant7Result = db.restaurants.insertOne({
      "hostId": hostUser7Id,
      "basicInfo": {
        "name": "Bánh Tráng Nướng",
        "description": "Bánh tráng nướng giòn tan, đa dạng topping",
        "phone": "028-8901-2345",
        "email": "info@banhtrangnuong.com",
        "website": "https://banhtrangnuong.com",
        "images": [
          "https://example.com/restaurants/banhtrangnuong-1.jpg",
          "https://example.com/restaurants/banhtrangnuong-2.jpg"
        ],
        "logo": "https://example.com/restaurants/banhtrangnuong-logo.jpg",
        "coverImage": "https://example.com/restaurants/banhtrangnuong-cover.jpg",
        "priceRange": "budget"
      },
      "address": {
        "fullAddress": "123 Tô Hiến Thành, Phường 13, Quận 10, TP.HCM",
        "district": "Quận 10",
        "city": "TP.HCM",
        "coordinates": {
          "lat": 10.7712,
          "lng": 106.6601
        }
      },
      "businessInfo": {
        "businessLicense": "8901234567",
        "taxCode": "6789012345",
        "businessType": "restaurant",
        "cuisineTypes": ["vietnamese", "street_food"]
      },
      "operatingHours": [
        {"dayOfWeek": 1, "isOpen": true, "openTime": "15:00", "closeTime": "22:00"},
        {"dayOfWeek": 2, "isOpen": true, "openTime": "15:00", "closeTime": "22:00"},
        {"dayOfWeek": 3, "isOpen": true, "openTime": "15:00", "closeTime": "22:00"},
        {"dayOfWeek": 4, "isOpen": true, "openTime": "15:00", "closeTime": "22:00"},
        {"dayOfWeek": 5, "isOpen": true, "openTime": "15:00", "closeTime": "23:00"},
        {"dayOfWeek": 6, "isOpen": true, "openTime": "15:00", "closeTime": "23:00"},
        {"dayOfWeek": 0, "isOpen": true, "openTime": "15:00", "closeTime": "22:00"}
      ],
      "delivery": {
        "isDeliveryAvailable": true,
        "deliveryRadius": 3,
        "deliveryFee": 5000,
        "freeDeliveryThreshold": 50000,
        "estimatedDeliveryTime": 20,
        "deliveryAreas": ["Quận 10"]
      },
      "ratings": {
        "averageRating": 4.1,
        "totalReviews": 50,
        "ratingBreakdown": {
          "5star": 20,
          "4star": 15,
          "3star": 10,
          "2star": 3,
          "1star": 2
        }
      },
      "tags": ["banh_trang_nuong", "vietnamese", "budget", "street_food"],
      "isActive": true,
      "isVerified": true,
      "isFeatured": false,
      "verificationStatus": "approved",
      "bankInfo": {
        "bankName": "BIDV",
        "accountNumber": "8901234567",
        "accountHolder": "BÁNH TRÁNG NƯỚNG"
      },
      "createdAt": "2026-03-01T00:00:00.000Z",
      "updatedAt": "2026-03-01T00:00:00.000Z"
    });

    const restaurant8Result = db.restaurants.insertOne({
      "hostId": hostUser1Id,
      "basicInfo": {
        "name": "Indian Curry",
        "description": "Ẩm thực Ấn Độ với cà ri thơm ngon và bánh naan",
        "phone": "028-4567-8901",
        "email": "contact@indiancurry.com",
        "website": "https://indiancurry.com",
        "images": [
          "https://example.com/restaurants/indiancurry-1.jpg",
          "https://example.com/restaurants/indiancurry-2.jpg"
        ],
        "logo": "https://example.com/restaurants/indiancurry-logo.jpg",
        "coverImage": "https://example.com/restaurants/indiancurry-cover.jpg",
        "priceRange": "mid-range"
      },
      "address": {
        "fullAddress": "456 Nguyễn Thị Minh Khai, Phường 5, Quận 3, TP.HCM",
        "district": "Quận 3",
        "city": "TP.HCM",
        "coordinates": {
          "lat": 10.7821,
          "lng": 106.6865
        }
      },
      "businessInfo": {
        "businessLicense": "4567890123",
        "taxCode": "2345678901",
        "businessType": "restaurant",
        "cuisineTypes": ["indian", "curry"]
      },
      "operatingHours": [
        {"dayOfWeek": 1, "isOpen": true, "openTime": "11:00", "closeTime": "22:00"},
        {"dayOfWeek": 2, "isOpen": true, "openTime": "11:00", "closeTime": "22:00"},
        {"dayOfWeek": 3, "isOpen": true, "openTime": "11:00", "closeTime": "22:00"},
        {"dayOfWeek": 4, "isOpen": true, "openTime": "11:00", "closeTime": "22:00"},
        {"dayOfWeek": 5, "isOpen": true, "openTime": "11:00", "closeTime": "23:00"},
        {"dayOfWeek": 6, "isOpen": true, "openTime": "11:00", "closeTime": "23:00"},
        {"dayOfWeek": 0, "isOpen": true, "openTime": "11:00", "closeTime": "22:00"}
      ],
      "delivery": {
        "isDeliveryAvailable": true,
        "deliveryRadius": 6,
        "deliveryFee": 12000,
        "freeDeliveryThreshold": 180000,
        "estimatedDeliveryTime": 30,
        "deliveryAreas": ["Quận 3", "Quận 1", "Quận 10"]
      },
      "ratings": {
        "averageRating": 4.3,
        "totalReviews": 95,
        "ratingBreakdown": {
          "5star": 45,
          "4star": 35,
          "3star": 10,
          "2star": 3,
          "1star": 2
        }
      },
      "tags": ["indian", "curry", "mid-range", "spicy"],
      "isActive": true,
      "isVerified": true,
      "isFeatured": true,
      "verificationStatus": "approved",
      "bankInfo": {
        "bankName": "MBBank",
        "accountNumber": "4567890123",
        "accountHolder": "INDIAN CURRY"
      },
      "createdAt": "2026-04-01T00:00:00.000Z",
      "updatedAt": "2026-04-01T00:00:00.000Z"
    });

    const restaurant9Result = db.restaurants.insertOne({
      "hostId": hostUser2Id,
      "basicInfo": {
        "name": "Nhà Hàng Chay An Lạc",
        "description": "Ẩm thực chay thanh tịnh, tốt cho sức khỏe",
        "phone": "028-0123-4567",
        "email": "info@chayanlac.com",
        "website": "https://chayanlac.com",
        "images": [
          "https://example.com/restaurants/chayanlac-1.jpg",
          "https://example.com/restaurants/chayanlac-2.jpg"
        ],
        "logo": "https://example.com/restaurants/chayanlac-logo.jpg",
        "coverImage": "https://example.com/restaurants/chayanlac-cover.jpg",
        "priceRange": "mid-range"
      },
      "address": {
        "fullAddress": "789 Lê Văn Sỹ, Phường 14, Quận 3, TP.HCM",
        "district": "Quận 3",
        "city": "TP.HCM",
        "coordinates": {
          "lat": 10.7865,
          "lng": 106.6823
        }
      },
      "businessInfo": {
        "businessLicense": "0123456789",
        "taxCode": "8901234567",
        "businessType": "restaurant",
        "cuisineTypes": ["vegan", "vegetarian"]
      },
      "operatingHours": [
        {"dayOfWeek": 1, "isOpen": true, "openTime": "09:00", "closeTime": "21:00"},
        {"dayOfWeek": 2, "isOpen": true, "openTime": "09:00", "closeTime": "21:00"},
        {"dayOfWeek": 3, "isOpen": true, "openTime": "09:00", "closeTime": "21:00"},
        {"dayOfWeek": 4, "isOpen": true, "openTime": "09:00", "closeTime": "21:00"},
        {"dayOfWeek": 5, "isOpen": true, "openTime": "09:00", "closeTime": "22:00"},
        {"dayOfWeek": 6, "isOpen": true, "openTime": "09:00", "closeTime": "22:00"},
        {"dayOfWeek": 0, "isOpen": true, "openTime": "09:00", "closeTime": "21:00"}
      ],
      "delivery": {
        "isDeliveryAvailable": true,
        "deliveryRadius": 5,
        "deliveryFee": 10000,
        "freeDeliveryThreshold": 150000,
        "estimatedDeliveryTime": 25,
        "deliveryAreas": ["Quận 3", "Quận 10"]
      },
      "ratings": {
        "averageRating": 4.4,
        "totalReviews": 70,
        "ratingBreakdown": {
          "5star": 35,
          "4star": 25,
          "3star": 7,
          "2star": 2,
          "1star": 1
        }
      },
      "tags": ["vegan", "vegetarian", "mid-range", "healthy"],
      "isActive": true,
      "isVerified": true,
      "isFeatured": false,
      "verificationStatus": "approved",
      "bankInfo": {
        "bankName": "Vietcombank",
        "accountNumber": "0123456789",
        "accountHolder": "NHÀ HÀNG CHAY AN LẠC"
      },
      "createdAt": "2026-05-01T00:00:00.000Z",
      "updatedAt": "2026-05-01T00:00:00.000Z"
    });

    const restaurant10Result = db.restaurants.insertOne({
      "hostId": hostUser3Id,
      "basicInfo": {
        "name": "Hamburger Haven",
        "description": "Burger ngon, nguyên liệu tươi mới mỗi ngày",
        "phone": "028-5678-9012",
        "email": "contact@hamburgerhaven.com",
        "website": "https://hamburgerhaven.com",
        "images": [
          "https://example.com/restaurants/hamburgerhaven-1.jpg",
          "https://example.com/restaurants/hamburgerhaven-2.jpg"
        ],
        "logo": "https://example.com/restaurants/hamburgerhaven-logo.jpg",
        "coverImage": "https://example.com/restaurants/hamburgerhaven-cover.jpg",
        "priceRange": "mid-range"
      },
      "address": {
        "fullAddress": "123 Phạm Văn Đồng, Phường Linh Trung, TP. Thủ Đức, TP.HCM",
        "district": "Thủ Đức",
        "city": "TP.HCM",
        "coordinates": {
          "lat": 10.8498,
          "lng": 106.7712
        }
      },
      "businessInfo": {
        "businessLicense": "5678901234",
        "taxCode": "3456789012",
        "businessType": "restaurant",
        "cuisineTypes": ["fast_food", "american"]
      },
      "operatingHours": [
        {"dayOfWeek": 1, "isOpen": true, "openTime": "10:00", "closeTime": "22:00"},
        {"dayOfWeek": 2, "isOpen": true, "openTime": "10:00", "closeTime": "22:00"},
        {"dayOfWeek": 3, "isOpen": true, "openTime": "10:00", "closeTime": "22:00"},
        {"dayOfWeek": 4, "isOpen": true, "openTime": "10:00", "closeTime": "22:00"},
        {"dayOfWeek": 5, "isOpen": true, "openTime": "10:00", "closeTime": "23:00"},
        {"dayOfWeek": 6, "isOpen": true, "openTime": "10:00", "closeTime": "23:00"},
        {"dayOfWeek": 0, "isOpen": true, "openTime": "10:00", "closeTime": "22:00"}
      ],
      "delivery": {
        "isDeliveryAvailable": true,
        "deliveryRadius": 8,
        "deliveryFee": 15000,
        "freeDeliveryThreshold": 200000,
        "estimatedDeliveryTime": 35,
        "deliveryAreas": ["Thủ Đức", "Quận 9"]
      },
      "ratings": {
        "averageRating": 4.2,
        "totalReviews": 100,
        "ratingBreakdown": {
          "5star": 45,
          "4star": 35,
          "3star": 15,
          "2star": 3,
          "1star": 2
        }
      },
      "tags": ["burger", "fast_food", "mid-range", "american"],
      "isActive": true,
      "isVerified": true,
      "isFeatured": true,
      "verificationStatus": "approved",
      "bankInfo": {
        "bankName": "Techcombank",
        "accountNumber": "5678901234",
        "accountHolder": "HAMBURGER HAVEN"
      },
      "createdAt": "2026-06-01T00:00:00.000Z",
      "updatedAt": "2026-06-01T00:00:00.000Z"
        });

    const restaurant11Result = db.restaurants.insertOne({
      "hostId": hostUser4Id,
      "basicInfo": {
        "name": "Lẩu Thái Lan",
        "description": "Lẩu Thái chua cay, đậm đà hương vị Đông Nam Á",
        "phone": "028-9012-5678",
        "email": "contact@lauthailan.com",
        "website": "https://lauthailan.com",
        "images": [
          "https://example.com/restaurants/lauthailan-1.jpg",
          "https://example.com/restaurants/lauthailan-2.jpg"
        ],
        "logo": "https://example.com/restaurants/lauthailan-logo.jpg",
        "coverImage": "https://example.com/restaurants/lauthailan-cover.jpg",
        "priceRange": "mid-range"
      },
      "address": {
        "fullAddress": "789 Bùi Thị Xuân, Phường 1, Quận Tân Bình, TP.HCM",
        "district": "Tân Bình",
        "city": "TP.HCM",
        "coordinates": {
          "lat": 10.7923,
          "lng": 106.6501
        }
      },
      "businessInfo": {
        "businessLicense": "9012345678",
        "taxCode": "5678901234",
        "businessType": "restaurant",
        "cuisineTypes": ["thai", "hotpot"]
      },
      "operatingHours": [
        {"dayOfWeek": 1, "isOpen": true, "openTime": "11:00", "closeTime": "22:00"},
        {"dayOfWeek": 2, "isOpen": true, "openTime": "11:00", "closeTime": "22:00"},
        {"dayOfWeek": 3, "isOpen": true, "openTime": "11:00", "closeTime": "22:00"},
        {"dayOfWeek": 4, "isOpen": true, "openTime": "11:00", "closeTime": "22:00"},
        {"dayOfWeek": 5, "isOpen": true, "openTime": "11:00", "closeTime": "23:00"},
        {"dayOfWeek": 6, "isOpen": true, "openTime": "11:00", "closeTime": "23:00"},
        {"dayOfWeek": 0, "isOpen": true, "openTime": "11:00", "closeTime": "22:00"}
      ],
      "delivery": {
        "isDeliveryAvailable": true,
        "deliveryRadius": 6,
        "deliveryFee": 12000,
        "freeDeliveryThreshold": 180000,
        "estimatedDeliveryTime": 30,
        "deliveryAreas": ["Tân Bình", "Quận 11"]
      },
      "ratings": {
        "averageRating": 4.3,
        "totalReviews": 85,
        "ratingBreakdown": {
          "5star": 40,
          "4star": 30,
          "3star": 10,
          "2star": 3,
          "1star": 2
        }
      },
      "tags": ["thai", "hotpot", "mid-range", "spicy"],
      "isActive": true,
      "isVerified": true,
      "isFeatured": false,
      "verificationStatus": "approved",
      "bankInfo": {
        "bankName": "ACB",
        "accountNumber": "9012345678",
        "accountHolder": "LẨU THÁI LAN"
      },
      "createdAt": "2026-07-01T00:00:00.000Z",
      "updatedAt": "2026-07-01T00:00:00.000Z"
    });

    const restaurant12Result = db.restaurants.insertOne({
      "hostId": hostUser5Id,
      "basicInfo": {
        "name": "Trà Đào Nhà Làm",
        "description": "Trà đào tươi mát, pha chế thủ công",
        "phone": "028-2345-9012",
        "email": "info@tradaonhalam.com",
        "website": "https://tradaonhalam.com",
        "images": [
          "https://example.com/restaurants/tradaonhalam-1.jpg",
          "https://example.com/restaurants/tradaonhalam-2.jpg"
        ],
        "logo": "https://example.com/restaurants/tradaonhalam-logo.jpg",
        "coverImage": "https://example.com/restaurants/tradaonhalam-cover.jpg",
        "priceRange": "budget"
      },
      "address": {
        "fullAddress": "123 Nguyễn Trãi, Phường 2, Quận 5, TP.HCM",
        "district": "Quận 5",
        "city": "TP.HCM",
        "coordinates": {
          "lat": 10.7589,
          "lng": 106.6734
        }
      },
      "businessInfo": {
        "businessLicense": "2345678901",
        "taxCode": "9012345678",
        "businessType": "cafe",
        "cuisineTypes": ["beverages", "tea"]
      },
      "operatingHours": [
        {"dayOfWeek": 1, "isOpen": true, "openTime": "09:00", "closeTime": "22:00"},
        {"dayOfWeek": 2, "isOpen": true, "openTime": "09:00", "closeTime": "22:00"},
        {"dayOfWeek": 3, "isOpen": true, "openTime": "09:00", "closeTime": "22:00"},
        {"dayOfWeek": 4, "isOpen": true, "openTime": "09:00", "closeTime": "22:00"},
        {"dayOfWeek": 5, "isOpen": true, "openTime": "09:00", "closeTime": "23:00"},
        {"dayOfWeek": 6, "isOpen": true, "openTime": "09:00", "closeTime": "23:00"},
        {"dayOfWeek": 0, "isOpen": true, "openTime": "09:00", "closeTime": "22:00"}
      ],
      "delivery": {
        "isDeliveryAvailable": true,
        "deliveryRadius": 4,
        "deliveryFee": 8000,
        "freeDeliveryThreshold": 70000,
        "estimatedDeliveryTime": 20,
        "deliveryAreas": ["Quận 5", "Quận 1"]
      },
      "ratings": {
        "averageRating": 4.5,
        "totalReviews": 90,
        "ratingBreakdown": {
          "5star": 50,
          "4star": 30,
          "3star": 7,
          "2star": 2,
          "1star": 1
        }
      },
      "tags": ["tea", "beverages", "budget", "refreshing"],
      "isActive": true,
      "isVerified": true,
      "isFeatured": true,
      "verificationStatus": "approved",
      "bankInfo": {
        "bankName": "Vietcombank",
        "accountNumber": "2345678901",
        "accountHolder": "TRÀ ĐÀO NHÀ LÀM"
      },
      "createdAt": "2026-08-01T00:00:00.000Z",
      "updatedAt": "2026-08-01T00:00:00.000Z"
    });

    const restaurant13Result = db.restaurants.insertOne({
      "hostId": hostUser6Id,
      "basicInfo": {
        "name": "Nhà Hàng Ý",
        "description": "Ẩm thực Ý với pizza và pasta chính gốc",
        "phone": "028-6789-2345",
        "email": "contact@nhahangy.com",
        "website": "https://nhahangy.com",
        "images": [
          "https://example.com/restaurants/nhahangy-1.jpg",
          "https://example.com/restaurants/nhahangy-2.jpg"
        ],
        "logo": "https://example.com/restaurants/nhahangy-logo.jpg",
        "coverImage": "https://example.com/restaurants/nhahangy-cover.jpg",
        "priceRange": "mid-range"
      },
      "address": {
        "fullAddress": "456 Lê Lợi, Phường Bến Thành, Quận 1, TP.HCM",
        "district": "Quận 1",
        "city": "TP.HCM",
        "coordinates": {
          "lat": 10.7712,
          "lng": 106.6987
        }
      },
      "businessInfo": {
        "businessLicense": "6789012345",
        "taxCode": "2345678901",
        "businessType": "restaurant",
        "cuisineTypes": ["italian", "pizza"]
      },
      "operatingHours": [
        {"dayOfWeek": 1, "isOpen": true, "openTime": "10:00", "closeTime": "22:00"},
        {"dayOfWeek": 2, "isOpen": true, "openTime": "10:00", "closeTime": "22:00"},
        {"dayOfWeek": 3, "isOpen": true, "openTime": "10:00", "closeTime": "22:00"},
        {"dayOfWeek": 4, "isOpen": true, "openTime": "10:00", "closeTime": "22:00"},
        {"dayOfWeek": 5, "isOpen": true, "openTime": "10:00", "closeTime": "23:00"},
        {"dayOfWeek": 6, "isOpen": true, "openTime": "10:00", "closeTime": "23:00"},
        {"dayOfWeek": 0, "isOpen": true, "openTime": "10:00", "closeTime": "22:00"}
      ],
      "delivery": {
        "isDeliveryAvailable": true,
        "deliveryRadius": 7,
        "deliveryFee": 15000,
        "freeDeliveryThreshold": 200000,
        "estimatedDeliveryTime": 35,
        "deliveryAreas": ["Quận 1", "Quận 3"]
      },
      "ratings": {
        "averageRating": 4.7,
        "totalReviews": 150,
        "ratingBreakdown": {
          "5star": 90,
          "4star": 40,
          "3star": 15,
          "2star": 3,
          "1star": 2
        }
      },
      "tags": ["italian", "pizza", "mid-range", "pasta"],
      "isActive": true,
      "isVerified": true,
      "isFeatured": true,
      "verificationStatus": "approved",
      "bankInfo": {
        "bankName": "Sacombank",
        "accountNumber": "6789012345",
        "accountHolder": "NHÀ HÀNG Ý"
      },
      "createdAt": "2026-09-01T00:00:00.000Z",
      "updatedAt": "2026-09-01T00:00:00.000Z"
    });

    const restaurant14Result = db.restaurants.insertOne({
      "hostId": hostUser7Id,
      "basicInfo": {
        "name": "Bún Chả Hà Nội",
        "description": "Bún chả truyền thống Hà Nội với nước mắm pha chuẩn vị",
        "phone": "028-0123-6789",
        "email": "info@bunchahanoi.com",
        "website": "https://bunchahanoi.com",
        "images": [
          "https://example.com/restaurants/bunchahanoi-1.jpg",
          "https://example.com/restaurants/bunchahanoi-2.jpg"
        ],
        "logo": "https://example.com/restaurants/bunchahanoi-logo.jpg",
        "coverImage": "https://example.com/restaurants/bunchahanoi-cover.jpg",
        "priceRange": "budget"
      },
      "address": {
        "fullAddress": "789 Trần Phú, Phường 7, Quận 5, TP.HCM",
        "district": "Quận 5",
        "city": "TP.HCM",
        "coordinates": {
          "lat": 10.7563,
          "lng": 106.6712
        }
      },
      "businessInfo": {
        "businessLicense": "0123456789",
        "taxCode": "6789012345",
        "businessType": "restaurant",
        "cuisineTypes": ["vietnamese", "noodles"]
      },
      "operatingHours": [
        {"dayOfWeek": 1, "isOpen": true, "openTime": "07:00", "closeTime": "20:00"},
        {"dayOfWeek": 2, "isOpen": true, "openTime": "07:00", "closeTime": "20:00"},
        {"dayOfWeek": 3, "isOpen": true, "openTime": "07:00", "closeTime": "20:00"},
        {"dayOfWeek": 4, "isOpen": true, "openTime": "07:00", "closeTime": "20:00"},
        {"dayOfWeek": 5, "isOpen": true, "openTime": "07:00", "closeTime": "20:00"},
        {"dayOfWeek": 6, "isOpen": true, "openTime": "07:00", "closeTime": "20:00"},
        {"dayOfWeek": 0, "isOpen": true, "openTime": "07:00", "closeTime": "20:00"}
      ],
      "delivery": {
        "isDeliveryAvailable": true,
        "deliveryRadius": 3,
        "deliveryFee": 5000,
        "freeDeliveryThreshold": 50000,
        "estimatedDeliveryTime": 20,
        "deliveryAreas": ["Quận 5"]
      },
      "ratings": {
        "averageRating": 4.2,
        "totalReviews": 60,
        "ratingBreakdown": {
          "5star": 25,
          "4star": 20,
          "3star": 10,
          "2star": 3,
          "1star": 2
        }
      },
      "tags": ["bun_cha", "vietnamese", "budget", "noodles"],
      "isActive": true,
      "isVerified": true,
      "isFeatured": false,
      "verificationStatus": "approved",
      "bankInfo": {
        "bankName": "Agribank",
        "accountNumber": "0123456789",
        "accountHolder": "BÚN CHẢ HÀ NỘI"
      },
      "createdAt": "2026-10-01T00:00:00.000Z",
      "updatedAt": "2026-10-01T00:00:00.000Z"
    });

    const restaurant15Result = db.restaurants.insertOne({
      "hostId": hostUser1Id,
      "basicInfo": {
        "name": "Nhà Hàng Pháp",
        "description": "Ẩm thực Pháp tinh tế với rượu vang và phô mai",
        "phone": "028-3456-0123",
        "email": "contact@nhahangphap.com",
        "website": "https://nhahangphap.com",
        "images": [
          "https://example.com/restaurants/nhahangphap-1.jpg",
          "https://example.com/restaurants/nhahangphap-2.jpg"
        ],
        "logo": "https://example.com/restaurants/nhahangphap-logo.jpg",
        "coverImage": "https://example.com/restaurants/nhahangphap-cover.jpg",
        "priceRange": "upscale"
      },
      "address": {
        "fullAddress": "56 Đồng Khởi, Phường Bến Nghé, Quận 1, TP.HCM",
        "district": "Quận 1",
        "city": "TP.HCM",
        "coordinates": {
          "lat": 10.7756,
          "lng": 106.7012
        }
      },
      "businessInfo": {
        "businessLicense": "3456789012",
        "taxCode": "0123456789",
        "businessType": "restaurant",
        "cuisineTypes": ["french", "fine_dining"]
      },
      "operatingHours": [
        {"dayOfWeek": 1, "isOpen": true, "openTime": "11:00", "closeTime": "23:00"},
        {"dayOfWeek": 2, "isOpen": true, "openTime": "11:00", "closeTime": "23:00"},
        {"dayOfWeek": 3, "isOpen": true, "openTime": "11:00", "closeTime": "23:00"},
        {"dayOfWeek": 4, "isOpen": true, "openTime": "11:00", "closeTime": "23:00"},
        {"dayOfWeek": 5, "isOpen": true, "openTime": "11:00", "closeTime": "00:00"},
        {"dayOfWeek": 6, "isOpen": true, "openTime": "11:00", "closeTime": "00:00"},
        {"dayOfWeek": 0, "isOpen": true, "openTime": "11:00", "closeTime": "23:00"}
      ],
      "delivery": {
        "isDeliveryAvailable": false,
        "deliveryRadius": 0,
        "deliveryFee": 0,
        "freeDeliveryThreshold": 0,
        "estimatedDeliveryTime": 0,
        "deliveryAreas": []
      },
      "ratings": {
        "averageRating": 4.9,
        "totalReviews": 180,
        "ratingBreakdown": {
          "5star": 140,
          "4star": 30,
          "3star": 7,
          "2star": 2,
          "1star": 1
        }
      },
      "tags": ["french", "upscale", "fine_dining", "wine"],
      "isActive": true,
      "isVerified": true,
      "isFeatured": true,
      "verificationStatus": "approved",
      "bankInfo": {
        "bankName": "Vietcombank",
        "accountNumber": "3456789012",
        "accountHolder": "NHÀ HÀNG PHÁP"
      },
      "createdAt": "2026-11-01T00:00:00.000Z",
      "updatedAt": "2026-11-01T00:00:00.000Z"
    });

    const restaurant16Result = db.restaurants.insertOne({
      "hostId": hostUser2Id,
      "basicInfo": {
        "name": "Gỏi Cuốn Tôm Thịt",
        "description": "Gỏi cuốn tươi ngon, đậm chất Việt Nam",
        "phone": "028-8901-3456",
        "email": "info@goicuontomthit.com",
        "website": "https://goicuontomthit.com",
        "images": [
          "https://example.com/restaurants/goicuontomthit-1.jpg",
          "https://example.com/restaurants/goicuontomthit-2.jpg"
        ],
        "logo": "https://example.com/restaurants/goicuontomthit-logo.jpg",
        "coverImage": "https://example.com/restaurants/goicuontomthit-cover.jpg",
        "priceRange": "budget"
      },
      "address": {
        "fullAddress": "123 Nguyễn Văn Cừ, Phường 2, Quận 5, TP.HCM",
        "district": "Quận 5",
        "city": "TP.HCM",
        "coordinates": {
          "lat": 10.7589,
          "lng": 106.6998
        }
      },
      "businessInfo": {
        "businessLicense": "8901234567",
        "taxCode": "3456789012",
        "businessType": "restaurant",
        "cuisineTypes": ["vietnamese", "street_food"]
      },
      "operatingHours": [
        {"dayOfWeek": 1, "isOpen": true, "openTime": "10:00", "closeTime": "20:00"},
        {"dayOfWeek": 2, "isOpen": true, "openTime": "10:00", "closeTime": "20:00"},
        {"dayOfWeek": 3, "isOpen": true, "openTime": "10:00", "closeTime": "20:00"},
        {"dayOfWeek": 4, "isOpen": true, "openTime": "10:00", "closeTime": "20:00"},
        {"dayOfWeek": 5, "isOpen": true, "openTime": "10:00", "closeTime": "20:00"},
        {"dayOfWeek": 6, "isOpen": true, "openTime": "10:00", "closeTime": "20:00"},
        {"dayOfWeek": 0, "isOpen": true, "openTime": "10:00", "closeTime": "20:00"}
      ],
      "delivery": {
        "isDeliveryAvailable": true,
        "deliveryRadius": 3,
        "deliveryFee": 5000,
        "freeDeliveryThreshold": 50000,
        "estimatedDeliveryTime": 20,
        "deliveryAreas": ["Quận 5"]
      },
      "ratings": {
        "averageRating": 4.1,
        "totalReviews": 45,
        "ratingBreakdown": {
          "5star": 20,
          "4star": 15,
          "3star": 7,
          "2star": 2,
          "1star": 1
        }
      },
      "tags": ["goi_cuon", "vietnamese", "budget", "street_food"],
      "isActive": true,
      "isVerified": true,
      "isFeatured": false,
      "verificationStatus": "approved",
      "bankInfo": {
        "bankName": "BIDV",
        "accountNumber": "8901234567",
        "accountHolder": "GỎI CUỐN TÔM THỊT"
      },
      "createdAt": "2026-12-01T00:00:00.000Z",
      "updatedAt": "2026-12-01T00:00:00.000Z"
    });

    const restaurant17Result = db.restaurants.insertOne({
      "hostId": hostUser3Id,
      "basicInfo": {
        "name": "Korean Fried Chicken",
        "description": "Gà rán Hàn Quốc giòn rụm, cay ngon",
        "phone": "028-4567-1234",
        "email": "contact@koreanfriedchicken.com",
        "website": "https://koreanfriedchicken.com",
        "images": [
          "https://example.com/restaurants/koreanfriedchicken-1.jpg",
          "https://example.com/restaurants/koreanfriedchicken-2.jpg"
        ],
        "logo": "https://example.com/restaurants/koreanfriedchicken-logo.jpg",
        "coverImage": "https://example.com/restaurants/koreanfriedchicken-cover.jpg",
        "priceRange": "mid-range"
      },
      "address": {
        "fullAddress": "789 Cách Mạng Tháng 8, Phường 6, Quận Tân Bình, TP.HCM",
        "district": "Tân Bình",
        "city": "TP.HCM",
        "coordinates": {
          "lat": 10.7956,
          "lng": 106.6543
        }
      },
      "businessInfo": {
        "businessLicense": "4567890123",
        "taxCode": "8901234567",
        "businessType": "restaurant",
        "cuisineTypes": ["korean", "fast_food"]
      },
      "operatingHours": [
        {"dayOfWeek": 1, "isOpen": true, "openTime": "11:00", "closeTime": "22:00"},
        {"dayOfWeek": 2, "isOpen": true, "openTime": "11:00", "closeTime": "22:00"},
        {"dayOfWeek": 3, "isOpen": true, "openTime": "11:00", "closeTime": "22:00"},
        {"dayOfWeek": 4, "isOpen": true, "openTime": "11:00", "closeTime": "22:00"},
        {"dayOfWeek": 5, "isOpen": true, "openTime": "11:00", "closeTime": "23:00"},
        {"dayOfWeek": 6, "isOpen": true, "openTime": "11:00", "closeTime": "23:00"},
        {"dayOfWeek": 0, "isOpen": true, "openTime": "11:00", "closeTime": "22:00"}
      ],
      "delivery": {
        "isDeliveryAvailable": true,
        "deliveryRadius": 7,
        "deliveryFee": 15000,
        "freeDeliveryThreshold": 200000,
        "estimatedDeliveryTime": 35,
        "deliveryAreas": ["Tân Bình", "Quận 11", "Quận 12"]
      },
      "ratings": {
        "averageRating": 4.4,
        "totalReviews": 110,
        "ratingBreakdown": {
          "5star": 50,
          "4star": 40,
          "3star": 15,
          "2star": 3,
          "1star": 2
        }
      },
      "tags": ["korean", "fried_chicken", "mid-range", "spicy"],
      "isActive": true,
      "isVerified": true,
      "isFeatured": true,
      "verificationStatus": "approved",
      "bankInfo": {
        "bankName": "Vietcombank",
        "accountNumber": "4567890123",
        "accountHolder": "KOREAN FRIED CHICKEN"
      },
      "createdAt": "2027-01-01T00:00:00.000Z",
      "updatedAt": "2027-01-01T00:00:00.000Z"
    });

    const restaurant18Result = db.restaurants.insertOne({
      "hostId": hostUser4Id,
      "basicInfo": {
        "name": "Bánh Canh Cua",
        "description": "Bánh canh cua đậm đà, nước dùng thơm ngon",
        "phone": "028-1234-5678",
        "email": "info@banhcanhcua.com",
        "website": "https://banhcanhcua.com",
        "images": [
          "https://example.com/restaurants/banhcanhcua-1.jpg",
          "https://example.com/restaurants/banhcanhcua-2.jpg"
        ],
        "logo": "https://example.com/restaurants/banhcanhcua-logo.jpg",
        "coverImage": "https://example.com/restaurants/banhcanhcua-cover.jpg",
        "priceRange": "budget"
      },
      "address": {
        "fullAddress": "123 Lê Văn Sỹ, Phường 13, Quận 3, TP.HCM",
        "district": "Quận 3",
        "city": "TP.HCM",
        "coordinates": {
          "lat": 10.7865,
          "lng": 106.6823
        }
      },
      "businessInfo": {
        "businessLicense": "1234567890",
        "taxCode": "4567890123",
        "businessType": "restaurant",
        "cuisineTypes": ["vietnamese", "noodles"]
      },
      "operatingHours": [
        {"dayOfWeek": 1, "isOpen": true, "openTime": "07:00", "closeTime": "20:00"},
        {"dayOfWeek": 2, "isOpen": true, "openTime": "07:00", "closeTime": "20:00"},
        {"dayOfWeek": 3, "isOpen": true, "openTime": "07:00", "closeTime": "20:00"},
        {"dayOfWeek": 4, "isOpen": true, "openTime": "07:00", "closeTime": "20:00"},
        {"dayOfWeek": 5, "isOpen": true, "openTime": "07:00", "closeTime": "20:00"},
        {"dayOfWeek": 6, "isOpen": true, "openTime": "07:00", "closeTime": "20:00"},
        {"dayOfWeek": 0, "isOpen": true, "openTime": "07:00", "closeTime": "20:00"}
      ],
      "delivery": {
        "isDeliveryAvailable": true,
        "deliveryRadius": 4,
        "deliveryFee": 8000,
        "freeDeliveryThreshold": 70000,
        "estimatedDeliveryTime": 25,
        "deliveryAreas": ["Quận 3", "Quận 10"]
      },
      "ratings": {
        "averageRating": 4.3,
        "totalReviews": 70,
        "ratingBreakdown": {
          "5star": 30,
          "4star": 25,
          "3star": 10,
          "2star": 3,
          "1star": 2
        }
      },
      "tags": ["banh_canh", "vietnamese", "budget", "noodles"],
      "isActive": true,
      "isVerified": true,
      "isFeatured": false,
      "verificationStatus": "approved",
      "bankInfo": {
        "bankName": "VietinBank",
        "accountNumber": "1234567890",
        "accountHolder": "BÁNH CANH CUA"
      },
      "createdAt": "2027-02-01T00:00:00.000Z",
      "updatedAt": "2027-02-01T00:00:00.000Z"
    });

    const restaurant19Result = db.restaurants.insertOne({
      "hostId": hostUser1Id,
        "basicInfo": {
          "name": "Pizza House Saigon",
          "description": "Nhà hàng pizza số 1 TP.HCM với công thức Italy chính thống",
          "phone": "028-3456-7890",
          "email": "info@pizzahouse.com",
          "website": "https://pizzahouse.com",
          "images": [
            "https://example.com/restaurants/pizza-house-1.jpg",
            "https://example.com/restaurants/pizza-house-2.jpg"
          ],
          "logo": "https://example.com/restaurants/pizza-house-logo.jpg",
          "coverImage": "https://example.com/restaurants/pizza-house-cover.jpg",
          "priceRange": "mid-range" // Khoảng giá trung bình
        },
        "address": {
          "fullAddress": "789 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM",
          "district": "Quận 1",
          "city": "TP.HCM",
          "coordinates": {
            "lat": 10.7745,
            "lng": 106.7058
          }
        },
        "businessInfo": {
          "businessLicense": "0123456789",
          "taxCode": "0987654321",
          "businessType": "restaurant",
          "cuisineTypes": ["italian", "pizza", "western"]
        },
        "operatingHours": [
          {"dayOfWeek": 1, "isOpen": true, "openTime": "10:00", "closeTime": "22:00"},
          {"dayOfWeek": 2, "isOpen": true, "openTime": "10:00", "closeTime": "22:00"},
          {"dayOfWeek": 3, "isOpen": true, "openTime": "10:00", "closeTime": "22:00"},
          {"dayOfWeek": 4, "isOpen": true, "openTime": "10:00", "closeTime": "22:00"},
          {"dayOfWeek": 5, "isOpen": true, "openTime": "10:00", "closeTime": "23:00"},
          {"dayOfWeek": 6, "isOpen": true, "openTime": "09:00", "closeTime": "23:00"},
          {"dayOfWeek": 0, "isOpen": true, "openTime": "09:00", "closeTime": "22:00"}
        ],
        "delivery": {
          "isDeliveryAvailable": true,
          "deliveryRadius": 10,
          "deliveryFee": 15000,
          "freeDeliveryThreshold": 200000,
          "estimatedDeliveryTime": 30,
          "deliveryAreas": ["Quận 1", "Quận 3", "Quận 5", "Quận 10"]
        },
        "ratings": {
          "averageRating": 4.5,
          "totalReviews": 127,
          "ratingBreakdown": {
            "5star": 65,
            "4star": 45,
            "3star": 12,
            "2star": 3,
            "1star": 2
          }
        },
        "tags": ["pizza", "italian", "fast_delivery", "popular"],
        "isActive": true,
        "isVerified": true,
        "isFeatured": true,
        "verificationStatus": "approved",
        "bankInfo": {
          "bankName": "Vietcombank",
          "accountNumber": "1234567890",
          "accountHolder": "PIZZA HOUSE SAIGON"
        },
        "createdAt": "2024-01-15T00:00:00.000Z",
        "updatedAt": "2024-10-01T00:00:00.000Z"
    });

    const restaurant20Result = db.restaurants.insertOne({
      "hostId": hostUser2Id,
        "basicInfo": {
          "name": "Phở Sài Gòn",
          "description": "Hương vị phở truyền thống Việt Nam",
          "phone": "028-9876-5432",
          "email": "contact@phosaigon.com",
          "website": "https://phosaigon.com",
          "images": [
            "https://example.com/restaurants/pho-saigon-1.jpg",
            "https://example.com/restaurants/pho-saigon-2.jpg"
          ],
          "logo": "https://example.com/restaurants/pho-saigon-logo.jpg",
          "coverImage": "https://example.com/restaurants/pho-saigon-cover.jpg",
          "priceRange": "budget" // Khoảng giá trung bình
        },
        "address": {
          "fullAddress": "456 Lê Văn Sỹ, Phường 14, Quận 3, TP.HCM",
          "district": "Quận 3",
          "city": "TP.HCM",
          "coordinates": {
            "lat": 10.7865,
            "lng": 106.6823
          }
        },
        "businessInfo": {
          "businessLicense": "9876543210",
          "taxCode": "1234567890",
          "businessType": "restaurant",
          "cuisineTypes": ["vietnamese", "pho"]
        },
        "operatingHours": [
          {"dayOfWeek": 1, "isOpen": true, "openTime": "07:00", "closeTime": "21:00"},
          {"dayOfWeek": 2, "isOpen": true, "openTime": "07:00", "closeTime": "21:00"},
          {"dayOfWeek": 3, "isOpen": true, "openTime": "07:00", "closeTime": "21:00"},
          {"dayOfWeek": 4, "isOpen": true, "openTime": "07:00", "closeTime": "21:00"},
          {"dayOfWeek": 5, "isOpen": true, "openTime": "07:00", "closeTime": "21:00"},
          {"dayOfWeek": 6, "isOpen": true, "openTime": "07:00", "closeTime": "22:00"},
          {"dayOfWeek": 0, "isOpen": true, "openTime": "07:00", "closeTime": "22:00"}
        ],
        "delivery": {
          "isDeliveryAvailable": true,
          "deliveryRadius": 5,
          "deliveryFee": 10000,
          "freeDeliveryThreshold": 100000,
          "estimatedDeliveryTime": 25,
          "deliveryAreas": ["Quận 3", "Quận 1"]
        },
        "ratings": {
          "averageRating": 4.2,
          "totalReviews": 85,
          "ratingBreakdown": {
            "5star": 35,
            "4star": 30,
            "3star": 15,
            "2star": 3,
            "1star": 2
          }
        },
        "tags": ["pho", "vietnamese", "affordable"],
        "isActive": true,
        "isVerified": true,
        "isFeatured": false,
        "verificationStatus": "approved",
        "bankInfo": {
          "bankName": "Techcombank",
          "accountNumber": "0987654321",
          "accountHolder": "PHỞ SÀI GÒN"
        },
        "createdAt": "2024-02-01T00:00:00.000Z",
        "updatedAt": "2024-10-01T00:00:00.000Z"
      })

  
// ====================================
// 3. CATEGORIES - Danh mục món ăn
// ====================================
print("📝 Tạo categories...");

const vietnameseCategory = db.categories.insertOne({
  name: "Món Việt",
  description: "Các món ăn truyền thống Việt Nam",
  icon: "🇻🇳",
  isActive: true,
  sortOrder: 1
});
const vietnameseCategoryId = vietnameseCategory.insertedId;

const pizzaCategory = db.categories.insertOne({
  name: "Pizza",
  description: "Pizza và món Ý",
  icon: "🍕",
  isActive: true,
  sortOrder: 2
});
const pizzaCategoryId = pizzaCategory.insertedId;

const westernCategory = db.categories.insertOne({
  name: "Món Âu",
  description: "Các món ăn phương Tây",
  icon: "🥩",
  isActive: true,
  sortOrder: 3
});
const westernCategoryId = westernCategory.insertedId;

const asianCategory = db.categories.insertOne({
  name: "Món Á",
  description: "Các món ăn châu Á",
  icon: "🍜",
  isActive: true,
  sortOrder: 4
});
const asianCategoryId = asianCategory.insertedId;

const beverageCategory = db.categories.insertOne({
  name: "Đồ Uống",
  description: "Nước uống và thức uống",
  icon: "🥤",
  isActive: true,
  sortOrder: 5
});
const beverageCategoryId = beverageCategory.insertedId;

const dessertCategory = db.categories.insertOne({
  name: "Tráng Miệng",
  description: "Món tráng miệng và bánh ngọt",
  icon: "🍰",
  isActive: true,
  sortOrder: 6
});
const dessertCategoryId = dessertCategory.insertedId;

// ====================================
// 4. DISHES - Món ăn
// ====================================
print("📝 Tạo dishes...");

// ====== RESTAURANT 1: Phở Bắc Hương Quê ======
db.dishes.insertMany([
  {
    restaurantId: restaurantResult.insertedId,
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
    isActive: true,
    isFeatured: true,
    preparationTime: 10
  },
  {
    restaurantId: restaurantResult.insertedId,
    categoryId: vietnameseCategoryId,
    basicInfo: {
      name: "Phở Bò Chín",
      description: "Phở bò chín với thịt bò nấu chín mềm",
      images: ["https://example.com/dishes/pho-bo-chin.jpg"],
      tags: ["traditional", "comfort"]
    },
    pricing: {
      basePrice: 50000,
      isDiscounted: false
    },
    availability: { isAvailable: true, soldOut: false },
    ratings: { averageRating: 4.3, totalReviews: 85 },
    isActive: true,
    preparationTime: 10
  },
  {
    restaurantId: restaurantResult.insertedId,
    categoryId: vietnameseCategoryId,
    basicInfo: {
      name: "Phở Gà",
      description: "Phở gà với nước dùng ngọt thanh",
      images: ["https://example.com/dishes/pho-ga.jpg"],
      tags: ["light", "healthy"]
    },
    pricing: {
      basePrice: 40000,
      isDiscounted: false
    },
    availability: { isAvailable: true, soldOut: false },
    ratings: { averageRating: 4.2, totalReviews: 65 },
    isActive: true,
    preparationTime: 10
  }
]);

// ====== RESTAURANT 2: Steak House ======
db.dishes.insertMany([
  {
    restaurantId: restaurant2Result.insertedId,
    categoryId: westernCategoryId,
    basicInfo: {
      name: "Ribeye Steak",
      description: "Ribeye steak cao cấp nướng chín vừa với khoai tây nghiền",
      images: ["https://example.com/dishes/ribeye-steak.jpg"],
      tags: ["premium", "bestseller"]
    },
    pricing: {
      basePrice: 450000,
      isDiscounted: false
    },
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
    isActive: true,
    isFeatured: true,
    preparationTime: 25
  },
  {
    restaurantId: restaurant2Result.insertedId,
    categoryId: westernCategoryId,
    basicInfo: {
      name: "Beef Tenderloin",
      description: "Thăn ngoại bò mềm với sốt mushroom",
      images: ["https://example.com/dishes/beef-tenderloin.jpg"],
      tags: ["premium", "tender"]
    },
    pricing: {
      basePrice: 520000,
      isDiscounted: false
    },
    availability: { isAvailable: true, soldOut: false },
    ratings: { averageRating: 4.9, totalReviews: 78 },
    isActive: true,
    preparationTime: 30
  }
]);

// ====== RESTAURANT 3: Taco Mexico ======
db.dishes.insertMany([
  {
    restaurantId: restaurant3Result.insertedId,
    categoryId: asianCategoryId,
    basicInfo: {
      name: "Beef Tacos",
      description: "Taco thịt bò với rau sống và sốt salsa",
      images: ["https://example.com/dishes/beef-tacos.jpg"],
      tags: ["spicy", "authentic"]
    },
    pricing: {
      basePrice: 85000,
      isDiscounted: false
    },
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
    isActive: true,
    isFeatured: true,
    preparationTime: 12
  },
  {
    restaurantId: restaurant3Result.insertedId,
    categoryId: asianCategoryId,
    basicInfo: {
      name: "Burrito Bowl",
      description: "Burrito bowl với thịt gà, đậu đen và guacamole",
      images: ["https://example.com/dishes/burrito-bowl.jpg"],
      tags: ["healthy", "filling"]
    },
    pricing: {
      basePrice: 120000,
      isDiscounted: false
    },
    availability: { isAvailable: true, soldOut: false },
    ratings: { averageRating: 4.3, totalReviews: 45 },
    isActive: true,
    preparationTime: 15
  }
]);

// ====== RESTAURANT 4: Café Sáng ======
db.dishes.insertMany([
  {
    restaurantId: restaurant4Result.insertedId,
    categoryId: beverageCategoryId,
    basicInfo: {
      name: "Cappuccino",
      description: "Cappuccino thơm với bọt sữa mịn",
      images: ["https://example.com/dishes/cappuccino.jpg"],
      tags: ["classic", "coffee"]
    },
    pricing: {
      basePrice: 35000,
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
    ratings: { averageRating: 4.6, totalReviews: 89 },
    isActive: true,
    isFeatured: true,
    preparationTime: 5
  },
  {
    restaurantId: restaurant4Result.insertedId,
    categoryId: dessertCategoryId,
    basicInfo: {
      name: "Tiramisu",
      description: "Bánh Tiramisu Italy chính gốc",
      images: ["https://example.com/dishes/tiramisu.jpg"],
      tags: ["dessert", "sweet"]
    },
    pricing: {
      basePrice: 65000,
      isDiscounted: false
    },
    availability: { isAvailable: true, soldOut: false },
    ratings: { averageRating: 4.7, totalReviews: 56 },
    isActive: true,
    preparationTime: 3
  }
]);

// ====== RESTAURANT 5: Lẩu Dê ======
db.dishes.insertMany([
  {
    restaurantId: restaurant5Result.insertedId,
    categoryId: vietnameseCategoryId,
    basicInfo: {
      name: "Lẩu Dê Lá Giang",
      description: "Lẩu dê với lá giang thơm, nước dùng đậm đà",
      images: ["https://example.com/dishes/lau-de-la-giang.jpg"],
      tags: ["traditional", "hot"]
    },
    pricing: {
      basePrice: 280000,
      isDiscounted: false
    },
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
    isActive: true,
    isFeatured: true,
    preparationTime: 20
  },
  {
    restaurantId: restaurant5Result.insertedId,
    categoryId: vietnameseCategoryId,
    basicInfo: {
      name: "Thịt Dê Nướng",
      description: "Thịt dê nướng tỏi ớt thơm ngon",
      images: ["https://example.com/dishes/thit-de-nuong.jpg"],
      tags: ["grilled", "spicy"]
    },
    pricing: {
      basePrice: 150000,
      isDiscounted: false
    },
    availability: { isAvailable: true, soldOut: false },
    ratings: { averageRating: 4.2, totalReviews: 45 },
    isActive: true,
    preparationTime: 18
  }
]);

// ====== RESTAURANT 6: Sushi Bar ======
db.dishes.insertMany([
  {
    restaurantId: restaurant6Result.insertedId,
    categoryId: asianCategoryId,
    basicInfo: {
      name: "Sashimi Set",
      description: "Set sashimi cá hồi và cá ngừ tươi",
      images: ["https://example.com/dishes/sashimi-set.jpg"],
      tags: ["fresh", "premium"]
    },
    pricing: {
      basePrice: 180000,
      isDiscounted: false
    },
    availability: { isAvailable: true, soldOut: false },
    ratings: { averageRating: 4.7, totalReviews: 92 },
    isActive: true,
    isFeatured: true,
    preparationTime: 8
  },
  {
    restaurantId: restaurant6Result.insertedId,
    categoryId: asianCategoryId,
    basicInfo: {
      name: "California Roll",
      description: "California roll với cua và bơ",
      images: ["https://example.com/dishes/california-roll.jpg"],
      tags: ["popular", "mild"]
    },
    pricing: {
      basePrice: 120000,
      isDiscounted: false
    },
    availability: { isAvailable: true, soldOut: false },
    ratings: { averageRating: 4.4, totalReviews: 67 },
    isActive: true,
    preparationTime: 10
  }
]);

// ====== RESTAURANT 19: Pizza House Saigon ======
db.dishes.insertMany([
  {
    restaurantId: restaurant19Result.insertedId,
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
    isActive: true,
    isFeatured: true,
    preparationTime: 15
  },
  {
    restaurantId: restaurant19Result.insertedId,
    categoryId: pizzaCategoryId,
    basicInfo: {
      name: "Pizza Pepperoni",
      description: "Pizza với pepperoni, phô mai mozzarella và sốt cà chua đặc biệt",
      images: ["https://example.com/dishes/pepperoni.jpg"],
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
    availability: { isAvailable: true, soldOut: false },
    ratings: { averageRating: 4.5, totalReviews: 76 },
    isActive: true,
    preparationTime: 18
  },
  {
    restaurantId: restaurant19Result.insertedId,
    categoryId: pizzaCategoryId,
    basicInfo: {
      name: "Pizza Quattro Stagioni",
      description: "Pizza 4 mùa với jambon, nấm, ô liu và atiso",
      images: ["https://example.com/dishes/quattro-stagioni.jpg"],
      tags: ["variety", "premium"]
    },
    pricing: {
      basePrice: 250000,
      isDiscounted: false
    },
    availability: { isAvailable: true, soldOut: false },
    ratings: { averageRating: 4.6, totalReviews: 54 },
    isActive: true,
    preparationTime: 20
  }
]);

// ====== RESTAURANT 20: Phở Sài Gòn ======
db.dishes.insertMany([
  {
    restaurantId: restaurant20Result.insertedId,
    categoryId: vietnameseCategoryId,
    basicInfo: {
      name: "Phở Bò Đặc Biệt",
      description: "Phở bò đặc biệt với đầy đủ loại thịt",
      images: ["https://example.com/dishes/pho-dac-biet.jpg"],
      tags: ["signature", "complete"]
    },
    pricing: {
      basePrice: 55000,
      isDiscounted: false
    },
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
    isActive: true,
    isFeatured: true,
    preparationTime: 12
  },
  {
    restaurantId: restaurant20Result.insertedId,
    categoryId: vietnameseCategoryId,
    basicInfo: {
      name: "Phở Tái Nạm",
      description: "Phở với thịt tái và nạm",
      images: ["https://example.com/dishes/pho-tai-nam.jpg"],
      tags: ["traditional", "popular"]
    },
    pricing: {
      basePrice: 50000,
      isDiscounted: false
    },
    availability: { isAvailable: true, soldOut: false },
    ratings: { averageRating: 4.2, totalReviews: 65 },
    isActive: true,
    preparationTime: 10
  },
  {
    restaurantId: restaurant20Result.insertedId,
    categoryId: beverageCategoryId,
    basicInfo: {
      name: "Trà Đá",
      description: "Trà đá truyền thống giải khát",
      images: ["https://example.com/dishes/tra-da.jpg"],
      tags: ["refreshing", "traditional"]
    },
    pricing: {
      basePrice: 8000,
      isDiscounted: false
    },
    availability: { isAvailable: true, soldOut: false },
    ratings: { averageRating: 4.0, totalReviews: 34 },
    isActive: true,
    preparationTime: 2
  }
]);

// Thêm dishes cho các nhà hàng còn lại...
// ====== RESTAURANT 7: Bánh Tráng Nướng ======
db.dishes.insertMany([
  {
    restaurantId: restaurant7Result.insertedId,
    categoryId: vietnameseCategoryId,
    basicInfo: {
      name: "Bánh Tráng Nướng Đặc Biệt",
      description: "Bánh tráng nướng với trứng, pate, tôm khô và đầy đủ topping",
      images: ["https://example.com/dishes/banh-trang-nuong-dac-biet.jpg"],
      tags: ["street_food", "complete"]
    },
    pricing: {
      basePrice: 25000,
      isDiscounted: false
    },
    availability: { isAvailable: true, soldOut: false },
    ratings: { averageRating: 4.3, totalReviews: 89 },
    isActive: true,
    isFeatured: true,
    preparationTime: 8
  },
  {
    restaurantId: restaurant7Result.insertedId,
    categoryId: vietnameseCategoryId,
    basicInfo: {
      name: "Bánh Tráng Nướng Tôm",
      description: "Bánh tráng nướng với tôm tươi",
      images: ["https://example.com/dishes/banh-trang-nuong-tom.jpg"],
      tags: ["seafood", "crispy"]
    },
    pricing: {
      basePrice: 30000,
      isDiscounted: false
    },
    availability: { isAvailable: true, soldOut: false },
    ratings: { averageRating: 4.2, totalReviews: 67 },
    isActive: true,
    preparationTime: 10
  }
]);

print("✅ Đã tạo xong dữ liệu sample!");
print("📊 Tổng kết:");
print("- Users: 7 restaurant hosts");
print("- Restaurants: 20 nhà hàng");
print("- Categories: 6 danh mục");
print("- Dishes: 25+ món ăn");






