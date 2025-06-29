package com.example.orderup.module.user.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.bson.types.ObjectId;

import java.util.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.example.orderup.module.user.entirty.ShoppingCart;
import com.example.orderup.module.user.repository.ShoppingCartRepository;
import com.example.orderup.module.user.dto.ShoppingCartDTO;
import com.example.orderup.module.user.dto.CheckoutDTO;
import com.example.orderup.module.user.dto.ShoppingCartDTO.*;
import com.example.orderup.module.user.entirty.Order;
import com.example.orderup.module.user.repository.UserOrderHistoryRepository;
import com.example.orderup.module.user.mapper.ShoppingCartMapper;
import com.example.orderup.config.security.JwtTokenProvider;
import com.example.orderup.module.restaurant.entity.Dish;
import com.example.orderup.module.restaurant.repository.DishRepository;
import com.example.orderup.module.restaurant.entity.Restaurant;
import com.example.orderup.module.restaurant.repository.RestaurantDetailRepository;
import com.example.orderup.module.voucher.entity.Voucher;
import com.example.orderup.module.voucher.service.VoucherService;

@Service
public class ShoppingCartService {
    
    @Autowired
    private ShoppingCartRepository cartRepository;
    
    @Autowired
    private UserOrderHistoryRepository orderRepository;

    @Autowired
    private ShoppingCartMapper cartMapper;

    @Autowired
    private JwtTokenProvider jwtService;

    @Autowired
    private DishRepository dishRepository;

    @Autowired
    private OrderNumberGenerator orderNumberGenerator;

    @Autowired
    private RestaurantDetailRepository restaurantRepository;

    @Autowired
    private VoucherService voucherService;

    public ShoppingCart getOrCreateCart(String token, String restaurantId) {
        String userId = jwtService.getUserIdFromToken(token);
        ObjectId userObjectId = new ObjectId(userId);
        List<ShoppingCart> carts = cartRepository.findByUserId(userObjectId);
        ShoppingCart cart = null;
        if (carts != null && !carts.isEmpty()) {
            cart = carts.get(0);
        }
        
        if (cart == null) {
            cart = new ShoppingCart();
            cart.setUserId(userObjectId);
            cart.setRestaurantId(new ObjectId(restaurantId));
            cart.setItems(new ArrayList<>());
            updateCartSummary(cart, null, restaurantId);
            cartRepository.save(cart);
        } else if (!cart.getRestaurantId().equals(new ObjectId(restaurantId))) {
            // Nếu user chọn món từ nhà hàng khác, xóa giỏ hàng cũ
            cartRepository.delete(cart);
            cart = new ShoppingCart();
            cart.setUserId(userObjectId);
            cart.setRestaurantId(new ObjectId(restaurantId));
            cart.setItems(new ArrayList<>());
            cart.setSummary(new ShoppingCart.OrderSummary());
            updateCartSummary(cart, null, restaurantId);
            cartRepository.save(cart);
        }
        
        return cart;
    }

    public ShoppingCart addToCart(String userId, String restaurantId, ShoppingCart.CartItem item) {
        ShoppingCart cart = getOrCreateCart(userId, restaurantId);
        
        // Tính toán subtotal cho item
        double itemSubtotal = item.getUnitPrice() * item.getQuantity();
        if (item.getSelectedOptions() != null) {
            for (ShoppingCart.SelectedOption option : item.getSelectedOptions()) {
                itemSubtotal += option.getAdditionalPrice() * item.getQuantity();
            }
        }
        item.setSubtotal(itemSubtotal);
        
        // Thêm item vào cart
        cart.getItems().add(item);
        
        // Cập nhật subtotal của cart
        updateCartSummary(cart, null, restaurantId);
        
        return cartRepository.save(cart);
    }

    public List<ShoppingCartDTO> getUserCarts(String token) {
        if (token == null || token.trim().isEmpty()) {
            throw new IllegalArgumentException("Token không được để trống");
        }
        String userId = jwtService.getUserIdFromToken(token);
        List<ShoppingCart> carts = cartRepository.findByUserId(new ObjectId(userId));
        return carts.stream().map(cartMapper::toDTO).collect(Collectors.toList());
    }


    @Transactional
    public ShoppingCartDTO addToCart(String token, AddToCartRequest request) {
        // Validate input
        validateAddToCartRequest(request);
        String userId = jwtService.getUserIdFromToken(token);
        
        // Lấy thông tin món ăn
        Dish dish = dishRepository.findById(request.getDishId());
        if (dish == null) {
            throw new IllegalArgumentException("Không tìm thấy món ăn");
        }
        
        // Kiểm tra giỏ hàng hiện tại của nhà hàng
        ShoppingCart cart = cartRepository.findByUserIdAndRestaurantId(
            new ObjectId(userId), 
            dish.getRestaurantId()
        );
        
        if (cart == null) {
            // Tạo giỏ hàng mới
            cart = new ShoppingCart();
            cart.setUserId(new ObjectId(userId));
            cart.setRestaurantId(dish.getRestaurantId());
            cart.setItems(new ArrayList<>());
            cart.setSummary(new ShoppingCart.OrderSummary());
        } else {
            // Kiểm tra xem món ăn đã tồn tại trong giỏ hàng chưa
            boolean dishExists = cart.getItems().stream()
                .anyMatch(item -> item.getDishId().equals(new ObjectId(request.getDishId())));
            
            if (dishExists) {
                throw new IllegalArgumentException("Món ăn này đã có trong giỏ hàng. Vui lòng sử dụng chức năng cập nhật nếu muốn thay đổi.");
            }
        }

        // Tạo item mới
        ShoppingCart.CartItem newItem = new ShoppingCart.CartItem();
        newItem.setDishId(new ObjectId(request.getDishId()));
        newItem.setDishName(dish.getBasicInfo().getName());
        newItem.setDishImage(dish.getBasicInfo().getImages().get(0)); // Lấy ảnh đầu tiên
        newItem.setQuantity(request.getQuantity());
        newItem.setUnitPrice(dish.getPricing().getBasePrice());
        newItem.setSpecialInstructions(request.getSpecialInstructions());
        newItem.setSelectedOptions(new ArrayList<>());

        // Chuyển đổi selected options và tính giá
        if (request.getSelectedOptions() != null && !request.getSelectedOptions().isEmpty()) {
            // Kiểm tra xem món ăn có options không
            if (dish.getOptions() == null || dish.getOptions().isEmpty()) {
                throw new IllegalArgumentException("Món ăn này không có tùy chọn");
            }

            for (SelectedOptionRequest optionRequest : request.getSelectedOptions()) {
                // Tìm option và choice tương ứng từ dish
                Dish.Option dishOption = dish.getOptions().stream()
                    .filter(opt -> opt.getName().equals(optionRequest.getOptionName()))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy option: " + optionRequest.getOptionName()));

                Dish.Choice dishChoice = dishOption.getChoices().stream()
                    .filter(choice -> choice.getName().equals(optionRequest.getChoiceName()))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy choice: " + optionRequest.getChoiceName()));

                // Thêm option vào item
                ShoppingCart.SelectedOption option = new ShoppingCart.SelectedOption();
                option.setOptionName(optionRequest.getOptionName());
                option.setChoiceName(optionRequest.getChoiceName());
                option.setAdditionalPrice(dishChoice.getPrice());
                newItem.getSelectedOptions().add(option);
            }
        }

        // Tính subtotal cho item
        double itemSubtotal = calculateItemSubtotal(newItem);
        newItem.setSubtotal(itemSubtotal);

        // Thêm item vào giỏ
        cart.getItems().add(newItem);

        // Cập nhật tổng giá trị
        updateCartSummary(cart, null, cart.getRestaurantId().toString());

        // Lưu giỏ hàng
        cart = cartRepository.save(cart);

        return cartMapper.toDTO(cart);
    }

    @Transactional
    public ShoppingCartDTO updateCartItem(String token, String cartId, int itemIndex, UpdateCartItemRequest request) {
        // Validate input
        if (request.getQuantity() <= 0) {
            throw new IllegalArgumentException("Số lượng phải lớn hơn 0");
        }

        String userId = jwtService.getUserIdFromToken(token);
        ShoppingCart cart = cartRepository.findById(cartId).orElse(null);
        ObjectId userObjectId = new ObjectId(userId);
        if (cart == null || !cart.getUserId().equals(userObjectId)) {
            throw new IllegalArgumentException("Không tìm thấy giỏ hàng");
        }

        if (itemIndex < 0 || itemIndex >= cart.getItems().size()) {
            throw new IllegalArgumentException("Index không hợp lệ");
        }

        ShoppingCart.CartItem item = cart.getItems().get(itemIndex);
        
        // Lấy thông tin món ăn để validate options
        Dish dish = dishRepository.findById(item.getDishId().toString());
        if (dish == null) {
            throw new IllegalArgumentException("Không tìm thấy món ăn");
        }

        // Cập nhật quantity và specialInstructions
                    item.setQuantity(request.getQuantity());
        item.setSpecialInstructions(request.getSpecialInstructions());
        
        // Cập nhật selectedOptions
        if (request.getSelectedOptions() != null) {
            item.setSelectedOptions(new ArrayList<>());
            
            for (SelectedOptionRequest optionRequest : request.getSelectedOptions()) {
                // Tìm option và choice tương ứng từ dish
                Dish.Option dishOption = dish.getOptions().stream()
                    .filter(opt -> opt.getName().equals(optionRequest.getOptionName()))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy option: " + optionRequest.getOptionName()));

                Dish.Choice dishChoice = dishOption.getChoices().stream()
                    .filter(choice -> choice.getName().equals(optionRequest.getChoiceName()))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy choice: " + optionRequest.getChoiceName()));

                // Thêm option vào item
                ShoppingCart.SelectedOption option = new ShoppingCart.SelectedOption();
                option.setOptionName(optionRequest.getOptionName());
                option.setChoiceName(optionRequest.getChoiceName());
                option.setAdditionalPrice(dishChoice.getPrice());
                item.getSelectedOptions().add(option);
            }
        } else {
            item.setSelectedOptions(new ArrayList<>());
        }
        
        // Cập nhật subtotal cho item
        double itemSubtotal = calculateItemSubtotal(item);
        item.setSubtotal(itemSubtotal);

        // Cập nhật tổng giá trị
        updateCartSummary(cart, null, dish.getRestaurantId().toString());

        cart = cartRepository.save(cart);
        return cartMapper.toDTO(cart);
    }

    @Transactional
    public ShoppingCartDTO removeCartItem(String token, String cartId, int itemIndex) {
        String userId = jwtService.getUserIdFromToken(token);
        ShoppingCart cart = cartRepository.findById(cartId).orElse(null);
        ObjectId userObjectId = new ObjectId(userId);
        if (cart == null || !cart.getUserId().equals(userObjectId)) {
            throw new IllegalArgumentException("Không tìm thấy giỏ hàng");
        }

        if (itemIndex < 0 || itemIndex >= cart.getItems().size()) {
            throw new IllegalArgumentException("Index không hợp lệ");
        }

        cart.getItems().remove(itemIndex);
        
        if (cart.getItems().isEmpty()) {
            cartRepository.delete(cart);
            return null;
        }

        // Cập nhật tổng giá trị
        updateCartSummary(cart, null, cart.getRestaurantId().toString());
        cart = cartRepository.save(cart);
        return cartMapper.toDTO(cart);
    }

    @Transactional
    public Order checkoutCart(String token, CheckoutDTO checkoutDTO) {
        String userId = jwtService.getUserIdFromToken(token);
        ShoppingCart cart = cartRepository.findById(checkoutDTO.getCartId()).orElse(null);
        ObjectId userObjectId = new ObjectId(userId);
        Restaurant restaurant = restaurantRepository.findRestaurantById(cart.getRestaurantId().toString());
        if (cart == null || !cart.getUserId().equals(userObjectId)) {
            throw new IllegalArgumentException("Không tìm thấy giỏ hàng");
        }

        if (cart.getItems().isEmpty()) {
            throw new IllegalArgumentException("Giỏ hàng trống");
        }

        // Đảm bảo summary không null và được tính toán đúng với voucher
        if (cart.getSummary() == null) {
            cart.setSummary(new ShoppingCart.OrderSummary());
        }
        String voucherCode = checkoutDTO.getPromoInfo() != null ? checkoutDTO.getPromoInfo().getCode() : null;
        updateCartSummary(cart, voucherCode, cart.getRestaurantId().toString());

        // Tạo order mới từ cart
        Order order = new Order();
        order.setOrderNumber(orderNumberGenerator.generateOrderNumber());
        order.setCustomerId(cart.getUserId());
        order.setRestaurantId(cart.getRestaurantId());
        
        // Chuyển đổi items
        Order.OrderDetails orderDetails = new Order.OrderDetails();
        orderDetails.setItems(cart.getItems().stream()
            .map(this::convertCartItemToOrderItem)
            .collect(Collectors.toList()));
        
        // Copy các giá trị từ cart summary
        orderDetails.setSubtotal(cart.getSummary().getSubtotal());
        orderDetails.setDeliveryFee(cart.getSummary().getDeliveryFee());
        orderDetails.setServiceFee(cart.getSummary().getServiceFee());
        orderDetails.setTax(cart.getSummary().getTax());
        orderDetails.setDiscount(cart.getSummary().getDiscount());
        orderDetails.setTotalAmount(cart.getSummary().getTotal());
        order.setOrderDetails(orderDetails);

        // Thêm thông tin giao hàng
        if (checkoutDTO.getDeliveryInfo() != null) {
            Order.DeliveryInfo deliveryInfo = new Order.DeliveryInfo();
            Order.Address address = new Order.Address();
            address.setFullAddress(checkoutDTO.getDeliveryInfo().getFullAddress());
            address.setDistrict(checkoutDTO.getDeliveryInfo().getDistrict());
            address.setCity(checkoutDTO.getDeliveryInfo().getCity());
            
            deliveryInfo.setAddress(address);
            deliveryInfo.setCustomerName(checkoutDTO.getDeliveryInfo().getCustomerName());
            deliveryInfo.setCustomerPhone(checkoutDTO.getDeliveryInfo().getCustomerPhone());
            deliveryInfo.setDeliveryInstructions(checkoutDTO.getDeliveryInfo().getDeliveryInstructions());
            deliveryInfo.setEstimatedDeliveryTime(new Date());
            order.setDeliveryInfo(deliveryInfo);
        }

        // Thêm thông tin thanh toán
        if (checkoutDTO.getPaymentInfo() != null) {
            Order.Payment payment = new Order.Payment();
            payment.setMethod(checkoutDTO.getPaymentInfo().getMethod());
            payment.setStatus("PENDING");
            order.setPayment(payment);
        }

        // Thêm mã giảm giá nếu có
        if (checkoutDTO.getPromoInfo() != null && checkoutDTO.getPromoInfo().getCode() != null) {
            Voucher voucher = voucherService.getVoucherByCode(checkoutDTO.getPromoInfo().getCode());
            Order.Promocode promocode = new Order.Promocode();
            promocode.setCode(voucher.getCode());
            promocode.setDiscountAmount(voucher.getValue());
            promocode.setDiscountType(voucher.getType());
            order.setPromocode(promocode);
            
            // Cập nhật giá trị giảm giá trong OrderDetails
            order.getOrderDetails().setDiscount(voucher.getValue());
            // Cập nhật lại tổng tiền sau khi áp dụng giảm giá
            double total = order.getOrderDetails().getSubtotal() + 
                          order.getOrderDetails().getDeliveryFee() + 
                          order.getOrderDetails().getServiceFee() + 
                          order.getOrderDetails().getDiscount();
            order.getOrderDetails().setTotalAmount(total);
            
            // Cập nhật số lượng voucher còn lại và lưu lịch sử sử dụng
            voucherService.useVoucher(voucher.getCode(), userId);
        }
        
        // Set trạng thái đơn hàng
        Order.OrderStatus status = new Order.OrderStatus();
        status.setCurrent("PENDING");
        status.setHistory(new ArrayList<>());
        Order.StatusHistory statusHistory = new Order.StatusHistory();
        statusHistory.setStatus("PENDING");
        statusHistory.setTimestamp(new Date());
        status.getHistory().add(statusHistory);
        order.setStatus(status);

        // Set thời gian
        Order.Timing timing = new Order.Timing();
        timing.setPlacedAt(new Date());
        order.setTiming(timing);
        
        // Set thời gian tạo và cập nhật
        order.setCreatedAt(new Date());
        order.setUpdatedAt(new Date());

        // Lưu order và xóa cart
        order = orderRepository.save(order);
        cartRepository.delete(cart);

        return order;
    }

    private void validateAddToCartRequest(AddToCartRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Request không được để trống");
        }
        if (request.getDishId() == null || request.getDishId().trim().isEmpty()) {
            throw new IllegalArgumentException("Dish ID không được để trống");
        }
        if (request.getQuantity() <= 0) {
            throw new IllegalArgumentException("Số lượng phải lớn hơn 0");
        }
        if (request.getSelectedOptions() != null) {
            for (SelectedOptionRequest option : request.getSelectedOptions()) {
                if (option.getOptionName() == null || option.getOptionName().trim().isEmpty()) {
                    throw new IllegalArgumentException("Tên option không được để trống");
                }
                if (option.getChoiceName() == null || option.getChoiceName().trim().isEmpty()) {
                    throw new IllegalArgumentException("Tên choice không được để trống");
                }
            }
        }
    }

    private Order.OrderItem convertCartItemToOrderItem(ShoppingCart.CartItem cartItem) {
        Order.OrderItem orderItem = new Order.OrderItem();
        orderItem.setDishId(cartItem.getDishId());
        orderItem.setDishName(cartItem.getDishName());
        orderItem.setDishImage(cartItem.getDishImage());
        orderItem.setQuantity(cartItem.getQuantity());
        orderItem.setUnitPrice(cartItem.getUnitPrice());
        orderItem.setSubtotal(cartItem.getSubtotal());
        orderItem.setSpecialInstructions(cartItem.getSpecialInstructions());
        
        if (cartItem.getSelectedOptions() != null) {
            orderItem.setSelectedOptions(cartItem.getSelectedOptions().stream()
                .map(opt -> {
                    Order.SelectedOption option = new Order.SelectedOption();
                    option.setOptionName(opt.getOptionName());
                    option.setChoiceName(opt.getChoiceName());
                    option.setAdditionalPrice(opt.getAdditionalPrice());
                    return option;
                })
                .collect(Collectors.toList()));
        }
        
        return orderItem;
    }

    private double calculateItemSubtotal(ShoppingCart.CartItem item) {
        if (item.getSelectedOptions() == null) {
            return item.getUnitPrice() * item.getQuantity();
        }
        
        double optionsTotal = item.getSelectedOptions().stream()
            .mapToDouble(ShoppingCart.SelectedOption::getAdditionalPrice)
            .sum();
        return (item.getUnitPrice() + optionsTotal) * item.getQuantity();
    }

    private void updateCartSummary(ShoppingCart cart, String voucherCode, String restaurantId) {
        if (cart.getSummary() == null) {
            cart.setSummary(new ShoppingCart.OrderSummary());
        }
        
        // Tính subtotal từ tất cả items
        double subtotal = cart.getItems().stream()
            .mapToDouble(ShoppingCart.CartItem::getSubtotal)
            .sum();
        
        cart.getSummary().setSubtotal(subtotal);
        
        // Tính các phí khác
        cart.getSummary().setDeliveryFee(30000); // Phí giao hàng cố định
        cart.getSummary().setServiceFee(subtotal * 0.05); // 5% phí dịch vụ
        cart.getSummary().setTax(subtotal * 0.1); // 10% thuế
        
        // Tính giảm giá nếu có voucher
        double discount = 0;
        if (voucherCode != null && !voucherCode.isEmpty()) {
            try {
                Voucher voucher = voucherService.getVoucherByCode(voucherCode);
                if (voucher != null && voucher.isActive()) {
                    // Kiểm tra điều kiện áp dụng voucher
                    if (subtotal >= voucher.getConditions().getMinimumOrderAmount()) {
                        // Kiểm tra loại voucher (GLOBAL hoặc LOCAL)
                        if (voucher.getType().equals("GLOBAL") || 
                            (voucher.getType().equals("LOCAL") && voucher.getRestaurantId().equals(restaurantId))) {
                            
                            // Tính giảm giá dựa trên giá trị voucher
                            discount = voucher.getValue();
                        } else {
                            throw new IllegalArgumentException("Voucher không áp dụng cho nhà hàng này");
                        }
                    } else {
                        throw new IllegalArgumentException(
                            String.format("Đơn hàng tối thiểu %,.0fđ để sử dụng voucher này", 
                                voucher.getConditions().getMinimumOrderAmount()));
                    }
                } else {
                    throw new IllegalArgumentException("Voucher không hợp lệ hoặc đã hết hạn");
                }
            } catch (Exception e) {
                throw new IllegalArgumentException("Lỗi khi áp dụng voucher: " + e.getMessage());
            }
        }
        cart.getSummary().setDiscount(discount);
        
        // Tính tổng
        double total = subtotal + cart.getSummary().getDeliveryFee() + 
                      cart.getSummary().getServiceFee() + cart.getSummary().getTax() - 
                      cart.getSummary().getDiscount();
        cart.getSummary().setTotal(total);
    }

    public List<ShoppingCartDTO.CartItem> getItemInRestaurantCart(String token, String restaurantId) {
        String userId = jwtService.getUserIdFromToken(token);
        
        // Tìm giỏ hàng của nhà hàng này
        ShoppingCart cart = cartRepository.findByUserIdAndRestaurantId(
            new ObjectId(userId), 
            new ObjectId(restaurantId));
        if (cart == null) {
            return new ArrayList<>();
        }

        // Tìm tất cả món ăn của nhà hàng trong giỏ hàng
        List<ShoppingCart.CartItem> items = cart.getItems();

        if (items == null || items.isEmpty()) {
            return new ArrayList<>();
        }

        // Chuyển đổi sang DTO và trả về
        return items.stream()
            .map(item -> ShoppingCartDTO.CartItem.builder()
                .dishId(item.getDishId().toString())
                .dishName(item.getDishName())
                .dishImage(item.getDishImage())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .selectedOptions(item.getSelectedOptions() != null ? 
                    item.getSelectedOptions().stream()
                    .map(opt -> ShoppingCartDTO.SelectedOption.builder()
                        .optionName(opt.getOptionName())
                        .choiceName(opt.getChoiceName())
                        .additionalPrice(opt.getAdditionalPrice())
                        .build())
                    .collect(Collectors.toList()) : new ArrayList<>())
                .subtotal(item.getSubtotal())
                .specialInstructions(item.getSpecialInstructions())
                .build())
            .collect(Collectors.toList());
    }
} 