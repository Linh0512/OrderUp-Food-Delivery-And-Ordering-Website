package com.example.orderup.module.user.mapper;

import java.time.format.DateTimeFormatter;
import java.util.stream.Collectors;

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
        
        return UserOrderHistoryDetailDTO.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .orderDate(order.getCreatedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")))
                .orderTotalAmount(String.format("%,.0f", order.getOrderDetails().getTotalAmount()))
                .userId(order.getCustomerId().toString())
                .userAddress(order.getDeliveryInfo().getAddress().getFullAddress())
                .restaurantId(order.getRestaurantId().toString())
                .restaurantName(restaurant != null ? restaurant.getBasicInfo().getName() : "N/A")
                .restaurantImage(restaurant != null && restaurant.getBasicInfo().getImages() != null && !restaurant.getBasicInfo().getImages().isEmpty() 
                    ? restaurant.getBasicInfo().getImages().get(0) : "")
                .restaurantAddress(restaurant != null ? restaurant.getAddress().getFullAddress() : "N/A")
                .restaurantPhone(restaurant != null ? restaurant.getBasicInfo().getPhone() : "N/A")
                .restaurantEmail(restaurant != null ? restaurant.getBasicInfo().getEmail() : "N/A")
                .restaurantWebsite(restaurant != null ? restaurant.getBasicInfo().getWebsite() : "N/A")
                .orderItems(order.getOrderDetails().getItems().stream()
                    .map(item -> UserOrderHistoryDetailDTO.OrderItem.builder()
                        .dishName(item.getDishName())
                        .dishImage(item.getDishImage())
                        .dishPrice(String.format("%,.0f", item.getUnitPrice()))
                        .dishQuantity(String.valueOf(item.getQuantity()))
                        .dishTotalPrice(String.format("%,.0f", item.getSubtotal()))
                        .orderItemOptions(item.getSelectedOptions().stream()
                            .map(option -> UserOrderHistoryDetailDTO.OrderItemOption.builder()
                                .optionName(option.getOptionName())
                                .choiceName(option.getChoiceName())
                                .additionalPrice(String.format("%,.0f", option.getAdditionalPrice()))
                                .build())
                            .collect(Collectors.toList()))
                        .build())
                    .collect(Collectors.toList()))
                .build();
    }
}
