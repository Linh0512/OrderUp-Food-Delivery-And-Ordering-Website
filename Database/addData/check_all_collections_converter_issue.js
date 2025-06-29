// Script kiểm tra converter issues trong tất cả collections
// Để tìm ra collections nào còn có Date fields bị sai type

print("=== KIỂM TRA CONVERTER ISSUES TRONG TẤT CẢ COLLECTIONS ===");

// Kết nối database
use('food_delivery_app');

// Danh sách các collections cần kiểm tra
const collections = ['users', 'restaurants', 'orders', 'vouchers', 'reviews', 'dishes'];

collections.forEach(collectionName => {
    print(`\n🔍 KIỂM TRA COLLECTION: ${collectionName.toUpperCase()}`);
    
    try {
        // Kiểm tra xem collection có tồn tại không
        const collectionExists = db.getCollectionNames().includes(collectionName);
        if (!collectionExists) {
            print(`  ❌ Collection ${collectionName} không tồn tại`);
            return;
        }
        
        const totalDocs = db[collectionName].countDocuments();
        print(`  📊 Tổng số documents: ${totalDocs}`);
        
        if (totalDocs === 0) {
            print(`  ⚠️  Collection ${collectionName} rỗng`);
            return;
        }
        
        // Lấy 1 sample document để xem structure
        const sample = db[collectionName].findOne();
        
        print(`  📋 Sample document ID: ${sample._id}`);
        
        // Function để tìm Date fields trong object
        function findDateFields(obj, path = '', dateFields = []) {
            for (let key in obj) {
                const currentPath = path ? `${path}.${key}` : key;
                const value = obj[key];
                
                if (value instanceof Date) {
                    // Kiểm tra xem field name có gợi ý là int field không
                    const intLikeNames = [
                        'quantity', 'price', 'total', 'amount', 'count', 'number', 'num',
                        'dayOfWeek', 'deliveryRadius', 'estimatedDeliveryTime', 'totalReviews',
                        'rating', 'star', 'point', 'score', 'age', 'year', 'month', 'day',
                        'hour', 'minute', 'second', 'duration', 'time', 'length', 'size',
                        'weight', 'height', 'width', 'radius', 'distance', 'speed'
                    ];
                    
                    const isLikelyIntField = intLikeNames.some(intName => 
                        currentPath.toLowerCase().includes(intName.toLowerCase())
                    );
                    
                    dateFields.push({
                        path: currentPath,
                        value: value,
                        isLikelyIntField: isLikelyIntField
                    });
                } else if (Array.isArray(value) && value.length > 0) {
                    // Kiểm tra array elements
                    value.forEach((item, index) => {
                        if (typeof item === 'object' && item !== null) {
                            findDateFields(item, `${currentPath}[${index}]`, dateFields);
                        }
                    });
                } else if (typeof value === 'object' && value !== null) {
                    // Recursively check nested objects
                    findDateFields(value, currentPath, dateFields);
                }
            }
            return dateFields;
        }
        
        // Tìm tất cả Date fields trong sample
        const dateFields = findDateFields(sample);
        
        if (dateFields.length > 0) {
            print(`  🔍 Tìm thấy ${dateFields.length} Date fields:`);
            
            dateFields.forEach(field => {
                const flag = field.isLikelyIntField ? "⚠️  SUSPICIOUS" : "✅ OK";
                print(`    ${flag} ${field.path}: ${field.value}`);
            });
            
            // Kiểm tra các suspicious fields trong toàn bộ collection
            const suspiciousFields = dateFields.filter(f => f.isLikelyIntField);
            
            if (suspiciousFields.length > 0) {
                print(`  🚨 Kiểm tra ${suspiciousFields.length} suspicious fields trong toàn bộ collection:`);
                
                suspiciousFields.forEach(field => {
                    try {
                        const count = db[collectionName].countDocuments({
                            [field.path]: { $type: "date" }
                        });
                        
                        if (count > 0) {
                            print(`    ❌ ${field.path}: ${count} documents có Date value (có thể gây lỗi converter)`);
                        } else {
                            print(`    ✅ ${field.path}: 0 documents có Date value`);
                        }
                    } catch (error) {
                        print(`    ⚠️  ${field.path}: Không thể kiểm tra - ${error.message}`);
                    }
                });
            }
        } else {
            print(`  ✅ Không tìm thấy Date fields`);
        }
        
    } catch (error) {
        print(`  ❌ Lỗi khi kiểm tra collection ${collectionName}: ${error.message}`);
    }
});

print("\n🎯 KIỂM TRA ĐẶC BIỆT - USERS COLLECTION:");

// Kiểm tra đặc biệt users collection vì logs có mention
try {
    const sampleUser = db.users.findOne();
    if (sampleUser) {
        print("Sample user structure:");
        
        // Kiểm tra các fields thường gặp trong users
        const userFields = ['loyaltyPoints', 'totalOrders', 'rating', 'point'];
        
        userFields.forEach(field => {
            if (sampleUser[field] !== undefined) {
                print(`  ${field}: ${sampleUser[field]} (type: ${typeof sampleUser[field]})`);
                
                if (sampleUser[field] instanceof Date) {
                    const affectedCount = db.users.countDocuments({
                        [field]: { $type: "date" }
                    });
                    print(`    ❌ ${affectedCount} users có ${field} là Date type!`);
                }
            }
        });
        
        // Kiểm tra nested objects trong user
        if (sampleUser.profile) {
            print("User profile structure:");
            for (let key in sampleUser.profile) {
                const value = sampleUser.profile[key];
                print(`  profile.${key}: ${value} (type: ${typeof value})`);
                
                if (value instanceof Date && key !== 'dateOfBirth' && key !== 'createdAt' && key !== 'updatedAt') {
                    const affectedCount = db.users.countDocuments({
                        [`profile.${key}`]: { $type: "date" }
                    });
                    print(`    ❌ ${affectedCount} users có profile.${key} là Date type!`);
                }
            }
        }
    }
} catch (error) {
    print(`❌ Lỗi khi kiểm tra users: ${error.message}`);
}

print("\n✅ KIỂM TRA TẤT CẢ COLLECTIONS HOÀN THÀNH!"); 