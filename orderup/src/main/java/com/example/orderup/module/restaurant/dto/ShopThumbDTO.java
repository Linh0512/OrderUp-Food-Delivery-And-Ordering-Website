package com.example.orderup.module.restaurant.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ShopThumbDTO {
    private String id;
    private String name;
    private String address;
    private int review;
    private double star;
    private boolean isActive;
    private String timeRange;
    private String priceRange;
    private String image;
}
