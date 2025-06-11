// ====================================
// SCRIPT TẠO INDEXES CHO FOOD DELIVERY APP
// ====================================

// Kết nối database
use food_delivery_app;

print("🚀 Bắt đầu tạo indexes cho Food Delivery App...");

// ====================================
// 1. USERS COLLECTION INDEXES
// ====================================
print("📝 Tạo indexes cho collection 'users'...");

// Email index (unique)
db.users.createIndex({ "email": 1 }, { unique: true, name: "idx_users_email" });

// Role index
db.users.createIndex({ "role": 1 }, { name: "idx_users_role" });

// Active status index
db.users.createIndex({ "isActive": 1 }, { name: "idx_users_isActive" });

// Phone index (sparse vì không phải user nào cũng có phone)
db.users.createIndex({ "profile.phone": 1 }, { sparse: true, name: "idx_users_phone" });

// Compound index cho role và active status
db.users.createIndex({ "role": 1, "isActive": 1 }, { name: "idx_users_role_active" });

print("✅ Users indexes đã được tạo");

// ====================================
// 2. RESTAURANTS COLLECTION INDEXES
// ====================================
print("📝 Tạo indexes cho collection 'restaurants'...");

// Host ID index
db.restaurants.createIndex({ "hostId": 1 }, { name: "idx_restaurants_hostId" });

// Location index (2dsphere cho geospatial queries)
db.restaurants.createIndex({ "address.coordinates": "2dsphere" }, { name: "idx_restaurants_location" });

// City và district index
db.restaurants.createIndex({ "address.city": 1, "address.district": 1 }, { name: "idx_restaurants_location_text" });

// Active và verified status index
db.restaurants.createIndex({ "isActive": 1, "isVerified": 1 }, { name: "idx_restaurants_status" });

// Cuisine types index
db.restaurants.createIndex({ "businessInfo.cuisineTypes": 1 }, { name: "idx_restaurants_cuisine" });

// Rating index (descending cho top rated)
db.restaurants.createIndex({ "ratings.averageRating": -1 }, { name: "idx_restaurants_rating" });

// Text search index cho tên và mô tả
db.restaurants.createIndex({ 
  "basicInfo.name": "text", 
  "basicInfo.description": "text",
  "tags": "text"
}, { 
  name: "idx_restaurants_text_search",
  weights: { "basicInfo.name": 10, "basicInfo.description": 5, "tags": 3 }
});

// Featured restaurants index
db.restaurants.createIndex({ "isFeatured": 1, "isActive": 1 }, { name: "idx_restaurants_featured" });

print("✅ Restaurants indexes đã được tạo");

// ====================================
// 3. CATEGORIES COLLECTION INDEXES
// ====================================
print("📝 Tạo indexes cho collection 'categories'...");

// Parent ID index
db.categories.createIndex({ "parentId": 1 }, { sparse: true, name: "idx_categories_parent" });

// Active status và sort order
db.categories.createIndex({ "isActive": 1, "sortOrder": 1 }, { name: "idx_categories_active_sort" });

// Level index
db.categories.createIndex({ "level": 1 }, { name: "idx_categories_level" });

print("✅ Categories indexes đã được tạo");

// ====================================
// 4. DISHES COLLECTION INDEXES
// ====================================
print("📝 Tạo indexes cho collection 'dishes'...");

// Restaurant ID index
db.dishes.createIndex({ "restaurantId": 1 }, { name: "idx_dishes_restaurant" });

// Category ID index
db.dishes.createIndex({ "categoryId": 1 }, { name: "idx_dishes_category" });

// Active và available status
db.dishes.createIndex({ "isActive": 1, "availability.isAvailable": 1 }, { name: "idx_dishes_available" });

// Rating index
db.dishes.createIndex({ "ratings.averageRating": -1 }, { name: "idx_dishes_rating" });

// Price index
db.dishes.createIndex({ "pricing.basePrice": 1 }, { name: "idx_dishes_price" });

// Featured dishes
db.dishes.createIndex({ "isFeatured": 1, "isActive": 1 }, { name: "idx_dishes_featured" });

// Text search cho tên và mô tả món ăn
db.dishes.createIndex({ 
  "basicInfo.name": "text", 
  "basicInfo.description": "text",
  "basicInfo.tags": "text"
}, { 
  name: "idx_dishes_text_search",
  weights: { "basicInfo.name": 10, "basicInfo.description": 5, "basicInfo.tags": 3 }
});

// Compound index cho restaurant và category
db.dishes.createIndex({ "restaurantId": 1, "categoryId": 1, "isActive": 1 }, { name: "idx_dishes_restaurant_category" });

print("✅ Dishes indexes đã được tạo");

// ====================================
// 5. ORDERS COLLECTION INDEXES
// ====================================
print("📝 Tạo indexes cho collection 'orders'...");

// Customer ID với created date (descending)
db.orders.createIndex({ "customerId": 1, "createdAt": -1 }, { name: "idx_orders_customer_date" });

// Restaurant ID với created date
db.orders.createIndex({ "restaurantId": 1, "createdAt": -1 }, { name: "idx_orders_restaurant_date" });

// Order number (unique)
db.orders.createIndex({ "orderNumber": 1 }, { unique: true, name: "idx_orders_number" });

// Current status
db.orders.createIndex({ "status.current": 1 }, { name: "idx_orders_status" });

// Created date index (cho reports)
db.orders.createIndex({ "createdAt": -1 }, { name: "idx_orders_created_date" });

// Driver assignment
db.orders.createIndex({ "assignedDriver": 1 }, { sparse: true, name: "idx_orders_driver" });

// Payment status
db.orders.createIndex({ "payment.status": 1 }, { name: "idx_orders_payment_status" });

// Compound index cho status và date
db.orders.createIndex({ "status.current": 1, "createdAt": -1 }, { name: "idx_orders_status_date" });

print("✅ Orders indexes đã được tạo");

// ====================================
// 6. REVIEWS COLLECTION INDEXES
// ====================================
print("📝 Tạo indexes cho collection 'reviews'...");

// Restaurant ID với created date
db.reviews.createIndex({ "restaurantId": 1, "createdAt": -1 }, { name: "idx_reviews_restaurant_date" });

// Customer ID
db.reviews.createIndex({ "customerId": 1 }, { name: "idx_reviews_customer" });

// Order ID (unique vì mỗi order chỉ có một review)
db.reviews.createIndex({ "orderId": 1 }, { unique: true, name: "idx_reviews_order" });

// Active status
db.reviews.createIndex({ "isActive": 1 }, { name: "idx_reviews_active" });

// Rating index
db.reviews.createIndex({ "restaurantReview.rating": -1 }, { name: "idx_reviews_rating" });

print("✅ Reviews indexes đã được tạo");

// ====================================
// 7. PROMOTIONS COLLECTION INDEXES
// ====================================
print("📝 Tạo indexes cho collection 'promotions'...");

// Code index (unique)
db.promotions.createIndex({ "code": 1 }, { unique: true, name: "idx_promotions_code" });

// Status và schedule dates
db.promotions.createIndex({ "status": 1, "schedule.startDate": 1, "schedule.endDate": 1 }, { name: "idx_promotions_active_schedule" });

// Created by index
db.promotions.createIndex({ "createdBy": 1 }, { name: "idx_promotions_creator" });

// Active status
db.promotions.createIndex({ "isActive": 1 }, { name: "idx_promotions_active" });

print("✅ Promotions indexes đã được tạo");

// ====================================
// 8. DRIVERS COLLECTION INDEXES
// ====================================
print("📝 Tạo indexes cho collection 'drivers'...");

// Phone index (unique)
db.drivers.createIndex({ "personalInfo.phone": 1 }, { unique: true, name: "idx_drivers_phone" });

// Location index cho current location
db.drivers.createIndex({ "status.currentLocation": "2dsphere" }, { sparse: true, name: "idx_drivers_location" });

// Online và available status
db.drivers.createIndex({ "status.isOnline": 1, "status.isAvailable": 1 }, { name: "idx_drivers_availability" });

// Verification status
db.drivers.createIndex({ "status.isVerified": 1 }, { name: "idx_drivers_verified" });

// Active status
db.drivers.createIndex({ "isActive": 1 }, { name: "idx_drivers_active" });

// Working areas index
db.drivers.createIndex({ "workInfo.workingAreas": 1 }, { name: "idx_drivers_areas" });

print("✅ Drivers indexes đã được tạo");

// ====================================
// 9. DELIVERIES COLLECTION INDEXES
// ====================================
print("📝 Tạo indexes cho collection 'deliveries'...");

// Order ID index (unique)
db.deliveries.createIndex({ "orderId": 1 }, { unique: true, name: "idx_deliveries_order" });

// Driver ID
db.deliveries.createIndex({ "driverId": 1 }, { name: "idx_deliveries_driver" });

// Status
db.deliveries.createIndex({ "status": 1 }, { name: "idx_deliveries_status" });

// Created date
db.deliveries.createIndex({ "createdAt": -1 }, { name: "idx_deliveries_date" });

print("✅ Deliveries indexes đã được tạo");

// ====================================
// 10. NOTIFICATIONS COLLECTION INDEXES
// ====================================
print("📝 Tạo indexes cho collection 'notifications'...");

// Recipient với created date
db.notifications.createIndex({ "recipientId": 1, "createdAt": -1 }, { name: "idx_notifications_recipient_date" });

// Read status với recipient
db.notifications.createIndex({ "recipientId": 1, "interaction.isRead": 1 }, { name: "idx_notifications_read_status" });

// Recipient type
db.notifications.createIndex({ "recipientType": 1 }, { name: "idx_notifications_recipient_type" });

// Expires date (cho cleanup)
db.notifications.createIndex({ "expiresAt": 1 }, { expireAfterSeconds: 0, name: "idx_notifications_expires" });

print("✅ Notifications indexes đã được tạo");

// ====================================
// 11. SUPPORT_TICKETS COLLECTION INDEXES
// ====================================
print("📝 Tạo indexes cho collection 'support_tickets'...");

// Ticket number (unique)
db.support_tickets.createIndex({ "ticketNumber": 1 }, { unique: true, name: "idx_tickets_number" });

// User ID với created date
db.support_tickets.createIndex({ "userId": 1, "createdAt": -1 }, { name: "idx_tickets_user_date" });

// Status
db.support_tickets.createIndex({ "status": 1 }, { name: "idx_tickets_status" });

// Assigned agent
db.support_tickets.createIndex({ "assignedAgent": 1 }, { sparse: true, name: "idx_tickets_agent" });

// Category
db.support_tickets.createIndex({ "category": 1 }, { name: "idx_tickets_category" });

// Priority
db.support_tickets.createIndex({ "priority": 1 }, { name: "idx_tickets_priority" });

print("✅ Support tickets indexes đã được tạo");

// ====================================
// 12. BLOGS COLLECTION INDEXES
// ====================================
print("📝 Tạo indexes cho collection 'blogs'...");

// Slug index (unique)
db.blogs.createIndex({ "slug": 1 }, { unique: true, name: "idx_blogs_slug" });

// Status và published date
db.blogs.createIndex({ "status": 1, "publishedAt": -1 }, { name: "idx_blogs_published" });

// Category
db.blogs.createIndex({ "category": 1 }, { name: "idx_blogs_category" });

// Featured
db.blogs.createIndex({ "isFeatured": 1, "status": 1 }, { name: "idx_blogs_featured" });

// Text search cho title và content
db.blogs.createIndex({ 
  "title": "text", 
  "excerpt": "text",
  "tags": "text"
}, { 
  name: "idx_blogs_text_search",
  weights: { "title": 10, "excerpt": 5, "tags": 3 }
});

print("✅ Blogs indexes đã được tạo");

// ====================================
// 13. VOUCHERS COLLECTION INDEXES
// ====================================
print("📝 Tạo indexes cho collection 'vouchers'...");

// User ID
db.vouchers.createIndex({ "userId": 1 }, { name: "idx_vouchers_user" });

// Code index
db.vouchers.createIndex({ "code": 1 }, { name: "idx_vouchers_code" });

// Active và expires date
db.vouchers.createIndex({ "validity.isActive": 1, "validity.expiresAt": 1 }, { name: "idx_vouchers_validity" });

// Used status
db.vouchers.createIndex({ "usage.isUsed": 1 }, { name: "idx_vouchers_used" });

// Promotion ID
db.vouchers.createIndex({ "promotionId": 1 }, { sparse: true, name: "idx_vouchers_promotion" });

print("✅ Vouchers indexes đã được tạo");

// ====================================
// 14. ANALYTICS COLLECTION INDEXES
// ====================================
print("📝 Tạo indexes cho collection 'analytics'...");

// Type và date
db.analytics.createIndex({ "type": 1, "date": -1 }, { name: "idx_analytics_type_date" });

// Date index
db.analytics.createIndex({ "date": -1 }, { name: "idx_analytics_date" });

print("✅ Analytics indexes đã được tạo");

// ====================================
// 15. APP_SETTINGS COLLECTION INDEXES
// ====================================
print("📝 Tạo indexes cho collection 'app_settings'...");

// Category index
db.app_settings.createIndex({ "category": 1 }, { name: "idx_settings_category" });

// Updated date
db.app_settings.createIndex({ "updatedAt": -1 }, { name: "idx_settings_updated" });

print("✅ App settings indexes đã được tạo");

// ====================================
// KIỂM TRA INDEXES ĐÃ TẠO
// ====================================
print("\n🔍 Kiểm tra indexes đã tạo:");

const collections = [
  'users', 'restaurants', 'categories', 'dishes', 'orders', 
  'reviews', 'promotions', 'drivers', 'deliveries', 'notifications',
  'support_tickets', 'blogs', 'vouchers', 'analytics', 'app_settings'
];

collections.forEach(collectionName => {
  const indexes = db[collectionName].getIndexes();
  print(`📊 Collection '${collectionName}': ${indexes.length} indexes`);
  indexes.forEach(index => {
    print(`   - ${index.name || 'unnamed'}: ${JSON.stringify(index.key)}`);
  });
});

print("\n✅ Tất cả indexes đã được tạo thành công!");
print("💡 Tip: Sử dụng db.collection.getIndexes() để xem indexes của một collection");
print("💡 Tip: Sử dụng db.collection.find().explain() để kiểm tra index usage"); 