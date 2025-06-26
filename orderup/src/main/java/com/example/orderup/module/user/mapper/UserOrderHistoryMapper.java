package com.example.orderup.module.user.mapper;

import java.time.format.DateTimeFormatter;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.orderup.module.restaurant.entity.Restaurant;
import com.example.orderup.module.restaurant.service.RestaurantService;
import com.example.orderup.module.user.entirty.Order;
import com.example.orderup.module.user.dto.UserOrderHistoryDetailDTO;
import com.example.orderup.module.user.dto.UserOrderHistoryThumbDTO;

@Component
public class UserOrderHistoryMapper {
    
    @Autowired
    private RestaurantService restaurantService;

    public UserOrderHistoryThumbDTO toUserOrderHistoryThumbDTO(Order order) {
        Restaurant restaurant = restaurantService.getRestaurantById(order.getRestaurantId().toString());
        
        return UserOrderHistoryThumbDTO.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .orderDate(order.getCreatedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")))
                .orderTotalAmount(String.format("%,.0f", order.getOrderDetails().getTotalAmount()))
                .userId(order.getCustomerId().toString())
                .restaurantId(order.getRestaurantId().toString())
                .restaurantName(restaurant != null ? restaurant.getBasicInfo().getName() : "N/A")
                .restaurantImage(restaurant != null && restaurant.getBasicInfo().getImages() != null && !restaurant.getBasicInfo().getImages().isEmpty() 
                    ? restaurant.getBasicInfo().getImages().get(0) : "")
                .restaurantAddress(restaurant != null ? restaurant.getAddress().getFullAddress() : "N/A")
                .build();
    }

    public UserOrderHistoryDetailDTO toUserOrderHistoryDetailDTO(Order order) {
        Restaurant restaurant = restaurantService.getRestaurantById(order.getRestaurantId().toString());
        
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
        UserOrderHistoryDetailDTO.OrderSummary orderSummary = UserOrderHistoryDetailDTO.OrderSummary.builder()
                .subtotal(order.getOrderDetails().getSubtotal())
                .deliveryFee(order.getOrderDetails().getDeliveryFee())
                .serviceFee(order.getOrderDetails().getServiceFee())
                .discount(order.getPromocode() != null ? order.getPromocode().getDiscountAmount() : 0)
                .total(order.getOrderDetails().getTotalAmount())
                .finalTotal(order.getOrderDetails().getTotalAmount() - order.getPromocode().getDiscountAmount())
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
                .orderDate(order.getCreatedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")))
                .deliveryInfo(deliveryInfo)
                .paymentInfo(paymentInfo)
                .promoInfo(promoInfo)
                .orderSummary(orderSummary)
                .orderItems(orderItems)
                .build();
    }
}
