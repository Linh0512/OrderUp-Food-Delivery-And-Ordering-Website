package com.example.orderup.module.restaurant.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
    private double distance; // Khoảng cách đến địa chỉ mặc định của user (km)
}
