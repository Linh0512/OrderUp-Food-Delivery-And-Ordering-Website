package com.example.orderup.module.user.dto;

import java.util.List;
import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class UserOrderHistoryDetailDTO {
    private String id;
    private String orderNumber;
    private String orderDate;
    private String orderTotalAmount;
    private String userId;
    private String userAddress;
    private UserProfile userProfile;
    private String restaurantId;
    private String restaurantName;
    private String restaurantImage;
    private String restaurantAddress;
    private String restaurantPhone;
    private String restaurantEmail;
    private String restaurantWebsite;
    private List<OrderItem> orderItems;

    @Data
    @Builder
    public static class UserProfile {
        private String firstName;
        private String lastName;
        private String fullName;
        private String phone;
        private String avatar;
        private String dateOfBirth;
        private String gender;
    }

    @Data
    @Builder
    public static class OrderItem {
        private String dishName;
        private String dishImage;
        private String dishPrice;
        private String dishQuantity;
        private String dishTotalPrice;
        private String dishDescription;
        private String dishSubcategory;
        private List<OrderItemOption> orderItemOptions;
    }

    @Data
    @Builder
    public static class OrderItemOption {
        private String optionName;
        private String choiceName;
        private String additionalPrice;
    }
}
