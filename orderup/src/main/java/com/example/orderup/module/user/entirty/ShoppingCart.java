package com.example.orderup.module.user.entirty;

import java.util.List;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "shopping_carts")
public class ShoppingCart {
    @Id
    private String id;
    private ObjectId userId;
    private ObjectId restaurantId;
    private List<CartItem> items;
    private OrderSummary summary;

    @Data
    public static class CartItem {
        private ObjectId dishId;
        private String dishName;
        private String dishImage;
        private int quantity;
        private double unitPrice;
        private List<SelectedOption> selectedOptions;
        private double subtotal;
        private String specialInstructions;
    }

    @Data
    public static class SelectedOption {
        private String optionName;
        private String choiceName;
        private double additionalPrice;
    }

    @Data
    public static class OrderSummary {
        private double subtotal;
        private double deliveryFee;
        private double serviceFee;
        private double tax;
        private double discount;
        private double total;
    }
} 