package com.example.orderup.module.restaurant.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;
import org.bson.types.ObjectId;

@Data
@Builder
public class DishThumbDTO {
    private String id;
    private String name;
    private String description;
    private int basePrice;
    private int discountPrice;
    private boolean isDiscounted;
    private List<String> images;
    private boolean isActive;
    private ObjectId restaurantId;
}