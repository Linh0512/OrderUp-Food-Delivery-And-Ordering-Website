// Script kiểm tra chi tiết data types và structure trong restaurants collection
// Để tìm ra nguyên nhân thực sự của ConverterNotFoundException

print("=== KIỂM TRA CHI TIẾT RESTAURANTS DATA TYPES ===");

// Kết nối database
use('food_delivery_app');

// Lấy 1 restaurant để xem structure chi tiết
const sampleRestaurant = db.restaurants.findOne();

print("\n📋 STRUCTURE CỦA 1 RESTAURANT SAMPLE:");
print("Restaurant ID:", sampleRestaurant._id);
print("Restaurant Name:", sampleRestaurant.basicInfo?.name);

print("\n🔍 CHI TIẾT CÁC FIELDS VÀ TYPES:");

// Kiểm tra từng field một cách chi tiết
function checkFieldType(obj, path = '') {
    for (let key in obj) {
        const fullPath = path ? `${path}.${key}` : key;
        const value = obj[key];
        const type = typeof value;
        
        if (value instanceof Date) {
            print(`${fullPath}: Date - ${value}`);
        } else if (value instanceof ObjectId) {
            print(`${fullPath}: ObjectId - ${value}`);
        } else if (Array.isArray(value)) {
            print(`${fullPath}: Array[${value.length}] - ${type}`);
            if (value.length > 0) {
                print(`  First element type: ${typeof value[0]}`);
            }
        } else if (type === 'object' && value !== null) {
            print(`${fullPath}: Object - ${type}`);
            // Recursively check nested objects
            if (Object.keys(value).length < 10) { // Avoid too deep recursion
                checkFieldType(value, fullPath);
            }
        } else {
            print(`${fullPath}: ${type} - ${value}`);
        }
    }
}

checkFieldType(sampleRestaurant);

print("\n🔢 KIỂM TRA CÁC INT FIELDS CỤ THỂ:");

// Kiểm tra các fields mà chúng ta nghi ngờ
const fieldsToCheck = ['dayOfWeek', 'deliveryRadius', 'estimatedDeliveryTime', 'totalReviews'];

fieldsToCheck.forEach(field => {
    const value = sampleRestaurant[field];
    print(`${field}:`);
    print(`  Value: ${value}`);
    print(`  Type: ${typeof value}`);
    print(`  Is Number: ${typeof value === 'number'}`);
    print(`  Is Date: ${value instanceof Date}`);
    print(`  Constructor: ${value?.constructor?.name}`);
    print("");
});

print("\n📊 THỐNG KÊ TYPES TRONG TOÀN BỘ COLLECTION:");

// Aggregate để xem data types
const typeStats = db.restaurants.aggregate([
    {
        $project: {
            dayOfWeek_type: { $type: "$dayOfWeek" },
            deliveryRadius_type: { $type: "$deliveryRadius" },
            estimatedDeliveryTime_type: { $type: "$estimatedDeliveryTime" },
            totalReviews_type: { $type: "$totalReviews" }
        }
    },
    {
        $group: {
            _id: {
                dayOfWeek: "$dayOfWeek_type",
                deliveryRadius: "$deliveryRadius_type", 
                estimatedDeliveryTime: "$estimatedDeliveryTime_type",
                totalReviews: "$totalReviews_type"
            },
            count: { $sum: 1 }
        }
    },
    { $sort: { count: -1 } }
]).toArray();

print("Type combinations found:");
typeStats.forEach(stat => {
    print(`Count: ${stat.count}`);
    print(`  dayOfWeek: ${stat._id.dayOfWeek}`);
    print(`  deliveryRadius: ${stat._id.deliveryRadius}`);
    print(`  estimatedDeliveryTime: ${stat._id.estimatedDeliveryTime}`);
    print(`  totalReviews: ${stat._id.totalReviews}`);
    print("");
});

print("\n🎯 KIỂM TRA ENTITY MAPPING TRONG JAVA:");

// Lấy restaurant với full structure để test
const fullRestaurant = db.restaurants.findOne({}, {
    _id: 1,
    basicInfo: 1,
    deliveryInfo: 1,
    dayOfWeek: 1,
    deliveryRadius: 1,
    estimatedDeliveryTime: 1,
    totalReviews: 1,
    rating: 1,
    coordinates: 1
});

print("Full restaurant object for Java mapping test:");
print(JSON.stringify(fullRestaurant, null, 2));

print("\n✅ KIỂM TRA HOÀN THÀNH!");
print("Nếu tất cả fields đều là number type nhưng vẫn lỗi converter,");
print("thì vấn đề có thể là ở entity mapping trong Java code."); 