package com.example.orderup.module.restaurant.dto;

import lombok.Data;
import lombok.Builder;
import java.time.LocalDateTime;

@Data
@Builder
public class OrderSummaryDTO {
    private String id;
    private String restaurantId;
    private String status;
    private double totalAmount;
    private LocalDateTime createdAt;
} 