package com.example.orderup.module.user.entirty;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.bson.types.ObjectId;
import lombok.Data;
import java.util.List;
import java.time.LocalDateTime;

@Data
@Document(collection = "shopping_carts")
public class ShoppingCart {
    @Id
    private String id;
    private ObjectId userId;
    private ObjectId restaurantId;
    private List<CartItem> items;
    private double subtotal;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

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
} 