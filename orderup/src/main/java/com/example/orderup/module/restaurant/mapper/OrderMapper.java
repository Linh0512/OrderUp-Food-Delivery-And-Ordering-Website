package com.example.orderup.module.restaurant.mapper;

import org.springframework.stereotype.Component;
import com.example.orderup.module.user.entirty.Order;
import com.example.orderup.module.restaurant.dto.OrderSummaryDTO;
import java.util.Objects;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Component
public class OrderMapper {
    
    public OrderSummaryDTO toOrderSummaryDTO(Order order) {
        if (order == null) {
            return null;
        }
        
        // Convert Date to LocalDateTime for DTO
        LocalDateTime createdAtLocal = null;
        if (order.getCreatedAt() != null) {
            createdAtLocal = order.getCreatedAt().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        }
        
        return OrderSummaryDTO.builder()
                .id(order.getId())
                .restaurantId(Objects.toString(order.getRestaurantId(), null))
                .status(order.getStatus() != null ? order.getStatus().getCurrent() : null)
                .totalAmount(order.getOrderDetails() != null ? order.getOrderDetails().getTotalAmount() : 0.0)
                .createdAt(createdAtLocal)
                .build();
    }
} 