package com.example.orderup.module.restaurant.dto;

import java.util.List;
import java.util.Map;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantDetailDTO {
    // Restaurant information
    private String restaurantId;
    private String restaurantName;
    private String restaurantAddress;
    private String restaurantPhone;
    private double distance;
    private int restaurantReviewCount;
    private double restaurantStar;
    private Map<String, Integer> ratingBreakdown;
    private boolean restaurantIsActive;
    private String restaurantTimeRange;
    private String restaurantPriceRange;
    private String restaurantImage;

    // List of dishes
    private List<DishThumbDTO> dishes;
}
