# BÁO CÁO CHI TIẾT USE CASE VÀ ACTIVITY DIAGRAM
## DỰ ÁN ORDERUP - ỨNG DỤNG ĐẶT ĐỒ ĂN TRỰC TUYẾN

---

## 1. TỔNG QUAN HỆ THỐNG

**OrderUp** là hệ thống đặt đồ ăn trực tuyến với kiến trúc full-stack hiện đại, phục vụ 3 nhóm người dùng chính:

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

## 2. USE CASE DIAGRAM TỔNG QUAN

### 2.1. Mối quan hệ giữa các Actor
- **Customer** có thể đăng ký, đăng nhập, đặt hàng, thanh toán, đánh giá
- **Restaurant Host** quản lý nhà hàng, menu, đơn hàng và xem thống kê
- **Admin** có toàn quyền quản lý user, restaurant và hệ thống

---

## 3. CHI TIẾT USE CASES THEO ACTOR

### 3.1. CUSTOMER USE CASES

#### UC01: Đăng ký tài khoản
**Actor**: Customer  
**Preconditions**: Người dùng chưa có tài khoản trong hệ thống  
**Postconditions**: Tài khoản customer được tạo thành công và kích hoạt  

**Main Flow**:
1. Customer truy cập trang đăng ký (SignUpPage)
2. Điền form đăng ký với thông tin: email, password, firstName, lastName, phone
3. Hệ thống validate thông tin đầu vào
4. Kiểm tra email chưa tồn tại trong database
5. Mã hóa password bằng bcrypt
6. Tạo user record trong MongoDB với role="user"
7. Gửi email xác thực (nếu được cấu hình)
8. Hiển thị thông báo đăng ký thành công
9. Chuyển hướng đến trang đăng nhập

**Alternative Flows**:
- A1: Email đã tồn tại → Hiển thị lỗi "Email already exists"
- A2: Thông tin không hợp lệ → Hiển thị validation errors
- A3: Lỗi server → Hiển thị "Registration failed, please try again"

**Exception Flows**:
- E1: Network timeout → Retry mechanism
- E2: Database connection failed → Cache request for retry

#### UC02: Đăng nhập
**Actor**: Customer  
**Preconditions**: User có tài khoản hợp lệ và đã kích hoạt  
**Postconditions**: User đăng nhập thành công, nhận được JWT token  

**Main Flow**:
1. Customer truy cập trang đăng nhập (LoginPage)
2. Nhập email và password
3. Frontend gửi request đến `/api/auth/login`
4. Backend validate credentials
5. Kiểm tra user tồn tại và active=true
6. So sánh password với hash trong database
7. Tạo JWT token với user info và role
8. Trả về token và user data
9. Frontend lưu token vào localStorage
10. AuthContext cập nhật login state
11. Redirect dựa trên role (home cho user, dashboard cho restaurant host)

**Alternative Flows**:
- A1: Sai email/password → Hiển thị "Invalid credentials"
- A2: Tài khoản bị khóa (active=false) → "Account is disabled"
- A3: Account chưa verify → "Please verify your email"

#### UC03: Tìm kiếm và lọc nhà hàng
**Actor**: Customer  
**Preconditions**: User đã đăng nhập, có danh sách nhà hàng trong hệ thống  
**Postconditions**: Hiển thị danh sách nhà hàng phù hợp với tiêu chí tìm kiếm  

**Main Flow**:
1. Customer truy cập HomePage
2. Nhập từ khóa tìm kiếm trong search box
3. Chọn filters: loại món ăn (cuisineTypes), khoảng giá (priceRange), rating tối thiểu
4. Chọn vị trí giao hàng (delivery area)
5. Hệ thống gọi API `/api/shop/search` với parameters
6. Backend query MongoDB với aggregation pipeline:
   - Text search trên restaurant name
   - Filter theo cuisineTypes, priceRange
   - Filter theo ratings.averageRating >= minRating
   - Filter theo delivery.deliveryAreas contains user location
7. Áp dụng pagination (page, size)
8. Sắp xếp theo: relevance, rating, delivery time, distance
9. Trả về danh sách restaurants với ShopThumbDTO
10. Frontend hiển thị kết quả với ShopCard components

**Alternative Flows**:
- A1: Không tìm thấy kết quả → "No restaurants found, try different criteria"
- A2: Lỗi location → "Please enable location access or enter address"
- A3: Network error → "Unable to search, please check connection"

#### UC04: Xem chi tiết nhà hàng và menu
**Actor**: Customer  
**Preconditions**: Có danh sách nhà hàng, restaurant đang active  
**Postconditions**: Hiển thị thông tin chi tiết nhà hàng và menu đầy đủ  

**Main Flow**:
1. Customer click vào ShopCard từ danh sách
2. Navigate đến `/shop/:restaurantId` (ShopPage)
3. Frontend gọi APIs song song:
   - `/api/shop/detail/{restaurantId}` - thông tin nhà hàng
   - `/api/dish/restaurant/{restaurantId}` - danh sách món ăn
   - `/api/categories/restaurant/{restaurantId}` - categories
   - `/api/review/restaurant/{restaurantId}` - reviews
4. Backend trả về:
   - RestaurantDetailDTO: thông tin cơ bản, địa chỉ, giờ mở cửa, delivery info
   - DishListResponseDTO: danh sách món ăn theo category
   - ReviewListResponseDTO: reviews và ratings
5. Frontend render:
   - Restaurant header với images, name, rating, delivery info
   - Menu categories với filter tabs
   - Dish list với ProductCard components
   - Reviews section
6. Customer có thể:
   - Filter món ăn theo category
   - Search món ăn trong restaurant
   - View dish details trong ProductPopUp

**Business Rules**:
- Chỉ hiển thị dishes có isActive=true
- Check operating hours để hiển thị "Open/Closed"
- Calculate delivery fee dựa trên distance
- Show estimated delivery time

#### UC05: Thêm món ăn vào giỏ hàng
**Actor**: Customer  
**Preconditions**: Đang xem menu nhà hàng, món ăn available  
**Postconditions**: Món ăn được thêm vào shopping cart  

**Main Flow**:
1. Customer click vào dish từ menu list
2. Mở ProductPopUp với dish details
3. Xem thông tin: name, description, images, base price, options
4. Chọn options nếu có (size, spice level, toppings):
   - Single choice options (required/optional)
   - Multiple choice options với additional pricing
5. Chọn quantity (default=1, min=1, max=10)
6. Nhập special instructions (optional)
7. Click "Add to Cart"
8. Frontend gọi API `/api/cart/add` với:
   ```json
   {
     "dishId": "dish_id",
     "restaurantId": "restaurant_id", 
     "quantity": 2,
     "selectedOptions": [
       {"optionName": "Size", "choiceName": "Large", "additionalPrice": 5000}
     ],
     "specialInstructions": "Less spicy"
   }
   ```
9. Backend xử lý:
   - Validate dish exists và available
   - Check restaurant active
   - Calculate total price = (basePrice + options) * quantity
   - Tạo/update ShoppingCart record trong MongoDB
   - Nếu cart có items từ restaurant khác → confirm replace
10. Trả về updated cart data
11. Frontend update cart icon với item count
12. Hiển thị toast notification "Added to cart"

**Alternative Flows**:
- A1: Dish hết hàng → "Sorry, this item is currently unavailable"
- A2: Restaurant closed → "Restaurant is closed, item cannot be added"
- A3: Cart có items từ restaurant khác → "Replace current cart items?"
- A4: Reached max quantity → "Maximum 10 items per dish"

**Validation Rules**:
- Required options phải được chọn
- Quantity > 0 và <= maxQuantity
- Check dish availability và restaurant operating hours

#### UC06: Quản lý giỏ hàng
**Actor**: Customer  
**Preconditions**: Customer có items trong shopping cart  
**Postconditions**: Cart được cập nhật theo yêu cầu  

**Main Flow**:
1. Customer truy cập CartPage qua `/cart`
2. Frontend gọi `/api/cart/user/{userId}` để load cart data
3. Hiển thị cart với CartItem components:
   - Dish image, name, selected options
   - Unit price, quantity controls, subtotal
   - Special instructions
   - Remove item button
4. Customer có thể:
   - **Update quantity**: Click +/- buttons
     - Gọi API `/api/cart/update-quantity`
     - Validate quantity > 0
     - Recalculate prices
   - **Remove item**: Click remove button  
     - Gọi API `/api/cart/remove-item`
     - Confirm action
   - **Edit instructions**: Inline edit field
     - Auto-save on blur
5. **Pricing calculation**:
   - Items subtotal = Σ(item price × quantity)
   - Delivery fee (dựa trên restaurant policy)
   - Service fee (platform fee)
   - Tax calculation
   - **Voucher discount** (nếu có):
     - Apply voucher code
     - Validate voucher conditions
     - Calculate discount amount
   - **Final total** = Subtotal + Delivery + Service + Tax - Discount
6. Show order summary với breakdown chi tiết
7. "Proceed to Checkout" button nếu cart không empty

**Alternative Flows**:
- A1: Cart empty → Hiển thị "Your cart is empty" với link back to restaurants
- A2: Item hết hàng → Mark item unavailable, option to remove
- A3: Restaurant closed → Warning message, cannot proceed checkout
- A4: Voucher invalid → "Voucher expired or not applicable"

**Real-time Updates**:
- Auto-save changes
- Sync cart across devices nếu user login nhiều nơi
- Update pricing khi có changes từ restaurant

#### UC07: Áp dụng voucher
**Actor**: Customer  
**Preconditions**: Customer có items trong cart  
**Postconditions**: Voucher được áp dụng và giá được tính lại  

**Main Flow**:
1. Customer nhập voucher code trong cart page
2. Click "Apply Voucher"
3. Frontend gọi `/api/voucher/validate` với:
   ```json
   {
     "code": "NEWUSER20",
     "userId": "user_id",
     "restaurantId": "restaurant_id",
     "orderTotal": 150000
   }
   ```
4. Backend validate voucher:
   - Voucher exists và active=true
   - Chưa expired (validity.expiresAt > now)
   - Còn số lượng sử dụng (remainingValue > 0)
   - User chưa sử dụng voucher này (nếu là single-use)
   - Đạt minimum order value
   - Applicable cho restaurant này (local voucher) hoặc global
5. Calculate discount:
   - **Percentage**: discountAmount = orderTotal * (percentage/100)
   - **Fixed amount**: discountAmount = fixed value
   - **Free delivery**: deliveryFee = 0
   - Cap discount at maxDiscount nếu có
6. Return voucher details và discount amount
7. Frontend update order summary với discount line
8. Voucher được lưu để apply khi checkout

**Alternative Flows**:
- A1: Voucher không tồn tại → "Invalid voucher code"
- A2: Voucher hết hạn → "Voucher has expired"
- A3: Không đủ điều kiện → "Minimum order value not met"
- A4: Đã sử dụng → "Voucher already used"
- A5: Voucher hết lượt → "Voucher is no longer available"

#### UC08: Đặt hàng và thanh toán
**Actor**: Customer  
**Preconditions**: Cart có items, user đã đăng nhập  
**Postconditions**: Order được tạo thành công, payment processed  

**Main Flow**:
1. Customer click "Proceed to Checkout" từ cart
2. Navigate đến PaymentPage (`/payment`)
3. **Delivery Information**:
   - Load user addresses từ profile
   - Chọn delivery address hoặc add new
   - Nhập delivery instructions
   - Confirm delivery time estimate
4. **Payment Method Selection**:
   - Cash on Delivery (COD)
   - Credit/Debit Card
   - E-wallets (ZaloPay, MoMo)
   - Stored payment methods
5. **Order Review**:
   - Confirm items, quantities, options
   - Verify delivery address và time
   - Check final pricing breakdown
   - Applied voucher confirmation
6. Click "Place Order"
7. **Order Creation Process**:
   ```javascript
   // Frontend gọi API
   POST /api/order/create
   {
     "cartId": "cart_id",
     "deliveryAddress": {...},
     "paymentMethod": "card",
     "deliveryInstructions": "Ring doorbell",
     "voucherCode": "NEWUSER20"
   }
   ```
8. **Backend xử lý**:
   - Validate cart contents
   - Re-check item availability
   - Generate unique orderNumber
   - Calculate final pricing
   - Process payment (nếu không phải COD):
     - Call payment gateway API
     - Handle payment response
   - Create Order record trong MongoDB
   - Update voucher usage
   - Clear shopping cart
   - Send notifications:
     - Email confirmation to customer
     - New order notification to restaurant
9. **Response handling**:
   - Payment success → Redirect to order confirmation
   - Payment failed → Show error, allow retry
   - Order created → Show order details và tracking info

**Payment Flow Detail**:
- **Card Payment**: Redirect to payment gateway, handle callback
- **E-wallet**: Deep link to app hoặc QR code scan
- **COD**: Mark payment as pending, collect on delivery

**Alternative Flows**:
- A1: Payment failed → "Payment unsuccessful, please try again"
- A2: Item hết hàng during checkout → "Some items are no longer available"
- A3: Restaurant closed → "Restaurant is currently closed"
- A4: Address không trong delivery area → "Delivery not available to this address"

#### UC09: Theo dõi đơn hàng
**Actor**: Customer  
**Preconditions**: Customer có đơn hàng đang xử lý  
**Postconditions**: Hiển thị real-time status của order  

**Main Flow**:
1. Customer truy cập TrackingPage (`/tracking/:orderId`)
2. Frontend gọi `/api/order/track/{orderId}`
3. Backend query Order record và return OrderTrackingDTO
4. Hiển thị order timeline với các status:
   - **PENDING**: Order placed, waiting restaurant confirmation
   - **CONFIRMED**: Restaurant accepted order
   - **PREPARING**: Food is being prepared
   - **READY**: Order ready for pickup/delivery
   - **OUT_FOR_DELIVERY**: Driver picked up order
   - **DELIVERED**: Order completed
   - **CANCELLED**: Order cancelled
5. For each status, hiển thị:
   - Status name và description
   - Timestamp
   - Estimated completion time
   - Progress indicator
6. Additional information:
   - Restaurant contact info
   - Driver info (khi có)
   - Order items summary
   - Total amount
   - Delivery address
7. Real-time updates:
   - WebSocket connection for live updates
   - Push notifications khi status change
   - Auto-refresh every 30 seconds

**Status-specific Actions**:
- **PENDING/CONFIRMED**: Cancel order option
- **PREPARING**: Call restaurant option
- **OUT_FOR_DELIVERY**: Track delivery trên map
- **DELIVERED**: Rate order option

**Alternative Flows**:
- A1: Order không tồn tại → "Order not found"
- A2: Access denied → "You can only view your own orders"
- A3: Connection error → Show cached status, retry

#### UC10: Đánh giá đơn hàng
**Actor**: Customer  
**Preconditions**: Order đã completed (status = DELIVERED)  
**Postconditions**: Review được lưu vào database  

**Main Flow**:
1. Customer nhận notification để review sau khi order delivered
2. Click review link hoặc go to order history
3. Mở ReviewPopUp với order details
4. **Restaurant Rating**:
   - Chọn rating 1-5 sao cho restaurant
   - Categories: Food quality, Service, Delivery time, Packaging
   - Write overall comment
5. **Individual Dish Rating** (optional):
   - Rate từng món ăn 1-5 sao
   - Comment cho specific dishes
6. **Photo Upload** (optional):
   - Upload food photos (max 5 images)
   - Cloudinary integration để upload
7. **Delivery Rating** (nếu có delivery):
   - Rate delivery experience
   - Driver courtesy, timeliness
8. Click "Submit Review"
9. Frontend gọi `/api/review/create`:
   ```json
   {
     "orderId": "order_id",
     "restaurantId": "restaurant_id", 
     "restaurantRating": 4,
     "restaurantComment": "Great food!",
     "dishReviews": [
       {"dishId": "dish_id", "rating": 5, "comment": "Delicious"}
     ],
     "deliveryRating": 4,
     "images": ["url1", "url2"]
   }
   ```
10. Backend xử lý:
    - Create Review record
    - Update restaurant average rating
    - Update dish ratings
    - Mark order as reviewed
    - Send thank you notification
11. Review hiển thị publicly trên restaurant page

**Business Rules**:
- Chỉ review được 1 lần per order
- Review window: 7 days after delivery
- Images automatically compressed và optimized
- Anonymous option available

**Alternative Flows**:
- A1: Already reviewed → "You have already reviewed this order"
- A2: Review window expired → "Review period has ended"
- A3: Upload failed → "Failed to upload images, please try again"

#### UC11: Quản lý thông tin cá nhân
**Actor**: Customer  
**Preconditions**: User đã đăng nhập  
**Postconditions**: Profile information được cập nhật  

**Main Flow**:
1. Customer truy cập ProfilePage (`/profile`)
2. Load current user data từ AuthContext
3. Hiển thị profile form với sections:

**A. Personal Information**:
- First name, Last name
- Phone number
- Date of birth, Gender
- Avatar image upload
- Email (read-only, require verification to change)

**B. Address Management**:
- List saved addresses với AddressItem components
- Add new address với AddressPopUp:
  - Title (Home, Office, etc.)
  - Full address với map picker
  - Set as default option
- Edit/delete existing addresses
- Validate delivery coverage

**C. Payment Methods**:
- Saved cards (với masked numbers)
- E-wallet accounts
- Add new payment method
- Set default payment method
- PCI compliance cho card storage

**D. Preferences**:
- Language preference (VI/EN)
- Notification settings:
  - Email notifications
  - Push notifications
  - SMS alerts
  - Marketing communications
- Dietary restrictions
- Favorite cuisines

**E. Security**:
- Change password với ChangePasswordPopUp
- Two-factor authentication setup
- Login history
- Active sessions management

4. **Update Process**:
   - Auto-save changes onBlur
   - Validation rules cho each field
   - API calls: `/api/user/profile/update`
   - Success/error notifications
   - Optimistic updates với rollback on error

**Validation Rules**:
- Phone number format validation
- Password strength requirements
- Address validation với geocoding
- Image file size và format limits

### 3.2. RESTAURANT HOST USE CASES

#### UC12: Đăng ký nhà hàng
**Actor**: Restaurant Host  
**Preconditions**: User có business license và restaurant info  
**Postconditions**: Restaurant application submitted for admin approval  

**Main Flow**:
1. User đăng ký account với role="restaurantHost"
2. Complete profile setup
3. Access restaurant registration form
4. **Basic Information**:
   - Restaurant name, description
   - Phone, email, website
   - Upload logo và cover images
   - Business hours for each day
5. **Location Details**:
   - Full address với map integration
   - Delivery radius settings
   - Coordinates validation
6. **Business Documentation**:
   - Upload business license
   - Tax registration number
   - Food safety certificates
   - Insurance documents
7. **Menu Setup** (basic):
   - Create initial food categories
   - Add sample dishes
   - Set price ranges
8. **Financial Information**:
   - Bank account details
   - Tax information
   - Commission agreement
9. Submit application with status="pending"
10. Admin notification sent
11. Confirmation email to restaurant owner

**Required Documents**:
- Business registration certificate
- Food hygiene certificate
- Tax code certificate
- Bank account verification

#### UC13: Quản lý Dashboard nhà hàng
**Actor**: Restaurant Host  
**Preconditions**: Restaurant account approved  
**Postconditions**: Dashboard displays current metrics  

**Main Flow**:
1. Restaurant Host login và navigate to Dashboard
2. Load dashboard data from `/api/restaurant/dashboard`
3. **Key Metrics Display**:
   - Today's orders count và revenue
   - This week/month statistics
   - Average order value
   - Customer ratings
   - Popular dishes
4. **Charts và Analytics**:
   - Revenue trend (daily/weekly/monthly)
   - Order volume patterns
   - Peak hours analysis
   - Customer demographics
   - Dish performance metrics
5. **Quick Actions**:
   - Toggle restaurant open/closed
   - View pending orders
   - Update menu items
   - Respond to reviews
   - Create promotions
6. **Notifications Panel**:
   - New orders alerts
   - Low stock warnings
   - Customer reviews
   - System announcements
7. Real-time updates via WebSocket

#### UC14: Quản lý Menu và Món ăn
**Actor**: Restaurant Host  
**Preconditions**: Restaurant approved  
**Postconditions**: Menu updated successfully  

**Main Flow**:
1. Navigate to Product management page
2. **Category Management**:
   - View existing categories
   - Create new category với CategoryItem
   - Edit category: name, description, image
   - Set display order
   - Toggle active/inactive
3. **Dish Management**:
   - View dishes by category
   - **Add New Dish**:
     - Basic info: name, description, preparation time
     - Upload multiple images
     - Set base price
     - Configure options (size, spice level):
       - Option type: single/multiple choice
       - Required/optional flags
       - Additional pricing for choices
     - Nutrition information
     - Ingredients và allergen warnings
     - Availability settings
   - **Edit Existing Dish**:
     - Update any field
     - Manage availability status
     - Track popularity metrics
   - **Bulk Operations**:
     - Import dishes từ CSV
     - Bulk price updates
     - Category assignments
4. **Inventory Management**:
   - Set stock quantities
   - Low stock alerts
   - Auto-disable khi sold out
5. **Pricing Strategy**:
   - Dynamic pricing rules
   - Time-based pricing
   - Promotional pricing

#### UC15: Xử lý Đơn hàng
**Actor**: Restaurant Host  
**Preconditions**: New orders received  
**Postconditions**: Orders processed according to restaurant policy  

**Main Flow**:
1. Receive new order notification
2. Review order details trong OrderCard:
   - Customer information
   - Ordered items với options
   - Special instructions
   - Delivery address và time
   - Payment status
   - Total amount
3. **Decision Process**:
   - Check ingredient availability
   - Verify delivery area coverage
   - Estimate preparation time
   - Consider current workload
4. **Accept Order**:
   - Update status to "CONFIRMED"
   - Set estimated completion time
   - Send confirmation to customer
   - Add to preparation queue
5. **Preparation Workflow**:
   - Update status to "PREPARING"
   - Track preparation time
   - Quality check completed items
   - Update status to "READY"
6. **Delivery Handover**:
   - Verify order completeness
   - Package properly
   - Update status to "OUT_FOR_DELIVERY"
   - Provide tracking info

**Alternative Actions**:
- **Reject Order**: Provide reason, process refund
- **Modify Order**: Contact customer for changes
- **Delay Order**: Update estimated time, notify customer

#### UC16: Quản lý Voucher và Khuyến mãi
**Actor**: Restaurant Host  
**Preconditions**: Restaurant approved  
**Postconditions**: Voucher campaigns created và managed  

**Main Flow**:
1. Access voucher management section
2. **Create New Voucher**:
   - Voucher type: percentage, fixed amount, free delivery
   - Discount value và maximum discount
   - Minimum order requirements
   - Validity period (start/end dates)
   - Usage limits: total uses, per customer
   - Target audience: all customers, new customers, VIP
   - Applicable menu items
3. **Campaign Management**:
   - Launch promotional campaigns
   - Schedule automatic activation
   - A/B testing different offers
   - Integration với seasonal events
4. **Performance Tracking**:
   - Voucher usage statistics
   - Revenue impact analysis
   - Customer acquisition metrics
   - ROI calculation
5. **Dynamic Adjustments**:
   - Pause/resume active vouchers
   - Adjust terms và conditions
   - Extend validity periods
   - Increase usage limits

### 3.3. ADMIN USE CASES

#### UC17: Quản lý Người dùng
**Actor**: Admin  
**Preconditions**: Admin logged in  
**Postconditions**: User accounts managed effectively  

**Main Flow**:
1. Access user management dashboard
2. **User Overview**:
   - Total users by role
   - New registrations trend
   - Active/inactive accounts
   - Geographical distribution
3. **Search và Filter**:
   - Search by name, email, phone
   - Filter by role, status, registration date
   - Advanced filters: order history, ratings
4. **User Details View**:
   - Personal information
   - Order history
   - Payment methods
   - Address book
   - Account activity log
5. **Account Actions**:
   - Activate/deactivate accounts
   - Reset passwords
   - Verify email addresses
   - Handle customer complaints
   - Refund processing
6. **Bulk Operations**:
   - Mass email campaigns
   - Account status updates
   - Data export for analysis

#### UC18: Phê duyệt Nhà hàng
**Actor**: Admin  
**Preconditions**: Restaurant applications pending  
**Postconditions**: Applications approved or rejected  

**Main Flow**:
1. Review pending restaurant applications
2. **Document Verification**:
   - Business license validity
   - Food safety certificates
   - Tax registration verification
   - Insurance coverage confirmation
3. **Restaurant Information Review**:
   - Business details accuracy
   - Menu quality và pricing
   - Location và delivery coverage
   - Financial capability assessment
4. **Background Checks**:
   - Owner identity verification
   - Business reputation research
   - Compliance history
5. **Decision Process**:
   - **Approve**: Activate restaurant account
   - **Request More Info**: Ask for additional documents
   - **Reject**: Provide detailed reasons
6. **Post-Approval Setup**:
   - Commission rate assignment
   - Payment schedule configuration
   - Initial promotional support
   - Onboarding assistance

#### UC19: Quản lý Voucher Hệ thống
**Actor**: Admin  
**Preconditions**: Admin privileges  
**Postconditions**: System-wide vouchers managed  

**Main Flow**:
1. **Global Voucher Creation**:
   - Platform-wide promotions
   - New user welcome offers
   - Holiday special campaigns
   - Loyalty program rewards
2. **Campaign Strategy**:
   - Market penetration goals
   - Customer acquisition targets
   - Revenue optimization
   - Competitive positioning
3. **Budget Management**:
   - Campaign budget allocation
   - Cost per acquisition tracking
   - ROI monitoring
   - Financial impact assessment
4. **Performance Analytics**:
   - Usage patterns analysis
   - Customer behavior insights
   - Revenue impact measurement
   - Campaign effectiveness comparison

#### UC20: Thống kê và Báo cáo Hệ thống
**Actor**: Admin  
**Preconditions**: Admin access  
**Postconditions**: Comprehensive system insights  

**Main Flow**:
1. **Dashboard Overview**:
   - Key performance indicators
   - Real-time system status
   - Critical alerts và warnings
   - Growth metrics summary
2. **Financial Analytics**:
   - Platform revenue trends
   - Commission earnings
   - Transaction volumes
   - Payment method analysis
3. **User Analytics**:
   - User acquisition và retention
   - Demographic analysis
   - Behavior pattern insights
   - Satisfaction metrics
4. **Restaurant Analytics**:
   - Restaurant performance ranking
   - Menu popularity trends
   - Delivery efficiency metrics
   - Rating distribution analysis
5. **System Performance**:
   - API response times
   - Database performance
   - Error rates và debugging
   - Security incident reports

---

## 4. ACTIVITY DIAGRAMS CHI TIẾT

### 4.1. Activity Diagram: Quy trình Đặt hàng Hoàn chỉnh

**Mô tả**: Luồng xử lý từ khi customer browse restaurant đến order completion

**Tham gia**: Customer, Frontend, Backend, Payment Gateway, Restaurant

**Phases**:

**Phase 1: Discovery và Selection**
- Customer mở app/website
- Browse danh sách restaurants
- Apply filters và search
- Select restaurant
- View menu và dish details

**Phase 2: Cart Management**
- Add dishes to cart với options
- Configure quantities
- Apply voucher codes
- Review pricing breakdown

**Phase 3: Checkout Process**
- Select delivery address
- Choose payment method
- Enter delivery instructions
- Review final order

**Phase 4: Payment Processing**
- Validate payment information
- Process payment via gateway
- Handle payment response
- Generate order confirmation

**Phase 5: Order Fulfillment**
- Restaurant receives order
- Order preparation process
- Delivery coordination
- Order completion

### 4.2. Activity Diagram: Restaurant Order Management

**Mô tả**: Quy trình restaurant xử lý đơn hàng từ notification đến delivery

**Key Activities**:
- Order notification reception
- Order review và validation
- Accept/reject decision process
- Food preparation workflow
- Quality control checkpoints
- Delivery coordination
- Customer communication

### 4.3. Activity Diagram: User Registration và Authentication

**Mô tả**: Complete user onboarding process

**Security Features**:
- Email verification workflow
- Password strength validation
- Profile completion steps
- Account activation process
- Role-based access setup

---

## 5. BUSINESS RULES VÀ CONSTRAINTS

### 5.1. Ordering Rules
- Minimum order value: 50,000 VND
- Maximum delivery distance: 10 km
- Order timeout: 30 minutes for restaurant response
- Payment timeout: 15 minutes for customer
- Cancellation window: 5 minutes after placement

### 5.2. Restaurant Rules
- Operating hours: must be set để accept orders
- Menu availability: real-time stock management
- Response time: maximum 10 minutes để accept/reject
- Rating requirement: minimum 3.0 để remain active
- Commission rate: 15-20% based on volume

### 5.3. System Constraints
- Maximum file upload: 10MB per image
- Session timeout: 24 hours for customers, 8 hours for admin
- API rate limiting: 100 requests per minute per user
- Database backup: daily automated backups
- Cache expiration: 1 hour for restaurant data, 5 minutes for real-time data

---

Báo cáo này cung cấp framework hoàn chỉnh để development team implement các features theo đúng business requirements và user expectations. 