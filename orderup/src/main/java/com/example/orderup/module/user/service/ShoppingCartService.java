package com.example.orderup.module.user.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.bson.types.ObjectId;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.example.orderup.module.user.entirty.ShoppingCart;
import com.example.orderup.module.user.repository.ShoppingCartRepository;
import com.example.orderup.module.restaurant.service.RestaurantService;
import com.example.orderup.module.user.dto.ShoppingCartDTO;
import com.example.orderup.module.user.dto.ShoppingCartDTO.*;
import com.example.orderup.module.restaurant.entity.Restaurant;
import com.example.orderup.repositories.RestaurantRepository;
import com.example.orderup.module.user.entirty.Order;
import com.example.orderup.module.user.repository.UserOrderHistoryRepository;
import com.example.orderup.module.user.mapper.ShoppingCartMapper;
import com.example.orderup.config.security.JwtTokenProvider;
import com.example.orderup.module.restaurant.entity.Dish;
import com.example.orderup.module.restaurant.repository.DishRepository;
import com.example.orderup.module.user.service.OrderNumberGenerator;

@Service
public class ShoppingCartService {
    
    @Autowired
    private ShoppingCartRepository cartRepository;
    
    @Autowired
    private RestaurantRepository restaurantRepository;
    
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
            cartRepository.save(cart);
        } else if (!cart.getRestaurantId().equals(new ObjectId(restaurantId))) {
            // Nếu user chọn món từ nhà hàng khác, xóa giỏ hàng cũ
            cartRepository.delete(cart);
            cart = new ShoppingCart();
            cart.setUserId(userObjectId);
            cart.setRestaurantId(new ObjectId(restaurantId));
            cart.setItems(new ArrayList<>());
            cart.setSummary(new ShoppingCart.OrderSummary());
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
        double cartSubtotal = cart.getItems().stream()
                .mapToDouble(ShoppingCart.CartItem::getSubtotal)
                .sum();
        cart.getSummary().setSubtotal(cartSubtotal);
        
        return cartRepository.save(cart);
    }

    public ShoppingCart updateCartItem(String userId, String itemId, int quantity) {
        ObjectId userObjectId = new ObjectId(userId);
        List<ShoppingCart> carts = cartRepository.findByUserId(userObjectId);
        ShoppingCart cart = null;
        if (carts != null && !carts.isEmpty()) {
            cart = carts.get(0);
        }
        
        if (cart != null) {
            cart.getItems().stream()
                .filter(item -> item.getDishId().toString().equals(itemId))
                .findFirst()
                .ifPresent(item -> {
                    item.setQuantity(quantity);
                    double itemSubtotal = item.getUnitPrice() * quantity;
                    if (item.getSelectedOptions() != null) {
                        for (ShoppingCart.SelectedOption option : item.getSelectedOptions()) {
                            itemSubtotal += option.getAdditionalPrice() * quantity;
                        }
                    }
                    item.setSubtotal(itemSubtotal);
                });
            
            double cartSubtotal = cart.getItems().stream()
                    .mapToDouble(ShoppingCart.CartItem::getSubtotal)
                    .sum();
            cart.getSummary().setSubtotal(cartSubtotal);
            
            return cartRepository.save(cart);
        }
        
        return null;
    }

    public void removeFromCart(String userId, String itemId) {
        ObjectId userObjectId = new ObjectId(userId);
        List<ShoppingCart> carts = cartRepository.findByUserId(userObjectId);
        ShoppingCart cart = null;
        if (carts != null && !carts.isEmpty()) {
            cart = carts.get(0);
        }
        
        if (cart != null) {
            cart.getItems().removeIf(item -> item.getDishId().toString().equals(itemId));
            
            double cartSubtotal = cart.getItems().stream()
                    .mapToDouble(ShoppingCart.CartItem::getSubtotal)
                    .sum();
            cart.getSummary().setSubtotal(cartSubtotal);
            
            cartRepository.save(cart);
        }
    }

    public void clearCart(String userId) {
        ObjectId userObjectId = new ObjectId(userId);
        cartRepository.deleteByUserId(userObjectId);
    }

    public ShoppingCart getCart(String userId) {
        ObjectId userObjectId = new ObjectId(userId);
        List<ShoppingCart> carts = cartRepository.findByUserId(userObjectId);
        if (carts != null && !carts.isEmpty()) {
            return carts.get(0);
        }
        return null;
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
        if (request.getSelectedOptions() != null) {
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
        updateCartSummary(cart);

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
        updateCartSummary(cart);

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
        updateCartSummary(cart);
        cart = cartRepository.save(cart);
        return cartMapper.toDTO(cart);
    }

    @Transactional
    public Order checkoutCart(String token, String cartId) {
        String userId = jwtService.getUserIdFromToken(token);
        ShoppingCart cart = cartRepository.findById(cartId).orElse(null);
        ObjectId userObjectId = new ObjectId(userId);
        if (cart == null || !cart.getUserId().equals(userObjectId)) {
            throw new IllegalArgumentException("Không tìm thấy giỏ hàng");
        }

        if (cart.getItems().isEmpty()) {
            throw new IllegalArgumentException("Giỏ hàng trống");
        }

        // Đảm bảo summary không null và được tính toán đúng
        if (cart.getSummary() == null) {
            cart.setSummary(new ShoppingCart.OrderSummary());
        }
        updateCartSummary(cart);

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
        
        // Set các giá trị mặc định
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        
        Order.OrderStatus status = new Order.OrderStatus();
        status.setCurrent("PENDING");
        status.setHistory(new ArrayList<>());
        Order.StatusHistory statusHistory = new Order.StatusHistory();
        statusHistory.setStatus("PENDING");
        statusHistory.setTimestamp(LocalDateTime.now());
        status.getHistory().add(statusHistory);
        order.setStatus(status);

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

    private void updateCartSummary(ShoppingCart cart) {
        if (cart.getSummary() == null) {
            cart.setSummary(new ShoppingCart.OrderSummary());
        }
        
        // Tính subtotal từ tất cả items
        double subtotal = cart.getItems().stream()
            .mapToDouble(ShoppingCart.CartItem::getSubtotal)
            .sum();
        
        cart.getSummary().setSubtotal(subtotal);
        
        // Tính các phí khác (có thể tùy chỉnh theo logic của bạn)
        cart.getSummary().setDeliveryFee(30000); // Phí giao hàng cố định
        cart.getSummary().setServiceFee(subtotal * 0.05); // 5% phí dịch vụ
        cart.getSummary().setTax(subtotal * 0.1); // 10% thuế
        cart.getSummary().setDiscount(0); // Chưa áp dụng giảm giá
        
        // Tính tổng
        double total = subtotal + cart.getSummary().getDeliveryFee() + 
                      cart.getSummary().getServiceFee() + cart.getSummary().getTax() - 
                      cart.getSummary().getDiscount();
        cart.getSummary().setTotal(total);
    }
} 