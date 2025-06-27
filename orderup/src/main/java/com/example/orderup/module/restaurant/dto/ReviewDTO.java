package com.example.orderup.module.restaurant.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDTO {
    private String id;
    private String userId;
    private String restaurantId;
    private String userComment;
    private double rating;
    private List<String> images;
    private List<OrderItem> orderItems;
    private String userName;
    private String userAvatar;
    private String createdAt;
    private String updatedAt;

    @Data
    public static class CreateReviewRequest {
        private List<String> images;
        private String userComment;
        private double rating;
    }

    @Data
    @Builder
    public static class OrderItem {
        private String dishName;
        private String dishImage;
        private int quantity;
        private double unitPrice;
    }
}