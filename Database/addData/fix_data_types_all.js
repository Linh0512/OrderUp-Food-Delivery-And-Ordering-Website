// Script để kiểm tra và sửa các trường Date trong tất cả database có thể
print("=== Đang kiểm tra tất cả databases ===");

// Liệt kê tất cả databases
const databases = db.adminCommand("listDatabases");
print("Các database có sẵn:");
for (let dbInfo of databases.databases) {
    if (dbInfo.name !== 'admin' && dbInfo.name !== 'local' && dbInfo.name !== 'config') {
        print(`- ${dbInfo.name}`);
    }
}

// Hàm chuyển đổi timestamp thành Date
function convertTimestampToDate(timestamp) {
    if (typeof timestamp === 'number') {
        return new Date(timestamp);
    }
    return timestamp;
}

function fixDataInDatabase(dbName) {
    print(`\n=== Đang kiểm tra database: ${dbName} ===`);
    use(dbName);
    
    // Kiểm tra xem có collection restaurants không
    const collections = db.getCollectionNames();
    print(`Collections trong ${dbName}: ${collections.join(', ')}`);
    
    if (!collections.includes('restaurants')) {
        print(`Database ${dbName} không có collection restaurants, bỏ qua.`);
        return;
    }
    
    print(`\n=== Bắt đầu sửa dữ liệu trong database: ${dbName} ===`);

    // 1. Sửa collection restaurants
    print("Đang sửa collection restaurants...");
    const restaurants = db.restaurants.find({}).toArray();
    print(`Tìm thấy ${restaurants.length} restaurants`);
    
    for (let restaurant of restaurants) {
        let needUpdate = false;
        let updateObj = {};
        
        // Sửa các trường Date ở level root
        if (restaurant.createdAt && typeof restaurant.createdAt === 'number') {
            updateObj.createdAt = convertTimestampToDate(restaurant.createdAt);
            needUpdate = true;
        }
        if (restaurant.updatedAt && typeof restaurant.updatedAt === 'number') {
            updateObj.updatedAt = convertTimestampToDate(restaurant.updatedAt);
            needUpdate = true;
        }
        
        // Sửa trường dateOfBirth trong profile
        if (restaurant.profile && restaurant.profile.dateOfBirth && typeof restaurant.profile.dateOfBirth === 'number') {
            updateObj['profile.dateOfBirth'] = convertTimestampToDate(restaurant.profile.dateOfBirth);
            needUpdate = true;
        }
        
        if (needUpdate) {
            db.restaurants.updateOne({_id: restaurant._id}, {$set: updateObj});
            print(`Đã cập nhật restaurant ${restaurant._id}`);
        }
    }

    // 2. Sửa collection orders nếu có
    if (collections.includes('orders')) {
        print("Đang sửa collection orders...");
        const orders = db.orders.find({}).toArray();
        print(`Tìm thấy ${orders.length} orders`);
        
        for (let order of orders) {
            let needUpdate = false;
            let updateObj = {};
            
            // Sửa các trường Date ở level root
            if (order.createdAt && typeof order.createdAt === 'number') {
                updateObj.createdAt = convertTimestampToDate(order.createdAt);
                needUpdate = true;
            }
            if (order.updatedAt && typeof order.updatedAt === 'number') {
                updateObj.updatedAt = convertTimestampToDate(order.updatedAt);
                needUpdate = true;
            }
            
            // Sửa các Date trong deliveryInfo
            if (order.deliveryInfo) {
                if (order.deliveryInfo.estimatedDeliveryTime && typeof order.deliveryInfo.estimatedDeliveryTime === 'number') {
                    updateObj['deliveryInfo.estimatedDeliveryTime'] = convertTimestampToDate(order.deliveryInfo.estimatedDeliveryTime);
                    needUpdate = true;
                }
                if (order.deliveryInfo.actualDeliveryTime && typeof order.deliveryInfo.actualDeliveryTime === 'number') {
                    updateObj['deliveryInfo.actualDeliveryTime'] = convertTimestampToDate(order.deliveryInfo.actualDeliveryTime);
                    needUpdate = true;
                }
            }
            
            // Sửa các Date trong payment
            if (order.payment && order.payment.paidAt && typeof order.payment.paidAt === 'number') {
                updateObj['payment.paidAt'] = convertTimestampToDate(order.payment.paidAt);
                needUpdate = true;
            }
            
            // Sửa các Date trong timing
            if (order.timing) {
                ['placedAt', 'confirmedAt', 'preparingAt', 'readyAt', 'pickedUpAt', 'deliveredAt'].forEach(field => {
                    if (order.timing[field] && typeof order.timing[field] === 'number') {
                        updateObj[`timing.${field}`] = convertTimestampToDate(order.timing[field]);
                        needUpdate = true;
                    }
                });
            }
            
            // Sửa các Date trong status.history
            if (order.status && order.status.history && Array.isArray(order.status.history)) {
                for (let i = 0; i < order.status.history.length; i++) {
                    if (order.status.history[i].timestamp && typeof order.status.history[i].timestamp === 'number') {
                        updateObj[`status.history.${i}.timestamp`] = convertTimestampToDate(order.status.history[i].timestamp);
                        needUpdate = true;
                    }
                }
            }
            
            if (needUpdate) {
                db.orders.updateOne({_id: order._id}, {$set: updateObj});
                print(`Đã cập nhật order ${order._id}`);
            }
        }
    }

    // 3. Sửa collection vouchers nếu có
    if (collections.includes('vouchers')) {
        print("Đang sửa collection vouchers...");
        const vouchers = db.vouchers.find({}).toArray();
        print(`Tìm thấy ${vouchers.length} vouchers`);
        
        for (let voucher of vouchers) {
            let needUpdate = false;
            let updateObj = {};
            
            // Sửa các trường Date ở level root
            if (voucher.createdAt && typeof voucher.createdAt === 'number') {
                updateObj.createdAt = convertTimestampToDate(voucher.createdAt);
                needUpdate = true;
            }
            if (voucher.updatedAt && typeof voucher.updatedAt === 'number') {
                updateObj.updatedAt = convertTimestampToDate(voucher.updatedAt);
                needUpdate = true;
            }
            
            // Sửa các Date trong validity
            if (voucher.validity) {
                if (voucher.validity.issuedAt && typeof voucher.validity.issuedAt === 'number') {
                    updateObj['validity.issuedAt'] = convertTimestampToDate(voucher.validity.issuedAt);
                    needUpdate = true;
                }
                if (voucher.validity.expiresAt && typeof voucher.validity.expiresAt === 'number') {
                    updateObj['validity.expiresAt'] = convertTimestampToDate(voucher.validity.expiresAt);
                    needUpdate = true;
                }
            }
            
            // Sửa các Date trong usage array
            if (voucher.usage && Array.isArray(voucher.usage)) {
                for (let i = 0; i < voucher.usage.length; i++) {
                    if (voucher.usage[i].usedAt && typeof voucher.usage[i].usedAt === 'number') {
                        updateObj[`usage.${i}.usedAt`] = convertTimestampToDate(voucher.usage[i].usedAt);
                        needUpdate = true;
                    }
                }
            }
            
            if (needUpdate) {
                db.vouchers.updateOne({_id: voucher._id}, {$set: updateObj});
                print(`Đã cập nhật voucher ${voucher._id}`);
            }
        }
    }

    // 4. Sửa collection reviews nếu có
    if (collections.includes('reviews')) {
        print("Đang sửa collection reviews...");
        const reviews = db.reviews.find({}).toArray();
        print(`Tìm thấy ${reviews.length} reviews`);
        
        for (let review of reviews) {
            let needUpdate = false;
            let updateObj = {};
            
            // Sửa các trường Date ở level root
            if (review.createdAt && typeof review.createdAt === 'number') {
                updateObj.createdAt = convertTimestampToDate(review.createdAt);
                needUpdate = true;
            }
            if (review.updatedAt && typeof review.updatedAt === 'number') {
                updateObj.updatedAt = convertTimestampToDate(review.updatedAt);
                needUpdate = true;
            }
            
            if (needUpdate) {
                db.reviews.updateOne({_id: review._id}, {$set: updateObj});
                print(`Đã cập nhật review ${review._id}`);
            }
        }
    }
    
    print(`=== Hoàn thành sửa dữ liệu trong database: ${dbName} ===`);
}

// Thử các database names phổ biến
const possibleDbNames = ['food_delivery_app', 'OrderUpDB', 'orderup', 'orderUp'];

for (let dbName of possibleDbNames) {
    try {
        fixDataInDatabase(dbName);
    } catch (error) {
        print(`Lỗi khi xử lý database ${dbName}: ${error}`);
    }
}

print("\n=== Hoàn thành kiểm tra tất cả databases ==="); 