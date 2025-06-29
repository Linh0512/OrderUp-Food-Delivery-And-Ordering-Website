// Script debug để test từng restaurant một và tìm ra restaurant gây lỗi
// Simulate việc Spring MongoDB load từng restaurant

print("=== DEBUG RESTAURANT FINDALL ISSUE ===");

use('food_delivery_app');

// Lấy tất cả restaurant IDs
const allRestaurants = db.restaurants.find({}, { _id: 1, "basicInfo.name": 1 }).toArray();

print(`\n📊 Tổng số restaurants: ${allRestaurants.length}`);

let problematicRestaurants = [];

print("\n🔍 KIỂM TRA TỪNG RESTAURANT:");

allRestaurants.forEach((restaurant, index) => {
    try {
        print(`\n${index + 1}. Testing Restaurant: ${restaurant.basicInfo?.name || 'N/A'} (${restaurant._id})`);
        
        // Load full restaurant document
        const fullRestaurant = db.restaurants.findOne({ _id: restaurant._id });
        
        if (!fullRestaurant) {
            print(`  ❌ Không tìm thấy restaurant`);
            return;
        }
        
        // Kiểm tra từng field có thể gây vấn đề
        let hasIssues = false;
        let issues = [];
        
        // Helper function để check tất cả fields recursively
        function checkFields(obj, path = '') {
            for (let key in obj) {
                const currentPath = path ? `${path}.${key}` : key;
                const value = obj[key];
                
                if (value instanceof Date) {
                    // Kiểm tra Date fields có gợi ý int
                    const suspiciousNames = [
                        'quantity', 'price', 'total', 'amount', 'count', 'number',
                        'dayOfWeek', 'deliveryRadius', 'estimatedDeliveryTime', 'totalReviews',
                        'rating', 'star', 'point', 'score', 'age', 'radius', 'time',
                        'preparationTime', 'basePrice', 'discountPrice'
                    ];
                    
                    const isSuspicious = suspiciousNames.some(name => 
                        currentPath.toLowerCase().includes(name.toLowerCase())
                    );
                    
                    if (isSuspicious) {
                        issues.push(`${currentPath}: Date (${value}) - SUSPICIOUS`);
                        hasIssues = true;
                    }
                } else if (Array.isArray(value)) {
                    // Check array elements
                    value.forEach((item, index) => {
                        if (typeof item === 'object' && item !== null) {
                            checkFields(item, `${currentPath}[${index}]`);
                        }
                    });
                } else if (typeof value === 'object' && value !== null) {
                    // Check nested objects
                    checkFields(value, currentPath);
                }
            }
        }
        
        // Kiểm tra tất cả fields
        checkFields(fullRestaurant);
        
        if (hasIssues) {
            print(`  ⚠️  FOUND ISSUES:`);
            issues.forEach(issue => print(`    ${issue}`));
            problematicRestaurants.push({
                id: restaurant._id,
                name: restaurant.basicInfo?.name || 'N/A',
                issues: issues
            });
        } else {
            print(`  ✅ OK - No suspicious Date fields`);
        }
        
    } catch (error) {
        print(`  ❌ ERROR: ${error.message}`);
        problematicRestaurants.push({
            id: restaurant._id,
            name: restaurant.basicInfo?.name || 'N/A',
            error: error.message
        });
    }
});

print("\n📋 TỔNG HỢP RESTAURANTS CÓ VẤN ĐỀ:");

if (problematicRestaurants.length === 0) {
    print("✅ Không tìm thấy restaurants có vấn đề Date fields");
} else {
    print(`❌ Tìm thấy ${problematicRestaurants.length} restaurants có vấn đề:`);
    
    problematicRestaurants.forEach((restaurant, index) => {
        print(`\n${index + 1}. ${restaurant.name} (${restaurant.id})`);
        if (restaurant.error) {
            print(`   Error: ${restaurant.error}`);
        } else if (restaurant.issues) {
            restaurant.issues.forEach(issue => print(`   ${issue}`));
        }
    });
}

// Kiểm tra query performance
print("\n🚀 TESTING QUERY PERFORMANCE:");

try {
    const startTime = new Date();
    const restaurants = db.restaurants.find({}).limit(5).toArray();
    const endTime = new Date();
    
    print(`✅ Query thành công: ${restaurants.length} restaurants trong ${endTime - startTime}ms`);
    
    // Test findAll equivalent
    const startTime2 = new Date();
    const allRestaurantsTest = db.restaurants.find({}).toArray();
    const endTime2 = new Date();
    
    print(`✅ FindAll test thành công: ${allRestaurantsTest.length} restaurants trong ${endTime2 - startTime2}ms`);
    
} catch (error) {
    print(`❌ Query lỗi: ${error.message}`);
}

print("\n✅ DEBUG HOÀN THÀNH!");

// Nếu không tìm thấy vấn đề ở restaurants, có thể vấn đề là ở chỗ khác
if (problematicRestaurants.length === 0) {
    print("\n💡 GỢI Ý:");
    print("Nếu không có restaurants nào có vấn đề nhưng API vẫn lỗi,");
    print("có thể vấn đề nằm ở:");
    print("1. Entity mapping annotations bị sai");
    print("2. Spring MongoDB converter configuration");
    print("3. Related entities được lazy load (dishes, reviews)");
    print("4. Cache issues");
} 