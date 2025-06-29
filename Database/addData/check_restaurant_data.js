// Script để kiểm tra cấu trúc dữ liệu restaurants thực tế
use('food_delivery_app'); // Dùng database name bạn đã xác nhận

print("=== Kiểm tra dữ liệu restaurants ===");

const restaurantCount = db.restaurants.countDocuments();
print(`Tổng số restaurants: ${restaurantCount}`);

if (restaurantCount > 0) {
    const sampleRestaurant = db.restaurants.findOne();
    print("\n=== Cấu trúc dữ liệu restaurant mẫu ===");
    print(`Restaurant ID: ${sampleRestaurant._id}`);
    
    // Kiểm tra các field Date
    if (sampleRestaurant.createdAt) {
        print(`createdAt: ${sampleRestaurant.createdAt} (type: ${typeof sampleRestaurant.createdAt})`);
    }
    if (sampleRestaurant.updatedAt) {
        print(`updatedAt: ${sampleRestaurant.updatedAt} (type: ${typeof sampleRestaurant.updatedAt})`);
    }
    
    // Kiểm tra hostInfo.dateOfBirth
    if (sampleRestaurant.hostInfo && sampleRestaurant.hostInfo.dateOfBirth) {
        print(`hostInfo.dateOfBirth: ${sampleRestaurant.hostInfo.dateOfBirth} (type: ${typeof sampleRestaurant.hostInfo.dateOfBirth})`);
    }
    
    // Kiểm tra operatingHours
    if (sampleRestaurant.operatingHours && sampleRestaurant.operatingHours.length > 0) {
        print("\n=== Operating Hours ===");
        for (let i = 0; i < sampleRestaurant.operatingHours.length; i++) {
            const hour = sampleRestaurant.operatingHours[i];
            print(`operatingHours[${i}]:`);
            print(`  dayOfWeek: ${hour.dayOfWeek} (type: ${typeof hour.dayOfWeek})`);
            if (hour.openTime) {
                print(`  openTime: ${hour.openTime} (type: ${typeof hour.openTime})`);
            }
            if (hour.closeTime) {
                print(`  closeTime: ${hour.closeTime} (type: ${typeof hour.closeTime})`);
            }
            if (hour.isOpen !== undefined) {
                print(`  isOpen: ${hour.isOpen} (type: ${typeof hour.isOpen})`);
            }
        }
    }
    
    // Hiển thị toàn bộ cấu trúc để debug
    print("\n=== Toàn bộ keys của restaurant ===");
    print(`Keys: ${Object.keys(sampleRestaurant).join(', ')}`);
    
    // Kiểm tra xem có field nào là Date nhưng entity expect int không
    function checkFieldTypes(obj, path = '') {
        for (let key in obj) {
            const fullPath = path ? `${path}.${key}` : key;
            const value = obj[key];
            
            if (value instanceof Date) {
                print(`FOUND DATE: ${fullPath} = ${value} (Date)`);
            } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                checkFieldTypes(value, fullPath);
            } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
                checkFieldTypes(value[0], `${fullPath}[0]`);
            }
        }
    }
    
    print("\n=== Tất cả các field Date trong restaurant ===");
    checkFieldTypes(sampleRestaurant);
}

print("\n=== Kết thúc kiểm tra ==="); 