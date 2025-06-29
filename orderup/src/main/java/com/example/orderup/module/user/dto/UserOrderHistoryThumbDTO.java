package com.example.orderup.module.user.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
    private int orderTotalQuantity;
    private boolean isReview; // Trường để kiểm tra order đã được review chưa
    private UserProfile userProfile;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserProfile {
        private String fullName;
        private String avatar;
    }
}
