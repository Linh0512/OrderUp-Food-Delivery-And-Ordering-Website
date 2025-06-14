// Script để đổi tên trường từ userId sang customerId trong collection reviews và orders
// Lưu file với tên rename_user_id.js

// Đổi tên trong collection reviews
db.reviews.updateMany(
  { "customerId": { $exists: true } },
  { $rename: { "customerId": "customerId" } }
);

// Đổi tên trong collection orders
db.orders.updateMany(
  { "userId": { $exists: true } },
  { $rename: { "customerId": "userId" } }
);

// Kiểm tra kết quả
print("Reviews collection after update:");
db.reviews.findOne();

print("\nOrders collection after update:");
db.orders.findOne(); 