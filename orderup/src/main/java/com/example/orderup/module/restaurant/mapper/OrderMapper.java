package com.example.orderup.module.restaurant.mapper;

import org.springframework.stereotype.Component;
import com.example.orderup.module.user.entirty.Order;
import com.example.orderup.module.restaurant.dto.OrderSummaryDTO;
import org.bson.types.ObjectId;
import java.util.Objects;

@Component
public class OrderMapper {
    
    public OrderSummaryDTO toOrderSummaryDTO(Order order) {
        if (order == null) {
            return null;
        }
        
        return OrderSummaryDTO.builder()
                .id(order.getId())
                .restaurantId(Objects.toString(order.getRestaurantId(), null))
                .status(order.getStatus() != null ? order.getStatus().getCurrent() : null)
                .totalAmount(order.getOrderDetails() != null ? order.getOrderDetails().getTotalAmount() : 0.0)
                .createdAt(order.getCreatedAt())
                .build();
    }
} 