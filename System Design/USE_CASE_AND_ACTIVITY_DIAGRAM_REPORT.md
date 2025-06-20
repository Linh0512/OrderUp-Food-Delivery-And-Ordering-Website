# BÁO CÁO CHI TIẾT USE CASE VÀ ACTIVITY DIAGRAM
## DỰ ÁN ORDERUP - ỨNG DỤNG ĐẶT ĐỒ ĂN TRỰC TUYẾN

---

## 1. TỔNG QUAN HỆ THỐNG

**OrderUp** là hệ thống đặt đồ ăn trực tuyến với 3 actor chính:
- **Customer (User)**: Khách hàng đặt đồ ăn
- **Restaurant Host**: Chủ nhà hàng quản lý cửa hàng
- **Admin**: Quản trị viên hệ thống

---

## 2. USE CASE DIAGRAM TỔNG QUAN

### 2.1. Actors và Relationships
- **Customer**: Người dùng cuối, đặt và theo dõi đơn hàng
- **Restaurant Host**: Quản lý nhà hàng, menu, và đơn hàng
- **Admin**: Quản trị toàn bộ hệ thống, phê duyệt nhà hàng

---

## 3. CHI TIẾT USE CASES THEO ACTOR

### 3.1. CUSTOMER USE CASES

#### UC01: Đăng ký tài khoản
**Actor**: Customer  
**Preconditions**: Người dùng chưa có tài khoản  
**Postconditions**: Tài khoản được tạo thành công  

**Main Flow**:
1. Customer truy cập trang đăng ký
2. Nhập thông tin: email, password, họ tên, số điện thoại
3. Hệ thống validate thông tin
4. Gửi email xác thực
5. Customer xác nhận email
6. Tài khoản được kích hoạt

**Alternative Flows**:
- A1: Email đã tồn tại → Hiển thị lỗi
- A2: Thông tin không hợp lệ → Yêu cầu nhập lại
- A3: Email xác thực hết hạn → Gửi lại email

#### UC02: Đăng nhập
**Actor**: Customer  
**Preconditions**: Có tài khoản hợp lệ  
**Postconditions**: Đăng nhập thành công, có JWT token  

**Main Flow**:
1. Customer nhập email và password
2. Hệ thống xác thực thông tin
3. Tạo và trả về JWT token
4. Chuyển hướng đến trang chủ

**Alternative Flows**:
- A1: Sai email/password → Hiển thị lỗi
- A2: Tài khoản bị khóa → Thông báo liên hệ admin

#### UC03: Tìm kiếm nhà hàng
**Actor**: Customer  
**Preconditions**: Đã đăng nhập  
**Postconditions**: Hiển thị danh sách nhà hàng phù hợp  

**Main Flow**:
1. Customer nhập từ khóa tìm kiếm
2. Chọn bộ lọc (loại món ăn, khoảng giá, đánh giá)
3. Hệ thống tìm kiếm trong database
4. Hiển thị kết quả với pagination
5. Customer có thể sắp xếp kết quả

**Alternative Flows**:
- A1: Không tìm thấy kết quả → Hiển thị thông báo
- A2: Lỗi mạng → Hiển thị cached results

#### UC04: Xem chi tiết nhà hàng và menu
**Actor**: Customer  
**Preconditions**: Có danh sách nhà hàng  
**Postconditions**: Hiển thị thông tin chi tiết nhà hàng  

**Main Flow**:
1. Customer chọn nhà hàng từ danh sách
2. Hệ thống load thông tin nhà hàng
3. Hiển thị: thông tin cơ bản, menu, đánh giá, giờ hoạt động
4. Customer có thể xem chi tiết từng món ăn
5. Hiển thị options và giá của món ăn

#### UC05: Thêm món ăn vào giỏ hàng
**Actor**: Customer  
**Preconditions**: Đang xem menu nhà hàng  
**Postconditions**: Món ăn được thêm vào cart  

**Main Flow**:
1. Customer chọn món ăn
2. Chọn options (size, độ cay, toppings)
3. Chọn số lượng
4. Nhập ghi chú đặc biệt (optional)
5. Click "Thêm vào giỏ hàng"
6. Hệ thống cập nhật cart
7. Hiển thị thông báo thành công

**Alternative Flows**:
- A1: Món ăn hết hàng → Thông báo không thể thêm
- A2: Thêm món từ nhà hàng khác → Confirm xóa cart hiện tại

#### UC06: Quản lý giỏ hàng
**Actor**: Customer  
**Preconditions**: Có món ăn trong cart  
**Postconditions**: Cart được cập nhật  

**Main Flow**:
1. Customer xem giỏ hàng
2. Có thể: thay đổi số lượng, xóa món, thêm ghi chú
3. Xem tổng tiền tạm tính
4. Áp dụng voucher (nếu có)
5. Tính toán phí ship và thuế
6. Hiển thị tổng tiền cuối cùng

#### UC07: Đặt hàng
**Actor**: Customer  
**Preconditions**: Có món trong cart, đã đăng nhập  
**Postconditions**: Đơn hàng được tạo thành công  

**Main Flow**:
1. Customer review giỏ hàng
2. Chọn địa chỉ giao hàng
3. Chọn phương thức thanh toán
4. Nhập thông tin giao hàng
5. Xác nhận đơn hàng
6. Xử lý thanh toán
7. Tạo đơn hàng trong database
8. Gửi notification cho restaurant
9. Hiển thị thông tin đơn hàng

**Alternative Flows**:
- A1: Thanh toán thất bại → Retry hoặc chọn phương thức khác
- A2: Nhà hàng đóng cửa → Thông báo và suggest alternatives
- A3: Món ăn hết hàng → Remove khỏi cart và recalculate

#### UC08: Theo dõi đơn hàng
**Actor**: Customer  
**Preconditions**: Có đơn hàng đang xử lý  
**Postconditions**: Hiển thị trạng thái đơn hàng  

**Main Flow**:
1. Customer truy cập trang tracking
2. Hệ thống hiển thị timeline đơn hàng
3. Show real-time status updates
4. Ước tính thời gian giao hàng
5. Hiển thị thông tin shipper (nếu có)

#### UC09: Đánh giá đơn hàng
**Actor**: Customer  
**Preconditions**: Đơn hàng đã hoàn thành  
**Postconditions**: Review được lưu vào database  

**Main Flow**:
1. Customer nhận notification đánh giá
2. Rate nhà hàng (1-5 sao)
3. Rate từng món ăn đã order
4. Viết comment
5. Upload hình ảnh (optional)
6. Submit review
7. Hệ thống cập nhật rating của restaurant

#### UC10: Quản lý thông tin cá nhân
**Actor**: Customer  
**Preconditions**: Đã đăng nhập  
**Postconditions**: Thông tin được cập nhật  

**Main Flow**:
1. Customer truy cập profile
2. Chỉnh sửa thông tin: tên, SĐT, avatar
3. Quản lý địa chỉ giao hàng
4. Quản lý phương thức thanh toán
5. Thay đổi password
6. Cài đặt notification preferences

#### UC11: Xem lịch sử đơn hàng
**Actor**: Customer  
**Preconditions**: Đã đăng nhập  
**Postconditions**: Hiển thị order history  

**Main Flow**:
1. Customer truy cập order history
2. Hệ thống hiển thị danh sách đơn hàng
3. Filter theo: thời gian, trạng thái, nhà hàng
4. Click để xem chi tiết đơn hàng
5. Option để order lại hoặc review

### 3.2. RESTAURANT HOST USE CASES

#### UC12: Đăng ký nhà hàng
**Actor**: Restaurant Host  
**Preconditions**: Có giấy phép kinh doanh  
**Postconditions**: Tài khoản restaurant được tạo (pending approval)  

**Main Flow**:
1. Restaurant Host đăng ký tài khoản
2. Chọn role "Restaurant Host"
3. Nhập thông tin nhà hàng: tên, địa chỉ, SĐT, email
4. Upload giấy phép kinh doanh
5. Upload hình ảnh nhà hàng
6. Nhập thông tin ngân hàng
7. Submit để admin review
8. Chờ phê duyệt

#### UC13: Quản lý thông tin nhà hàng
**Actor**: Restaurant Host  
**Preconditions**: Tài khoản đã được approve  
**Postconditions**: Thông tin nhà hàng được cập nhật  

**Main Flow**:
1. Restaurant Host login vào dashboard
2. Chỉnh sửa thông tin cơ bản
3. Cập nhật hình ảnh, logo
4. Thay đổi giờ hoạt động
5. Cài đặt delivery radius và phí ship
6. Cập nhật thông tin liên hệ

#### UC14: Quản lý menu và món ăn
**Actor**: Restaurant Host  
**Preconditions**: Tài khoản đã được approve  
**Postconditions**: Menu được cập nhật  

**Main Flow**:
1. Truy cập quản lý menu
2. Tạo/sửa/xóa categories
3. Thêm món ăn mới: tên, mô tả, giá, hình ảnh
4. Cài đặt options cho món ăn (size, topping)
5. Quản lý tình trạng món ăn (available/sold out)
6. Sắp xếp thứ tự hiển thị

#### UC15: Quản lý đơn hàng
**Actor**: Restaurant Host  
**Preconditions**: Có đơn hàng mới  
**Postconditions**: Đơn hàng được xử lý  

**Main Flow**:
1. Nhận notification đơn hàng mới
2. Review chi tiết đơn hàng
3. Xác nhận hoặc từ chối đơn hàng
4. Nếu xác nhận: cập nhật status "Preparing"
5. Khi món ăn sẵn sàng: update "Ready for pickup"
6. Track delivery status

**Alternative Flows**:
- A1: Từ chối đơn hàng → Nhập lý do và notify customer
- A2: Hết nguyên liệu → Contact customer để thay thế

#### UC16: Xem thống kê và báo cáo
**Actor**: Restaurant Host  
**Preconditions**: Tài khoản đã được approve  
**Postconditions**: Hiển thị analytics dashboard  

**Main Flow**:
1. Truy cập dashboard
2. Xem tổng quan: doanh thu, số đơn, rating
3. Xem biểu đồ theo thời gian
4. Phân tích món ăn bán chạy
5. Xem customer feedback
6. Export báo cáo

#### UC17: Quản lý voucher
**Actor**: Restaurant Host  
**Preconditions**: Tài khoản đã được approve  
**Postconditions**: Voucher được tạo/cập nhật  

**Main Flow**:
1. Tạo voucher mới
2. Cài đặt: loại giảm giá, giá trị, điều kiện
3. Thời gian hiệu lực
4. Giới hạn số lượng sử dụng
5. Target customers (tất cả hoặc nhóm cụ thể)
6. Activate voucher

### 3.3. ADMIN USE CASES

#### UC18: Quản lý người dùng
**Actor**: Admin  
**Preconditions**: Admin đã đăng nhập  
**Postconditions**: User data được quản lý  

**Main Flow**:
1. Admin truy cập user management
2. Xem danh sách users với filter
3. Xem chi tiết thông tin user
4. Block/unblock user account
5. Reset password cho user
6. Xem activity log của user

#### UC19: Phê duyệt nhà hàng
**Actor**: Admin  
**Preconditions**: Có restaurant pending approval  
**Postconditions**: Restaurant được approve/reject  

**Main Flow**:
1. Admin xem danh sách pending restaurants
2. Review thông tin chi tiết nhà hàng
3. Kiểm tra giấy phép kinh doanh
4. Verify thông tin địa chỉ
5. Approve hoặc reject với lý do
6. Gửi notification cho restaurant host

#### UC20: Quản lý voucher hệ thống
**Actor**: Admin  
**Preconditions**: Admin đã đăng nhập  
**Postconditions**: System voucher được quản lý  

**Main Flow**:
1. Tạo voucher toàn hệ thống
2. Cài đặt campaign marketing
3. Theo dõi usage statistics
4. Tạm dừng/kích hoạt voucher
5. Phân tích hiệu quả campaign

#### UC21: Xem thống kê hệ thống
**Actor**: Admin  
**Preconditions**: Admin đã đăng nhập  
**Postconditions**: Hiển thị system analytics  

**Main Flow**:
1. Dashboard tổng quan hệ thống
2. Số liệu: users, restaurants, orders, revenue
3. Growth metrics theo thời gian
4. Performance monitoring
5. Error logs và system health
6. Generate reports

---

## 4. ACTIVITY DIAGRAMS CHI TIẾT

### 4.1. ACTIVITY DIAGRAM: QUY TRÌNH ĐẶT HÀNG

**Mô tả**: Quy trình từ khi customer chọn món ăn đến khi đơn hàng được tạo thành công

**Actors**: Customer, System, Restaurant

**Activities**:
1. **Start**: Customer logged in
2. **Browse Restaurants**: Search/filter restaurants
3. **Select Restaurant**: Choose restaurant từ results
4. **View Menu**: Load restaurant menu và dishes
5. **Add to Cart**: 
   - Select dish
   - Choose options và quantity
   - Add to shopping cart
6. **Review Cart**: 
   - Check items và prices
   - Apply voucher nếu có
   - Calculate total
7. **Checkout Process**:
   - Select delivery address
   - Choose payment method
   - Enter delivery instructions
8. **Payment Processing**:
   - Validate payment info
   - Process payment
   - Handle payment result
9. **Order Creation**:
   - Create order record
   - Generate order number
   - Clear shopping cart
10. **Notifications**:
    - Send confirmation email to customer
    - Notify restaurant về new order
11. **End**: Order successfully placed

**Decision Points**:
- **Cart Empty?**: Nếu có → Continue, Nếu không → Redirect to home
- **Payment Success?**: Nếu có → Create order, Nếu không → Retry payment
- **Restaurant Open?**: Nếu có → Process, Nếu không → Show warning

### 4.2. ACTIVITY DIAGRAM: XỬ LÝ ĐỐN HÀNG BỞI NHÀ HÀNG

**Mô tả**: Quy trình nhà hàng xử lý đơn hàng từ khi nhận notification

**Actors**: Restaurant Host, System, Customer

**Activities**:
1. **Start**: Receive new order notification
2. **Review Order**:
   - Check order details
   - Verify availability của dishes
   - Check delivery address
3. **Decision: Accept/Reject Order**
4. **If Accept**:
   - Update order status to "Confirmed"
   - Notify customer
   - Start preparation timer
5. **Preparation Process**:
   - Update status to "Preparing"
   - Prepare dishes according to order
   - Quality check
6. **Ready for Delivery**:
   - Update status to "Ready"
   - Notify delivery system/customer
   - Package order
7. **Handover to Delivery**:
   - Update status to "Out for Delivery"
   - Provide order to delivery person
8. **Track Delivery**:
   - Monitor delivery progress
   - Update customer về delivery status
9. **Order Completed**:
   - Update status to "Delivered"
   - Send completion notification
10. **End**: Order successfully fulfilled

**If Reject**:
- Update status to "Cancelled"
- Provide cancellation reason
- Process refund
- Notify customer

### 4.3. ACTIVITY DIAGRAM: ĐĂNG KÝ VÀ PHÊ DUYỆT NHÀ HÀNG

**Mô tả**: Quy trình từ khi restaurant host đăng ký đến khi được phê duyệt

**Actors**: Restaurant Host, Admin, System

**Activities**:
1. **Start**: Restaurant owner visit registration page
2. **Account Creation**:
   - Fill registration form
   - Choose "Restaurant Host" role
   - Verify email address
3. **Restaurant Information**:
   - Enter basic info (name, address, phone)
   - Upload restaurant images
   - Set operating hours
4. **Business Documentation**:
   - Upload business license
   - Provide tax information
   - Enter bank account details
5. **Submit Application**:
   - Review all information
   - Submit for admin review
   - Application status: "Pending"
6. **Admin Review Process**:
   - Admin receives notification
   - Review application details
   - Verify business documents
   - Check restaurant credentials
7. **Decision: Approve/Reject**
8. **If Approved**:
   - Update status to "Approved"
   - Send approval email
   - Grant dashboard access
   - Restaurant can start operations
9. **If Rejected**:
   - Update status to "Rejected"
   - Send rejection email with reasons
   - Allow resubmission
10. **End**: Registration process completed

### 4.4. ACTIVITY DIAGRAM: QUẢN LÝ MENU VÀ MÓN ĂN

**Mô tả**: Quy trình restaurant host quản lý menu

**Actors**: Restaurant Host, System

**Activities**:
1. **Start**: Access menu management
2. **Menu Structure Setup**:
   - Create/edit categories
   - Set category display order
   - Upload category images
3. **Dish Management**:
   - Add new dish
   - Enter dish details (name, description, price)
   - Upload dish images
   - Set preparation time
4. **Options Configuration**:
   - Create dish options (size, spice level)
   - Set additional prices for options
   - Mark required/optional options
5. **Availability Management**:
   - Set dish availability status
   - Configure stock quantity
   - Schedule availability times
6. **Pricing Strategy**:
   - Set base prices
   - Create promotional pricing
   - Configure combo deals
7. **Quality Control**:
   - Review dish information
   - Check image quality
   - Validate pricing
8. **Publish Changes**:
   - Save all modifications
   - Update menu live status
   - Notify customers of changes
9. **End**: Menu successfully updated

### 4.5. ACTIVITY DIAGRAM: XỬ LÝ THANH TOÁN

**Mô tả**: Quy trình xử lý thanh toán cho đơn hàng

**Actors**: Customer, Payment Gateway, System

**Activities**:
1. **Start**: Customer proceeds to payment
2. **Payment Method Selection**:
   - Choose payment type (card, e-wallet, cash)
   - Enter payment details
   - Verify payment information
3. **Order Total Calculation**:
   - Calculate item subtotal
   - Add delivery fee
   - Apply taxes
   - Apply voucher discount
   - Calculate final total
4. **Payment Processing**:
   - Send payment request to gateway
   - Validate payment details
   - Process transaction
5. **Payment Gateway Response**:
   - Wait for transaction result
   - Handle success/failure response
6. **If Payment Success**:
   - Create order record
   - Generate invoice
   - Send confirmation email
   - Clear shopping cart
7. **If Payment Failed**:
   - Display error message
   - Allow retry with same method
   - Option to change payment method
8. **Transaction Logging**:
   - Log payment attempt
   - Store transaction details
   - Update order status
9. **End**: Payment process completed

---

## 5. EXCEPTION FLOWS VÀ ERROR HANDLING

### 5.1. Common Exception Scenarios
- **Network Timeout**: Retry mechanism với exponential backoff
- **Payment Failed**: Multiple retry options và alternative payment methods
- **Restaurant Closed**: Real-time status check và alternative suggestions
- **Out of Stock**: Automatic item removal và customer notification
- **Invalid Input**: Client-side validation với server-side verification

### 5.2. System Recovery Mechanisms
- **Database Connection Loss**: Connection pooling và automatic reconnection
- **Server Overload**: Load balancing và graceful degradation
- **Third-party Service Down**: Fallback mechanisms và cached responses

---

## 6. BUSINESS RULES VÀ CONSTRAINTS

### 6.1. Business Rules
- Minimum order value cho delivery
- Maximum delivery distance
- Operating hours validation
- Stock quantity management
- Voucher usage limitations
- Rating system constraints (1-5 stars)

### 6.2. System Constraints
- Maximum file upload size cho images
- Session timeout periods
- API rate limiting
- Database query optimization
- Cache expiration policies

---

## 7. INTEGRATION POINTS

### 7.1. External Integrations
- **Payment Gateways**: ZaloPay, MoMo, Banking APIs
- **Map Services**: Google Maps for location và routing
- **Cloud Storage**: Cloudinary cho image management
- **Email Service**: SMTP để send notifications
- **SMS Gateway**: OTP verification và notifications

### 7.2. Internal System Communications
- **Frontend-Backend**: RESTful APIs với JWT authentication
- **Database Operations**: MongoDB với Spring Data
- **Real-time Updates**: WebSocket cho order tracking
- **File Upload**: Cloudinary integration cho media files

---

## 8. PERFORMANCE VÀ SCALABILITY CONSIDERATIONS

### 8.1. Performance Optimizations
- Database indexing cho frequently queried fields
- API response pagination
- Image optimization và CDN usage
- Caching strategies cho static data
- Lazy loading cho large datasets

### 8.2. Scalability Features
- Horizontal database scaling với MongoDB sharding
- Stateless authentication với JWT
- Microservices-ready architecture
- Load balancing capabilities
- Auto-scaling infrastructure support

---

**Kết luận**: Hệ thống OrderUp được thiết kế với các use case và activity flow comprehensive, đảm bảo user experience tốt và business operations hiệu quả. Các diagram trên mô tả chi tiết các quy trình nghiệp vụ chính, giúp development team hiểu rõ requirements và implement đúng business logic. 