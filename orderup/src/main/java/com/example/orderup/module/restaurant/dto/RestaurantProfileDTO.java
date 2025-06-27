package com.example.orderup.module.restaurant.dto;

import java.util.List;
import java.util.Map;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.example.orderup.module.restaurant.entity.Restaurant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantProfileDTO {
    // Restaurant information
    private String restaurantId;
    private String restaurantName;
    private List<String> restaurantImages;
    private String restaurantOwner;
    private String restaurantDescription;
    private String restaurantEmail;
    private String restaurantWebsite;
    private String restaurantAddress;
    private String restaurantPhone;

    // Restaurant rating
    private int restaurantReviewCount;
    private double restaurantStar;
    private Map<String, Integer> ratingBreakdown;

    // Restaurant operating hours and price range
    private boolean restaurantIsActive;
    private List<String> restaurantTimeRange;
    private List<Restaurant.OperatingHour> operatingHours;
    private String restaurantPriceRange;

    // Restaurant delivery information
    private String restaurantDeliveryRadius;
    private String restaurantDeliveryTime;
    private String restaurantDeliveryFee;
    private boolean restaurantDeliveryAvailable;
}
