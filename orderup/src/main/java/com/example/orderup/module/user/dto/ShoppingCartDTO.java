package com.example.orderup.module.user.dto;

import java.util.List;
import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class ShoppingCartDTO {
    private String id;
    private String userId;
    private String restaurantId;
    private RestaurantInfo restaurant;
    private List<CartItem> items;
    private OrderSummary summary;

    @Data
    @Builder
    public static class RestaurantInfo {
        private String name;
        private String image;
        private String address;
    }

    @Data
    @Builder
    public static class CartItem {
        private String dishId;
        private String dishName;
        private String dishImage;
        private int quantity;
        private double unitPrice;
        private List<SelectedOption> selectedOptions;
        private double subtotal;
        private String specialInstructions;
    }

    @Data
    @Builder
    public static class SelectedOption {
        private String optionName;
        private String choiceName;
        private double additionalPrice;
    }

    @Data
    @Builder
    public static class OrderSummary {
        private double subtotal;
        private double deliveryFee;
        private double serviceFee;
        private double tax;
        private double discount;
        private double total;
    }

    @Data
    public static class AddToCartRequest {
        private String dishId;
        private int quantity;
        private List<SelectedOptionRequest> selectedOptions;
        private String specialInstructions;
    }

    @Data
    public static class SelectedOptionRequest {
        private String optionName;
        private String choiceName;
    }

    @Data
    public static class GetItemInCartRequest {
        private int quantity;
        private List<SelectedOptionRequest> selectedOptions;
        private String specialInstructions;
    }

    @Data
    public static class UpdateCartItemRequest {
        private int quantity;
        private String specialInstructions;
        private List<SelectedOptionRequest> selectedOptions;
    }
} 