# BÁO CÁO CHI TIẾT USE CASE VÀ ACTIVITY DIAGRAM
## DỰ ÁN ORDERUP - ỨNG DỤNG ĐẶT ĐỒ ĂN TRỰC TUYẾN

---

## 1. TỔNG QUAN HỆ THỐNG

OrderUp là hệ thống đặt đồ ăn trực tuyến với kiến trúc full-stack hiện đại, phục vụ 3 nhóm người dùng chính:

### 1.1. Actors Chính
- **Customer (User)**: Khách hàng đặt đồ ăn, theo dõi đơn hàng
- **Restaurant Host**: Chủ nhà hàng quản lý cửa hàng, menu và đơn hàng  
- **Admin**: Quản trị viên hệ thống, phê duyệt nhà hàng và quản lý người dùng

### 1.2. Phạm vi Hệ thống
- Đặt đồ ăn trực tuyến với giao diện thân thiện
- Quản lý nhà hàng và menu động
- Xử lý thanh toán đa dạng (thẻ, ví điện tử, tiền mặt)
- Hệ thống đánh giá và review
- Quản trị tập trung cho admin

---

## 2. USE CASE DIAGRAM CHI TIẾT

**Diagram trên** hiển thị mối quan hệ giữa các use case của từng actor và shared components. Các màu sắc khác nhau đại diện cho từng nhóm người dùng:
- **Xanh dương**: Customer use cases
- **Vàng**: Restaurant Host use cases  
- **Hồng**: Admin use cases

### 2.1. Customer Use Cases

#### UC01: Đăng ký tài khoản
**Mô tả**: Customer tạo tài khoản mới trong hệ thống  
**Actor**: Customer  
**Preconditions**: Chưa có tài khoản  
**Main Flow**: 
1. Truy cập trang đăng ký
2. Nhập thông tin cá nhân (email, password, tên, SĐT)
3. Hệ thống validate và tạo account
4. Gửi email verification
5. Kích hoạt tài khoản
**Postconditions**: Tài khoản được tạo và có thể đăng nhập

**Business Rules**:
- Email phải unique trong toàn hệ thống
- Password tối thiểu 8 ký tự, có uppercase, lowercase, số
- Phone number phải đúng định dạng Việt Nam
- Mặc định role="user", loyaltyPoints=0

#### UC02: Tìm kiếm nhà hàng  
**Mô tả**: Tìm và lọc danh sách nhà hàng theo tiêu chí  
**Actor**: Customer  
**Preconditions**: Đã có hoặc chưa đăng nhập  
**Main Flow**:
1. Nhập từ khóa tìm kiếm
2. Áp dụng filters (loại món, giá, rating)
3. Hệ thống query database và return results
4. Hiển thị danh sách restaurants phù hợp
**Postconditions**: Danh sách restaurant phù hợp được hiển thị

**Technical Implementation**:
- Frontend gọi `/api/shop/search` với parameters
- Backend sử dụng MongoDB text search và aggregation
- Áp dụng pagination để tối ưu performance
- Real-time filtering với debounce

#### UC03: Xem chi tiết nhà hàng
**Mô tả**: Xem thông tin chi tiết và menu của nhà hàng
**Actor**: Customer
**Preconditions**: Đã chọn restaurant từ danh sách
**Main Flow**:
1. Click vào restaurant card
2. Load thông tin chi tiết restaurant
3. Hiển thị menu, categories, reviews
4. Customer có thể browse dishes
**Postconditions**: Thông tin đầy đủ về restaurant được hiển thị

**API Calls**:
- `/api/shop/detail/{restaurantId}` - Restaurant details
- `/api/dish/restaurant/{restaurantId}` - Menu items  
- `/api/categories/restaurant/{restaurantId}` - Categories
- `/api/review/restaurant/{restaurantId}` - Reviews

#### UC04: Thêm món vào giỏ hàng
**Mô tả**: Chọn món ăn với options và thêm vào cart
**Actor**: Customer  
**Preconditions**: Đang xem menu, món ăn available
**Main Flow**:
1. Chọn món ăn từ menu
2. Cấu hình options (size, topping, etc.)
3. Chọn số lượng
4. Thêm vào cart
5. Cập nhật cart total
**Postconditions**: Món ăn được thêm vào shopping cart

**Validation Rules**:
- Cart chỉ chứa items từ 1 restaurant
- Required options phải được chọn
- Quantity: min=1, max=10 per dish
- Special instructions tối đa 200 ký tự

#### UC05: Đặt hàng và thanh toán
**Mô tả**: Hoàn tất đơn hàng và xử lý payment
**Actor**: Customer
**Preconditions**: Có items trong cart, đã đăng nhập
**Main Flow**:
1. Review cart items
2. Chọn địa chỉ giao hàng
3. Chọn phương thức thanh toán
4. Xác nhận đơn hàng
5. Xử lý payment
6. Tạo order record
**Postconditions**: Đơn hàng được tạo và payment processed

**Payment Methods**:
- Cash on Delivery (COD)
- Credit/Debit Cards
- E-wallets (ZaloPay, MoMo)
- Stored payment methods

### 2.2. Restaurant Host Use Cases

#### UC06: Quản lý menu
**Mô tả**: CRUD operations cho menu và dishes  
**Actor**: Restaurant Host  
**Preconditions**: Restaurant đã được approve  
**Main Flow**:
1. Truy cập menu management
2. Tạo/sửa categories
3. Add/edit dishes với details
4. Set pricing và options
5. Publish changes
**Postconditions**: Menu được cập nhật và hiển thị cho customers

**Features**:
- Category management với display order
- Dish details: name, description, images, pricing
- Options configuration (size, spice level, toppings)
- Inventory management và stock tracking
- Bulk operations (import CSV, mass updates)

#### UC07: Xử lý đơn hàng
**Mô tả**: Nhận và xử lý orders từ customers
**Actor**: Restaurant Host
**Preconditions**: Có orders mới
**Main Flow**:
1. Nhận notification order mới
2. Review order details
3. Accept/reject order
4. Process order (preparing → ready → delivered)
5. Update order status
**Postconditions**: Order được xử lý theo workflow

**Order Statuses**:
- PENDING: Chờ restaurant xác nhận
- CONFIRMED: Restaurant đã chấp nhận
- PREPARING: Đang chuẩn bị món ăn
- READY: Sẵn sàng giao hàng
- OUT_FOR_DELIVERY: Đang giao hàng
- DELIVERED: Đã hoàn thành
- CANCELLED: Đã hủy

### 2.3. Admin Use Cases

#### UC08: Phê duyệt nhà hàng
**Mô tả**: Review và approve restaurant applications  
**Actor**: Admin  
**Preconditions**: Có pending applications  
**Main Flow**:
1. Review application details
2. Verify documents và credentials
3. Check business information
4. Approve/reject với reasoning
5. Send notification to restaurant
**Postconditions**: Restaurant status được update

**Document Verification**:
- Business license validity
- Food safety certificates
- Tax registration verification
- Insurance coverage confirmation
- Bank account verification

---

## 3. ACTIVITY DIAGRAMS CHI TIẾT

### 3.1. Quy trình đặt hàng hoàn chỉnh (Customer Order Flow)

**Diagram đầu tiên** minh họa complete customer journey từ việc tìm kiếm nhà hàng đến hoàn tất đơn hàng.

**Mô tả**: Luồng xử lý từ browse restaurant đến order completion  
**Actors**: Customer, Frontend, Backend, Payment Gateway, Restaurant

**Các giai đoạn chính**:
1. **Discovery**: Browse và search restaurants
   - Sử dụng search filters
   - Hiển thị results với pagination
   - Handle empty results case
   
2. **Selection**: Chọn dishes và add to cart  
   - Configure dish options
   - Validate cart constraints
   - Handle cross-restaurant items
   
3. **Checkout**: Review order và payment info
   - Select delivery address
   - Choose payment method
   - Apply vouchers if available
   
4. **Payment**: Process payment transaction
   - Validate payment information
   - Handle payment failures với retry
   - Generate order confirmation
   
5. **Fulfillment**: Restaurant xử lý order
   - Send notifications
   - Track order status
   - Complete delivery

**Error Handling**:
- Network timeouts với retry mechanism
- Payment failures với alternative options
- Restaurant unavailability với fallback suggestions

### 3.2. Quy trình xử lý đơn hàng (Restaurant Processing)

**Diagram thứ hai** mô tả restaurant workflow từ order notification đến completion.

**Mô tả**: Restaurant workflow từ order notification đến completion  

**Key Decision Points**:
- **Ingredient availability check**: Verify stock trước khi accept
- **Delivery area validation**: Confirm address trong coverage area
- **Kitchen capacity assessment**: Consider current workload
- **Quality control checkpoints**: Ensure food standards

**Real-time Communications**:
- WebSocket notifications cho order updates
- Customer tracking với live status
- Kitchen display system integration
- Delivery coordination

**Performance Metrics**:
- Order acceptance rate (target >95%)
- Average preparation time tracking
- Customer satisfaction scores
- Delivery time accuracy

### 3.3. Quy trình đăng ký nhà hàng (Restaurant Registration)

**Diagram thứ ba** mô tả complete onboarding process cho restaurant.

**Mô tả**: Complete onboarding từ registration đến approval  

**Document Requirements**:
- Business registration certificate
- Food hygiene certificate  
- Tax code certificate
- Bank account verification
- Insurance documentation

**Admin Review Process**:
- Document authenticity verification
- Business location validation
- Financial stability assessment
- Background checks
- Compliance history review

**Post-Approval Setup**:
- Commission rate assignment
- Payment schedule configuration
- Onboarding training session
- Menu setup assistance
- Marketing support activation

---

## 4. LUỒNG TƯƠNG TÁC GIỮA CÁC ACTOR

### 4.1. Customer-Restaurant Interaction
```
Customer Order → Restaurant Notification → Order Processing → Status Updates → Customer Notification
```

### 4.2. Restaurant-Admin Interaction  
```
Registration Application → Admin Review → Document Verification → Approval Decision → Account Activation
```

### 4.3. System Integration Points
- **Payment Gateways**: ZaloPay, MoMo, Banking APIs
- **Notification Services**: Email (SMTP), SMS, Push notifications
- **Cloud Services**: Cloudinary (image storage), MongoDB Atlas
- **Map Services**: Google Maps API cho location và routing

---

## 5. BUSINESS RULES VÀ CONSTRAINTS

### 5.1. Ordering Rules
- **Minimum order value**: 50,000 VND
- **Maximum delivery distance**: 10km từ restaurant
- **Order timeout**: 30 phút cho restaurant response
- **Payment timeout**: 15 phút cho customer
- **Cancellation window**: 5 phút sau khi đặt hàng

### 5.2. Restaurant Rules  
- **Operating hours**: Phải được set để accept orders
- **Menu requirements**: Ít nhất 1 category và 3 dishes
- **Response time**: Tối đa 10 phút để accept/reject order
- **Rating threshold**: Tối thiểu 3.0 để maintain active status
- **Commission rate**: 15-20% based on volume

### 5.3. System Constraints
- **File upload limits**: 10MB per image, 5 images per dish
- **Session timeout**: 24h customer, 8h admin
- **API rate limiting**: 100 requests/minute per user
- **Database backup**: Daily automated backups
- **Cache expiration**: 1h restaurant data, 5min real-time data

### 5.4. Security Rules
- **Password complexity**: Minimum 8 chars, mixed case, numbers
- **JWT token expiry**: 24 hours với refresh mechanism
- **Account lockout**: 5 failed login attempts
- **Data encryption**: PCI compliance cho payment data
- **Access control**: Role-based permissions

---

## 6. ERROR HANDLING VÀ PERFORMANCE

### 6.1. Exception Scenarios
- **Network connectivity issues**: Auto-retry với exponential backoff
- **Payment processing failures**: Multiple retry options
- **Restaurant unavailability**: Real-time status updates
- **Stock shortages**: Automatic item removal
- **System maintenance**: Graceful degradation

### 6.2. Performance Optimizations
- **Database indexing**: Compound indexes cho search queries
- **Caching strategies**: Redis cho frequently accessed data
- **Image optimization**: Automatic compression và CDN
- **Load balancing**: Multiple server instances
- **Query optimization**: Aggregation pipelines, pagination

### 6.3. Monitoring và Alerting
- **Response time monitoring**: <200ms API responses
- **Error rate tracking**: <1% error rate target
- **Uptime monitoring**: 99.9% availability SLA
- **Performance metrics**: Real-time dashboards
- **Alert system**: Slack/email notifications for critical issues

---

## 7. SCALABILITY VÀ FUTURE ENHANCEMENTS

### 7.1. Current Scalability Features
- **Horizontal database scaling**: MongoDB sharding ready
- **Stateless authentication**: JWT-based sessions
- **Microservices architecture**: Modular service design
- **Cloud deployment**: Auto-scaling infrastructure
- **CDN integration**: Global content delivery

### 7.2. Planned Enhancements
- **Real-time chat**: Customer-restaurant communication
- **Advanced analytics**: Machine learning recommendations
- **Loyalty program**: Points-based reward system
- **Multi-language support**: Internationalization
- **Mobile app**: Native iOS/Android applications

### 7.3. Integration Roadmap
- **Third-party delivery**: Grab, Be, Shopee integration
- **POS systems**: Restaurant point-of-sale integration
- **Inventory management**: Advanced stock tracking
- **CRM systems**: Customer relationship management
- **Marketing automation**: Email/SMS campaigns

---

## 8. KẾT LUẬN

Hệ thống **OrderUp** được thiết kế với kiến trúc comprehensive và scalable, đảm bảo:

### 8.1. User Experience Excellence
- Intuitive interface cho tất cả user roles
- Fast và responsive performance
- Comprehensive error handling
- Real-time updates và notifications

### 8.2. Business Operations Efficiency  
- Streamlined restaurant onboarding
- Efficient order processing workflow
- Robust payment system
- Comprehensive admin controls

### 8.3. Technical Robustness
- Modern technology stack
- Scalable architecture design
- Security best practices
- Performance optimization

### 8.4. Future-Ready Foundation
- Modular design cho easy extensions
- API-first approach
- Cloud-native deployment
- Integration-friendly architecture

Các **Use Case Diagrams** và **Activity Diagrams** được trình bày trong báo cáo này cung cấp blueprint chi tiết cho development team implement features theo đúng business requirements và user expectations, đồng thời đảm bảo system scalability và maintainability trong tương lai.

---

*Báo cáo này được tạo dựa trên phân tích chi tiết source code và database design của dự án OrderUp, cung cấp foundation vững chắc cho việc phát triển và mở rộng hệ thống.* 