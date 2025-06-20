# THIẾT KẾ DATABASE MONGODB CHO ỨNG DỤNG FOOD DELIVERY

## TỔNG QUAN HỆ THỐNG
- **Database**: MongoDB
- **Roles**: User (người mua hàng), RestaurantHost (chủ nhà hàng), Admin
- **Loại bỏ**: Forum module

---

## 1. COLLECTION: users
**Mô tả**: Lưu trữ thông tin tất cả người dùng trong hệ thống

```javascript
{
  "_id": ObjectId,
  "email": String, // unique, required
  "password": String, // hashed, required
  "role": String, // enum: ["user", "restaurantHost", "admin"]
  "profile": {
    "firstName": String,
    "lastName": String,
    "phone": String,
    "avatar": String, // URL
    "dateOfBirth": Date,
    "gender": String // enum: ["male", "female", "other"]
  },
  "addresses": [{
    "_id": ObjectId,
    "title": String, // "Nhà riêng", "Văn phòng"
    "fullAddress": String,
    "district": String,
    "city": String,
    "isDefault": Boolean,
    "coordinates": {
      "lat": Number,
      "lng": Number
    }
  }],
  "paymentMethods": [{
    "_id": ObjectId,
    "type": String, // enum: ["credit_card", "debit_card", "ewallet", "cash"]
    "cardNumber": String, // encrypted
    "cardHolder": String,
    "expiryDate": String,
    "isDefault": Boolean,
    "ewalletType": String, // "momo", "zalopay", "vnpay"
    "ewalletAccount": String
  }],
  "preferences": {
    "language": String, // default: "vi"
    "notifications": {
      "email": Boolean,
      "push": Boolean,
      "sms": Boolean,
      "orderUpdates": Boolean,
      "promotions": Boolean
    }
  },
  "loyaltyPoints": Number, // default: 0
  "giftCards": [{
    "_id": ObjectId,
    "code": String,
    "balance": Number,
    "expiryDate": Date,
    "isActive": Boolean
  }],
  "isActive": Boolean, // default: true
  "isVerified": Boolean, // default: false
  "verificationToken": String,
  "resetPasswordToken": String,
  "resetPasswordExpires": Date,
  "lastLogin": Date,
  "createdAt": Date,
  "updatedAt": Date
}
```

---

## 2. COLLECTION: restaurants
**Mô tả**: Lưu trữ thông tin nhà hàng

```javascript
{
  "_id": ObjectId,
  "hostId": ObjectId, // ref: users._id (role: restaurantHost)
  "basicInfo": {
    "name": String, // required
    "description": String,
    "phone": String,
    "email": String,
    "website": String,
    "images": [String], // array of URLs
    "logo": String, // URL
    "coverImage": String // URL
  },
  "address": {
    "fullAddress": String,
    "district": String,
    "city": String,
    "coordinates": {
      "lat": Number,
      "lng": Number
    }
  },
  "businessInfo": {
    "businessLicense": String,
    "taxCode": String,
    "businessType": String, // "restaurant", "cafe", "fast_food"
    "cuisineTypes": [String] // ["vietnamese", "chinese", "japanese", "western"]
  },
  "operatingHours": [{
    "dayOfWeek": Number, // 0-6 (0: Sunday)
    "isOpen": Boolean,
    "openTime": String, // "09:00"
    "closeTime": String, // "22:00"
    "breakTime": {
      "start": String,
      "end": String
    }
  }],
  "delivery": {
    "isDeliveryAvailable": Boolean,
    "deliveryRadius": Number, // km
    "deliveryFee": Number,
    "freeDeliveryThreshold": Number,
    "estimatedDeliveryTime": Number, // minutes
    "deliveryAreas": [String] // array of districts
  },
  "ratings": {
    "averageRating": Number, // 0-5
    "totalReviews": Number,
    "ratingBreakdown": {
      "5star": Number,
      "4star": Number,
      "3star": Number,
      "2star": Number,
      "1star": Number
    }
  },
  "tags": [String], // ["halal", "vegetarian", "fast_delivery"]
  "isActive": Boolean, // default: true
  "isVerified": Boolean, // default: false
  "isFeatured": Boolean, // default: false
  "verificationStatus": String, // enum: ["pending", "approved", "rejected"]
  "bankInfo": {
    "bankName": String,
    "accountNumber": String,
    "accountHolder": String
  },
  "createdAt": Date,
  "updatedAt": Date
}
```

---

## 3. COLLECTION: categories
**Mô tả**: Danh mục món ăn

```javascript
{
  "_id": ObjectId,
  "name": String, // required
  "description": String,
  "image": String, // URL
  "icon": String, // URL
  "parentId": ObjectId, // ref: categories._id (for subcategories)
  "level": Number, // 1: main category, 2: subcategory
  "sortOrder": Number,
  "isActive": Boolean, // default: true
  "createdAt": Date,
  "updatedAt": Date
}
```

---

## 4. COLLECTION: dishes
**Mô tả**: Món ăn của nhà hàng

```javascript
{
  "_id": ObjectId,
  "restaurantId": ObjectId, // ref: restaurants._id, required
  "categoryId": ObjectId, // ref: categories._id
  "basicInfo": {
    "name": String, // required
    "description": String,
    "images": [String], // array of URLs
    "tags": [String] // ["spicy", "vegetarian", "bestseller"]
  },
  "pricing": {
    "basePrice": Number, // required
    "discountPrice": Number,
    "isDiscounted": Boolean
  },
  "nutritionInfo": {
    "calories": Number,
    "protein": Number,
    "carbs": Number,
    "fat": Number,
    "ingredients": [String],
    "allergens": [String]
  },
  "options": [{
    "_id": ObjectId,
    "name": String, // "Size", "Spice Level"
    "type": String, // enum: ["single", "multiple"]
    "isRequired": Boolean,
    "choices": [{
      "_id": ObjectId,
      "name": String, // "Large", "Medium", "Small"
      "price": Number, // additional price
      "isDefault": Boolean
    }]
  }],
  "availability": {
    "isAvailable": Boolean, // default: true
    "availableTimes": [{
      "start": String, // "09:00"
      "end": String // "22:00"
    }],
    "stockQuantity": Number, // null = unlimited
    "soldOut": Boolean // default: false
  },
  "ratings": {
    "averageRating": Number, // 0-5
    "totalReviews": Number
  },
  "stats": {
    "totalOrders": Number, // default: 0
    "viewCount": Number // default: 0
  },
  "isActive": Boolean, // default: true
  "isFeatured": Boolean, // default: false
  "preparationTime": Number, // minutes
  "createdAt": Date,
  "updatedAt": Date
}
```

---

## 5. COLLECTION: orders
**Mô tả**: Đơn hàng

```javascript
{
  "_id": ObjectId,
  "orderNumber": String, // unique, auto-generated
  "customerId": ObjectId, // ref: users._id, required
  "restaurantId": ObjectId, // ref: restaurants._id, required
  "orderDetails": {
    "items": [{
      "_id": ObjectId,
      "dishId": ObjectId, // ref: dishes._id
      "dishName": String, // snapshot
      "dishImage": String, // snapshot
      "quantity": Number, // required
      "unitPrice": Number, // snapshot
      "selectedOptions": [{
        "optionName": String,
        "choiceName": String,
        "additionalPrice": Number
      }],
      "subtotal": Number, // quantity * (unitPrice + option prices)
      "specialInstructions": String
    }],
    "subtotal": Number,
    "deliveryFee": Number,
    "serviceFee": Number,
    "tax": Number,
    "discount": Number,
    "totalAmount": Number
  },
  "deliveryInfo": {
    "address": {
      "fullAddress": String,
      "district": String,
      "city": String,
      "coordinates": {
        "lat": Number,
        "lng": Number
      }
    },
    "customerName": String,
    "customerPhone": String,
    "deliveryInstructions": String,
    "deliveryType": String, // enum: ["delivery", "pickup"]
    "estimatedDeliveryTime": Date,
    "actualDeliveryTime": Date
  },
  "payment": {
    "method": String, // enum: ["cash", "card", "ewallet", "gift_card"]
    "status": String, // enum: ["pending", "paid", "failed", "refunded"]
    "transactionId": String,
    "paidAt": Date
  },
  "promocode": {
    "code": String,
    "discountAmount": Number,
    "discountType": String // enum: ["percentage", "fixed"]
  },
  "status": {
    "current": String, // enum: ["pending", "confirmed", "preparing", "ready", "delivering", "delivered", "cancelled"]
    "history": [{
      "status": String,
      "timestamp": Date,
      "note": String
    }]
  },
  "timing": {
    "placedAt": Date, // required
    "confirmedAt": Date,
    "preparingAt": Date,
    "readyAt": Date,
    "pickedUpAt": Date,
    "deliveredAt": Date,
    "cancelledAt": Date
  },
  "feedback": {
    "restaurantRating": Number, // 1-5
    "restaurantReview": String,
    "deliveryRating": Number, // 1-5
    "deliveryReview": String,
    "reviewImages": [String],
    "reviewedAt": Date
  },
  "cancellation": {
    "reason": String,
    "cancelledBy": String, // enum: ["customer", "restaurant", "admin"]
    "refundAmount": Number,
    "refundStatus": String // enum: ["pending", "processed", "failed"]
  },
  "assignedDriver": ObjectId, // ref: drivers._id
  "createdAt": Date,
  "updatedAt": Date
}
```

---

## 6. COLLECTION: reviews
**Mô tả**: Đánh giá nhà hàng và món ăn

```javascript
{
  "_id": ObjectId,
  "orderId": ObjectId, // ref: orders._id, required
  "customerId": ObjectId, // ref: users._id, required
  "restaurantId": ObjectId, // ref: restaurants._id, required
  "dishReviews": [{
    "dishId": ObjectId, // ref: dishes._id
    "rating": Number, // 1-5, required
    "comment": String,
    "images": [String] // URLs
  }],
  "restaurantReview": {
    "rating": Number, // 1-5, required
    "comment": String,
    "categories": {
      "food": Number, // 1-5
      "service": Number, // 1-5
      "delivery": Number, // 1-5
      "packaging": Number // 1-5
    }
  },
  "deliveryReview": {
    "rating": Number, // 1-5
    "comment": String
  },
  "images": [String], // URLs
  "isVerified": Boolean, // default: true (verified purchase)
  "likes": Number, // default: 0
  "isHelpful": [ObjectId], // user IDs who marked as helpful
  "response": {
    "text": String,
    "respondedBy": ObjectId, // restaurant owner
    "respondedAt": Date
  },
  "isActive": Boolean, // default: true
  "createdAt": Date,
  "updatedAt": Date
}
```

---

## 7. COLLECTION: promotions
**Mô tả**: Mã giảm giá và khuyến mãi

```javascript
{
  "_id": ObjectId,
  "code": String, // unique, required
  "name": String, // required
  "description": String,
  "type": String, // enum: ["percentage", "fixed_amount", "free_delivery", "bogo"]
  "value": Number, // percentage (0-100) or fixed amount
  "conditions": {
    "minimumOrderAmount": Number,
    "maximumDiscountAmount": Number,
    "applicableRestaurants": [ObjectId], // ref: restaurants._id, empty = all
    "applicableCategories": [ObjectId], // ref: categories._id
    "applicableDishes": [ObjectId], // ref: dishes._id
    "newCustomersOnly": Boolean,
    "firstOrderOnly": Boolean,
    "applicablePaymentMethods": [String]
  },
  "usage": {
    "totalUsageLimit": Number, // null = unlimited
    "perUserLimit": Number, // default: 1
    "currentUsage": Number, // default: 0
    "usedBy": [ObjectId] // user IDs who used this promo
  },
  "schedule": {
    "startDate": Date, // required
    "endDate": Date, // required
    "applicableDays": [Number], // 0-6, empty = all days
    "applicableHours": [{
      "start": String, // "09:00"
      "end": String // "22:00"
    }]
  },
  "targeting": {
    "userSegments": [String], // ["new", "vip", "loyal"]
    "cities": [String],
    "districts": [String]
  },
  "status": String, // enum: ["draft", "active", "paused", "expired"]
  "createdBy": ObjectId, // ref: users._id (admin or restaurant)
  "isActive": Boolean, // default: true
  "createdAt": Date,
  "updatedAt": Date
}
```

---

## 8. COLLECTION: drivers
**Mô tả**: Tài xế giao hàng

```javascript
{
  "_id": ObjectId,
  "personalInfo": {
    "firstName": String, // required
    "lastName": String, // required
    "phone": String, // required, unique
    "email": String,
    "nationalId": String, // required
    "dateOfBirth": Date,
    "avatar": String // URL
  },
  "workInfo": {
    "driverLicense": String, // required
    "vehicleType": String, // enum: ["motorbike", "bicycle", "car"]
    "vehicleNumber": String,
    "vehicleModel": String,
    "insuranceNumber": String,
    "workingAreas": [String], // districts
    "shiftSchedule": [{
      "dayOfWeek": Number, // 0-6
      "startTime": String,
      "endTime": String
    }]
  },
  "status": {
    "isOnline": Boolean, // default: false
    "isAvailable": Boolean, // default: true
    "currentLocation": {
      "lat": Number,
      "lng": Number,
      "lastUpdated": Date
    },
    "isVerified": Boolean, // default: false
    "verificationStatus": String // enum: ["pending", "approved", "rejected"]
  },
  "stats": {
    "totalDeliveries": Number, // default: 0
    "successfulDeliveries": Number, // default: 0
    "cancelledDeliveries": Number, // default: 0
    "averageRating": Number, // 0-5
    "totalEarnings": Number, // default: 0
    "totalDistance": Number // km
  },
  "ratings": {
    "averageRating": Number,
    "totalReviews": Number,
    "ratingBreakdown": {
      "5star": Number,
      "4star": Number,
      "3star": Number,
      "2star": Number,
      "1star": Number
    }
  },
  "bankInfo": {
    "bankName": String,
    "accountNumber": String,
    "accountHolder": String
  },
  "isActive": Boolean, // default: true
  "createdAt": Date,
  "updatedAt": Date
}
```

---

## 9. COLLECTION: deliveries
**Mô tả**: Chi tiết giao hàng

```javascript
{
  "_id": ObjectId,
  "orderId": ObjectId, // ref: orders._id, required
  "driverId": ObjectId, // ref: drivers._id
  "assignmentHistory": [{
    "driverId": ObjectId,
    "assignedAt": Date,
    "status": String, // enum: ["assigned", "accepted", "declined", "cancelled"]
    "declineReason": String
  }],
  "route": {
    "pickupLocation": {
      "lat": Number,
      "lng": Number,
      "address": String
    },
    "deliveryLocation": {
      "lat": Number,
      "lng": Number,
      "address": String
    },
    "estimatedDistance": Number, // km
    "estimatedDuration": Number, // minutes
    "actualDistance": Number,
    "actualDuration": Number
  },
  "tracking": [{
    "status": String, // enum: ["assigned", "pickup_arrived", "picked_up", "in_transit", "delivered"]
    "location": {
      "lat": Number,
      "lng": Number
    },
    "timestamp": Date,
    "note": String
  }],
  "timing": {
    "assignedAt": Date,
    "acceptedAt": Date,
    "arrivedAtRestaurantAt": Date,
    "pickedUpAt": Date,
    "deliveredAt": Date
  },
  "payment": {
    "deliveryFee": Number,
    "driverEarning": Number,
    "platformCommission": Number
  },
  "completion": {
    "deliveryCode": String, // 4-digit verification code
    "deliveryPhoto": String, // URL
    "signature": String, // base64 or URL
    "customerRating": Number, // 1-5
    "customerFeedback": String
  },
  "issues": [{
    "type": String, // enum: ["damaged_food", "wrong_order", "late_delivery", "driver_issue"]
    "description": String,
    "reportedBy": String, // enum: ["customer", "driver", "restaurant"]
    "reportedAt": Date,
    "resolution": String,
    "resolvedAt": Date
  }],
  "status": String, // enum: ["assigned", "in_progress", "completed", "cancelled"]
  "createdAt": Date,
  "updatedAt": Date
}
```

---

## 10. COLLECTION: notifications
**Mô tả**: Thông báo cho người dùng

```javascript
{
  "_id": ObjectId,
  "recipientId": ObjectId, // ref: users._id, required
  "recipientType": String, // enum: ["user", "restaurantHost", "driver", "admin"]
  "type": String, // enum: ["order_status", "promotion", "system", "review", "payment"]
  "title": String, // required
  "message": String, // required
  "data": {
    "orderId": ObjectId,
    "promotionId": ObjectId,
    "deepLink": String,
    "actionType": String, // enum: ["view_order", "rate_order", "view_promotion"]
    "metadata": {}
  },
  "delivery": {
    "channels": [String], // enum: ["push", "email", "sms", "in_app"]
    "sentAt": Date,
    "deliveryStatus": {
      "push": String, // enum: ["sent", "delivered", "failed"]
      "email": String,
      "sms": String
    }
  },
  "interaction": {
    "isRead": Boolean, // default: false
    "readAt": Date,
    "isClicked": Boolean, // default: false
    "clickedAt": Date
  },
  "priority": String, // enum: ["low", "normal", "high", "urgent"]
  "expiresAt": Date,
  "isActive": Boolean, // default: true
  "createdAt": Date,
  "updatedAt": Date
}
```

---

## 11. COLLECTION: support_tickets
**Mô tả**: Hỗ trợ khách hàng

```javascript
{
  "_id": ObjectId,
  "ticketNumber": String, // unique, auto-generated
  "userId": ObjectId, // ref: users._id, required
  "category": String, // enum: ["order_issue", "payment", "account", "technical", "general"]
  "subcategory": String,
  "subject": String, // required
  "description": String, // required
  "priority": String, // enum: ["low", "normal", "high", "urgent"]
  "status": String, // enum: ["open", "in_progress", "waiting_customer", "resolved", "closed"]
  "relatedOrderId": ObjectId, // ref: orders._id
  "attachments": [String], // URLs
  "messages": [{
    "_id": ObjectId,
    "senderId": ObjectId, // ref: users._id
    "senderType": String, // enum: ["customer", "support_agent", "system"]
    "message": String,
    "attachments": [String],
    "isInternal": Boolean, // true for internal notes
    "sentAt": Date
  }],
  "assignedAgent": ObjectId, // ref: users._id (admin role)
  "resolution": {
    "solution": String,
    "resolvedAt": Date,
    "resolvedBy": ObjectId,
    "customerSatisfaction": Number, // 1-5
    "customerFeedback": String
  },
  "tags": [String],
  "escalation": {
    "isEscalated": Boolean,
    "escalatedAt": Date,
    "escalatedTo": ObjectId,
    "escalationReason": String
  },
  "sla": {
    "responseDeadline": Date,
    "resolutionDeadline": Date,
    "firstResponseAt": Date
  },
  "createdAt": Date,
  "updatedAt": Date
}
```

---

## 12. COLLECTION: blogs
**Mô tả**: Blog và tin tức

```javascript
{
  "_id": ObjectId,
  "title": String, // required
  "slug": String, // unique, URL-friendly
  "excerpt": String,
  "content": String, // HTML content
  "featuredImage": String, // URL
  "images": [String], // URLs
  "author": {
    "id": ObjectId, // ref: users._id
    "name": String,
    "avatar": String
  },
  "category": String, // enum: ["news", "events", "promotions", "food_tips", "restaurant_spotlight"]
  "tags": [String],
  "status": String, // enum: ["draft", "published", "archived"]
  "visibility": String, // enum: ["public", "premium", "member_only"]
  "seo": {
    "metaTitle": String,
    "metaDescription": String,
    "keywords": [String]
  },
  "engagement": {
    "viewCount": Number, // default: 0
    "likeCount": Number, // default: 0
    "shareCount": Number, // default: 0
    "commentCount": Number // default: 0
  },
  "schedule": {
    "publishAt": Date,
    "unpublishAt": Date
  },
  "isActive": Boolean, // default: true
  "isFeatured": Boolean, // default: false
  "publishedAt": Date,
  "createdAt": Date,
  "updatedAt": Date
}
```

---

## 13. COLLECTION: vouchers
**Mô tả**: Voucher của người dùng

```javascript
{
  "_id": ObjectId,
  "userId": ObjectId, // ref: users._id, required
  "promotionId": ObjectId, // ref: promotions._id
  "code": String, // unique per user
  "type": String, // enum: ["discount", "free_delivery", "cashback"]
  "value": Number,
  "originalValue": Number, // for partially used vouchers
  "conditions": {
    "minimumOrderAmount": Number,
    "maximumDiscountAmount": Number,
    "applicableRestaurants": [ObjectId],
    "applicableCategories": [ObjectId]
  },
  "usage": {
    "isUsed": Boolean, // default: false
    "usedAt": Date,
    "orderId": ObjectId, // ref: orders._id
    "remainingValue": Number // for multi-use vouchers
  },
  "validity": {
    "issuedAt": Date, // required
    "expiresAt": Date, // required
    "isActive": Boolean // default: true
  },
  "source": String, // enum: ["promotion", "referral", "loyalty", "compensation"]
  "metadata": {
    "referralCode": String,
    "campaignId": String,
    "issueReason": String
  },
  "createdAt": Date,
  "updatedAt": Date
}
```

---

## 14. COLLECTION: analytics
**Mô tả**: Dữ liệu phân tích (chỉ admin truy cập)

```javascript
{
  "_id": ObjectId,
  "type": String, // enum: ["daily", "weekly", "monthly", "yearly"]
  "date": Date, // start date of the period
  "metrics": {
    "orders": {
      "total": Number,
      "completed": Number,
      "cancelled": Number,
      "revenue": Number,
      "averageOrderValue": Number
    },
    "users": {
      "totalUsers": Number,
      "newUsers": Number,
      "activeUsers": Number,
      "retentionRate": Number
    },
    "restaurants": {
      "totalRestaurants": Number,
      "activeRestaurants": Number,
      "newRestaurants": Number,
      "averageRating": Number
    },
    "dishes": {
      "totalDishes": Number,
      "topSellingDishes": [{
        "dishId": ObjectId,
        "name": String,
        "orderCount": Number,
        "revenue": Number
      }]
    },
    "deliveries": {
      "totalDeliveries": Number,
      "averageDeliveryTime": Number,
      "onTimeDeliveryRate": Number
    }
  },
  "breakdown": {
    "byCity": [{}],
    "byCategory": [{}],
    "byHour": [{}],
    "byPaymentMethod": [{}]
  },
  "createdAt": Date
}
```

---

## 15. COLLECTION: app_settings
**Mô tả**: Cài đặt ứng dụng (chỉ admin)

```javascript
{
  "_id": ObjectId,
  "category": String, // enum: ["general", "payment", "delivery", "notification", "feature"]
  "settings": {
    "general": {
      "appName": String,
      "appVersion": String,
      "maintenanceMode": Boolean,
      "maintenanceMessage": String,
      "supportEmail": String,
      "supportPhone": String,
      "privacyPolicyUrl": String,
      "termsOfServiceUrl": String
    },
    "payment": {
      "enabledMethods": [String],
      "defaultCurrency": String,
      "serviceFeePercentage": Number,
      "minimumOrderAmount": Number,
      "cashOnDeliveryFee": Number
    },
    "delivery": {
      "defaultDeliveryRadius": Number,
      "defaultDeliveryFee": Number,
      "freeDeliveryThreshold": Number,
      "averageDeliveryTime": Number,
      "maxDeliveryRadius": Number
    },
    "notification": {
      "pushNotificationKey": String,
      "emailTemplates": {},
      "smsProvider": String,
      "defaultNotificationSettings": {}
    },
    "features": {
      "enableReviews": Boolean,
      "enableLoyaltyProgram": Boolean,
      "enableReferralProgram": Boolean,
      "enableScheduledOrders": Boolean,
      "enableGroupOrders": Boolean
    }
  },
  "updatedBy": ObjectId, // ref: users._id (admin)
  "updatedAt": Date,
  "createdAt": Date
}
```

---

## INDEXES VÀ PERFORMANCE

### Indexes cần thiết:

```javascript
// users collection
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "role": 1 })
db.users.createIndex({ "isActive": 1 })

// restaurants collection
db.restaurants.createIndex({ "hostId": 1 })
db.restaurants.createIndex({ "address.city": 1, "address.district": 1 })
db.restaurants.createIndex({ "isActive": 1, "isVerified": 1 })
db.restaurants.createIndex({ "businessInfo.cuisineTypes": 1 })
db.restaurants.createIndex({ "ratings.averageRating": -1 })

// dishes collection
db.dishes.createIndex({ "restaurantId": 1 })
db.dishes.createIndex({ "categoryId": 1 })
db.dishes.createIndex({ "isActive": 1, "availability.isAvailable": 1 })
db.dishes.createIndex({ "ratings.averageRating": -1 })

// orders collection
db.orders.createIndex({ "customerId": 1, "createdAt": -1 })
db.orders.createIndex({ "restaurantId": 1, "createdAt": -1 })
db.orders.createIndex({ "orderNumber": 1 }, { unique: true })
db.orders.createIndex({ "status.current": 1 })
db.orders.createIndex({ "createdAt": -1 })

// reviews collection
db.reviews.createIndex({ "restaurantId": 1, "createdAt": -1 })
db.reviews.createIndex({ "customerId": 1 })
db.reviews.createIndex({ "orderId": 1 })

// promotions collection
db.promotions.createIndex({ "code": 1 }, { unique: true })
db.promotions.createIndex({ "status": 1, "schedule.startDate": 1, "schedule.endDate": 1 })

// notifications collection
db.notifications.createIndex({ "recipientId": 1, "createdAt": -1 })
db.notifications.createIndex({ "isRead": 1, "recipientId": 1 })
```

---

## PHÂN QUYỀN VÀ BẢO MẬT

### 1. User Role (Người mua hàng):
- **Đọc**: Thông tin cá nhân, đơn hàng của mình, nhà hàng, món ăn, reviews, blogs, promotions
- **Ghi**: Cập nhật profile, tạo đơn hàng, viết review, tạo support ticket
- **Không được**: Truy cập thông tin người dùng khác, dữ liệu nhà hàng backend, analytics

### 2. Restaurant Host Role (Chủ nhà hàng):
- **Đọc**: Thông tin nhà hàng của mình, đơn hàng của nhà hàng, reviews về nhà hàng, analytics cơ bản
- **Ghi**: Cập nhật thông tin nhà hàng, quản lý món ăn, phản hồi reviews, cập nhật trạng thái đơn hàng
- **Không được**: Truy cập thông tin nhà hàng khác, dữ liệu khách hàng chi tiết, cài đặt hệ thống

### 3. Admin Role:
- **Đọc**: Tất cả dữ liệu trong hệ thống
- **Ghi**: Quản lý tất cả collections, cài đặt hệ thống, phê duyệt nhà hàng, xử lý support tickets
- **Đặc quyền**: Truy cập analytics, quản lý user roles, cài đặt app

---

## LƯU Ý TRIỂN KHAI

1. **Mã hóa dữ liệu nhạy cảm**: Password, thông tin thanh toán, thông tin cá nhân
2. **Validation**: Implement validation cho tất cả input fields
3. **Backup**: Thiết lập backup tự động cho database
4. **Monitoring**: Thiết lập monitoring cho performance và errors
5. **Rate limiting**: Implement rate limiting cho APIs
6. **Data retention**: Thiết lập chính sách lưu trữ dữ liệu
7. **GDPR compliance**: Implement right to be forgotten và data export

Database này đã được thiết kế để hỗ trợ đầy đủ các tính năng của ứng dụng food delivery với khả năng mở rộng và bảo mật cao. 