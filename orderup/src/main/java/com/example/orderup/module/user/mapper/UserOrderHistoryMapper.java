package com.example.orderup.module.user.mapper;

import java.time.format.DateTimeFormatter;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.List;
import java.text.SimpleDateFormat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.orderup.module.restaurant.entity.Restaurant;
import com.example.orderup.module.restaurant.service.RestaurantService;
import com.example.orderup.module.user.entirty.Order;
import com.example.orderup.module.user.entirty.Order.OrderItem;
import com.example.orderup.module.user.dto.UserOrderHistoryDetailDTO;
import com.example.orderup.module.user.dto.UserOrderHistoryThumbDTO;
import com.example.orderup.module.user.entirty.User;

@Component
public class UserOrderHistoryMapper {
    
    @Autowired
    private RestaurantService restaurantService;

    public UserOrderHistoryThumbDTO toUserOrderHistoryThumbDTO(Order order, User user) {
        Restaurant restaurant = restaurantService.getRestaurantById(order.getRestaurantId().toString());
        
        // Format date using SimpleDateFormat for Date objects
        SimpleDateFormat dateFormatter = new SimpleDateFormat("dd/MM/yyyy");
        String formattedDate = order.getCreatedAt() != null ? dateFormatter.format(order.getCreatedAt()) : "";
        
        return UserOrderHistoryThumbDTO.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .orderDate(formattedDate)
                .orderTotalAmount(String.format("%,.0f", order.getOrderDetails().getTotalAmount()))
                .userId(order.getCustomerId().toString())
                .restaurantId(order.getRestaurantId().toString())
                .restaurantName(restaurant != null ? restaurant.getBasicInfo().getName() : "N/A")
                .restaurantImage(restaurant != null && restaurant.getBasicInfo().getImages() != null && !restaurant.getBasicInfo().getImages().isEmpty() 
                    ? restaurant.getBasicInfo().getImages().get(0) : "")
                .restaurantAddress(restaurant != null ? restaurant.getAddress().getFullAddress() : "N/A")
                .orderTotalQuantity(order.getOrderDetails() != null && order.getOrderDetails().getItems() != null ? 
                    order.getOrderDetails().getItems().stream().map(OrderItem::getQuantity).reduce(0, Integer::sum) : 0)
                .userProfile(UserOrderHistoryThumbDTO.UserProfile.builder()
                    .fullName(user.getFullName() != null ? user.getFullName() : "N/A")
                    .avatar(user.getProfile().getAvatar() != null ? user.getProfile().getAvatar() : "")
                    .build())
                .build();
    }

    public UserOrderHistoryDetailDTO toUserOrderHistoryDetailDTO(Order order, User user) {
        Restaurant restaurant = restaurantService.getRestaurantById(order.getRestaurantId().toString());

        UserOrderHistoryDetailDTO.RestaurantInfo restaurantInfo = UserOrderHistoryDetailDTO.RestaurantInfo.builder()
                .restaurantId(restaurant.getId())
                .restaurantName(restaurant.getBasicInfo().getName())
                .restaurantImage(restaurant.getBasicInfo().getImages().get(0))
                .restaurantAddress(restaurant.getAddress().getFullAddress() != null ? restaurant.getAddress().getFullAddress() : "N/A")
                .restaurantPhone(restaurant.getBasicInfo().getPhone() != null ? restaurant.getBasicInfo().getPhone() : "N/A")
                .restaurantEmail(restaurant.getBasicInfo().getEmail() != null ? restaurant.getBasicInfo().getEmail() : "N/A")
                .restaurantWebsite(restaurant.getBasicInfo().getWebsite() != null ? restaurant.getBasicInfo().getWebsite() : "N/A")
                .build();
        // Map delivery info
        UserOrderHistoryDetailDTO.DeliveryInfo deliveryInfo = null;
        if (order.getDeliveryInfo() != null) {
            deliveryInfo = UserOrderHistoryDetailDTO.DeliveryInfo.builder()
                .fullAddress(order.getDeliveryInfo().getAddress().getFullAddress())
                .district(order.getDeliveryInfo().getAddress().getDistrict())
                .city(order.getDeliveryInfo().getAddress().getCity())
                .customerName(order.getDeliveryInfo().getCustomerName())
                .customerPhone(order.getDeliveryInfo().getCustomerPhone())
                .deliveryInstructions(order.getDeliveryInfo().getDeliveryInstructions())
                .build();
        }

        // Map payment info
        UserOrderHistoryDetailDTO.PaymentInfo paymentInfo = null;
        if (order.getPayment() != null) {
            paymentInfo = UserOrderHistoryDetailDTO.PaymentInfo.builder()
                .method(order.getPayment().getMethod())
                .build();
        }

        // Map promo info
        UserOrderHistoryDetailDTO.PromoInfo promoInfo = null;
        if (order.getPromocode() != null) {
            promoInfo = UserOrderHistoryDetailDTO.PromoInfo.builder()
                .code(order.getPromocode().getCode())
                .discountAmount(order.getPromocode().getDiscountAmount())
                .build();
        }

        // Map order summary
        double discountAmount = order.getPromocode() != null ? order.getPromocode().getDiscountAmount() : 0;
        UserOrderHistoryDetailDTO.OrderSummary orderSummary = UserOrderHistoryDetailDTO.OrderSummary.builder()
                .subtotal(order.getOrderDetails().getSubtotal())
                .deliveryFee(order.getOrderDetails().getDeliveryFee())
                .serviceFee(order.getOrderDetails().getServiceFee())
                .discount(discountAmount)
                .total(order.getOrderDetails().getTotalAmount())
                .finalTotal(order.getOrderDetails().getTotalAmount() - discountAmount)
                .build();

        // Map order items
        List<UserOrderHistoryDetailDTO.OrderItem> orderItems = new ArrayList<>();
        if (order.getOrderDetails() != null && order.getOrderDetails().getItems() != null) {
            orderItems = order.getOrderDetails().getItems().stream()
                .map(item -> UserOrderHistoryDetailDTO.OrderItem.builder()
                    .dishId(item.getDishId().toString())
                    .dishName(item.getDishName())
                    .dishImage(item.getDishImage())
                    .quantity(item.getQuantity())
                    .unitPrice(item.getUnitPrice())
                    .subtotal(item.getSubtotal())
                    .specialInstructions(item.getSpecialInstructions())
                    .selectedOptions(item.getSelectedOptions() != null ?
                        item.getSelectedOptions().stream()
                            .map(option -> UserOrderHistoryDetailDTO.OrderItemOption.builder()
                                .optionName(option.getOptionName())
                                .choiceName(option.getChoiceName())
                                .additionalPrice(option.getAdditionalPrice())
                                .build())
                            .collect(Collectors.toList()) :
                        new ArrayList<>())
                    .build())
                .collect(Collectors.toList());
        }
        
        return UserOrderHistoryDetailDTO.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .orderDate(order.getCreatedAt() != null ? new SimpleDateFormat("dd/MM/yyyy").format(order.getCreatedAt()) : "")
                .deliveryInfo(deliveryInfo)
                .paymentInfo(paymentInfo)
                .promoInfo(promoInfo)
                .orderSummary(orderSummary)
                .orderItems(orderItems)
                .restaurantInfo(restaurantInfo)
                .userProfile(UserOrderHistoryDetailDTO.UserProfile.builder()
                    .fullName(user.getFullName() != null ? user.getFullName() : "N/A")
                    .avatar(user.getProfile().getAvatar() != null ? user.getProfile().getAvatar() : "")
                    .build())
                .build();
    }
}
