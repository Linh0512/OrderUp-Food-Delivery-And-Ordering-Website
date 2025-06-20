package com.example.orderup.module.user.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserOrderHistoryThumbDTO {
    private String id;
    private String orderNumber;
    private String orderDate;
    private String orderTotalAmount;
    private String userId;
    private String restaurantId;
    private String restaurantName;
    private String restaurantImage;
    private String restaurantAddress;
}
