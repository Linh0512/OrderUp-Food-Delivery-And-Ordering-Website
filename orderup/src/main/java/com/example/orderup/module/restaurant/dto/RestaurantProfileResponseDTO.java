package com.example.orderup.module.restaurant.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RestaurantProfileResponseDTO {
    private RestaurantProfileDTO data;
}
