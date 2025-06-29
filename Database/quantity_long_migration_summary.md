# Tóm tắt Migration: Chuyển đổi quantity từ int thành Long

## Mục tiêu
Thay đổi các trường `quantity` từ kiểu `int` thành `Long` để tránh bị MongoConfig converters chuyển đổi không mong muốn từ `int` thành `Date`, tương tự như đã làm với trường `remainingValue` trong voucher.

## Các file đã được sửa đổi:

### 1. Entity Classes
- **`ShoppingCart.java`**: Thay đổi `quantity` trong `CartItem` từ `int` thành `Long` với annotation `@Field(name = "quantity", targetType = FieldType.INT32)`
- **`Order.java`**: Thay đổi `quantity` trong `OrderItem` từ `Long` thành `Long` với annotation `@Field(name = "quantity", targetType = FieldType.INT32)` và thêm import `FieldType`

### 2. Service Classes
- **`ShoppingCartService.java`**: 
  - Cập nhật các phương thức để sử dụng `Long.valueOf()` khi set quantity
  - Sử dụng `.intValue()` khi convert về DTO

### 3. Mapper Classes
- **`UserOrderHistoryMapper.java`**: 
  - Sử dụng `item.getQuantity().intValue()` khi mapping sang DTO
  - Sử dụng `mapToLong()` và cast về `int` cho tổng quantity

- **`ShoppingCartMapper.java`**: 
  - Sử dụng `item.getQuantity().intValue()` khi mapping sang DTO

- **`ReviewMapper.java`**: 
  - Sử dụng `item.getQuantity().intValue()` khi mapping sang OrderItem DTO

### 4. Service Classes khác
- **`ReviewService.java`**: 
  - Sử dụng `item.getQuantity().intValue()` khi tạo ReviewDTO.OrderItem

## Nguyên tắc áp dụng:

1. **Entity level**: Sử dụng `Long` với annotation `@Field(name = "quantity", targetType = FieldType.INT32)` để lưu vào database dưới dạng INT32
2. **DTO level**: Vẫn giữ `int` để tương thích với frontend và API
3. **Conversion**: Sử dụng `.intValue()` khi chuyển từ entity sang DTO, và `Long.valueOf()` khi chuyển từ DTO sang entity

## Lợi ích:
- Tránh được MongoConfig converters chuyển đổi `int` thành `Date`
- Database vẫn lưu dữ liệu dưới dạng INT32 
- API interface không thay đổi (vẫn sử dụng int)
- Tương thích ngược với dữ liệu cũ

## Kết quả:
- Project compile thành công
- Không có lỗi linter
- Quantity fields được bảo vệ khỏi MongoConfig converter interference 