// Script để debug kết nối MongoDB và kiểm tra dữ liệu thực tế
print("=== DEBUG MONGODB CONNECTION ===");

// 1. Liệt kê tất cả databases
print("\n1. Tất cả databases:");
const databases = db.adminCommand("listDatabases");
for (let dbInfo of databases.databases) {
    print(`- ${dbInfo.name} (size: ${dbInfo.sizeOnDisk} bytes)`);
}

// 2. Kiểm tra từng database có dữ liệu
for (let dbInfo of databases.databases) {
    if (dbInfo.name !== 'admin' && dbInfo.name !== 'local' && dbInfo.name !== 'config') {
        print(`\n=== Checking database: ${dbInfo.name} ===`);
        use(dbInfo.name);
        
        const collections = db.getCollectionNames();
        print(`Collections: ${collections.join(', ')}`);
        
        for (let collName of collections) {
            const count = db[collName].countDocuments();
            print(`- ${collName}: ${count} documents`);
            
            // Hiển thị 1 document mẫu để kiểm tra cấu trúc
            if (count > 0) {
                const sample = db[collName].findOne();
                print(`  Sample document keys: ${Object.keys(sample).join(', ')}`);
                
                // Kiểm tra xem có trường Date nào bị lưu dưới dạng number không
                if (collName === 'restaurants') {
                    if (sample.createdAt) {
                        print(`  createdAt type: ${typeof sample.createdAt}, value: ${sample.createdAt}`);
                    }
                    if (sample.updatedAt) {
                        print(`  updatedAt type: ${typeof sample.updatedAt}, value: ${sample.updatedAt}`);
                    }
                    if (sample.profile && sample.profile.dateOfBirth) {
                        print(`  profile.dateOfBirth type: ${typeof sample.profile.dateOfBirth}, value: ${sample.profile.dateOfBirth}`);
                    }
                }
            }
        }
    }
}

print("\n=== END DEBUG ==="); 