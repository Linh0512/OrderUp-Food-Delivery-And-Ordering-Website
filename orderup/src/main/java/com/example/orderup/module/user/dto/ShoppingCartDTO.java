package com.example.orderup.module.user.dto;

import lombok.Data;
import lombok.Builder;
import java.util.List;

@Data
@Builder
public class ShoppingCartDTO {
    private String id;
    private String userId;
    private String restaurantId;
    private String restaurantName;
    private List<CartItemDTO> items;
    private double subtotal;

    @Data
    @Builder
    public static class CartItemDTO {
        private String dishId;
        private String dishName;
        private String dishImage;
        private int quantity;
        private String unitPrice;
        private List<SelectedOptionDTO> selectedOptions;
        private String subtotal;
        private String specialInstructions;
    }

    @Data
    @Builder
    public static class SelectedOptionDTO {
        private String optionName;
        private String choiceName;
        private String additionalPrice;
    }
} 