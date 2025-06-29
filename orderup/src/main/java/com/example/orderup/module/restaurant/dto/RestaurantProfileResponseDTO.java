package com.example.orderup.module.restaurant.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantProfileResponseDTO {
    private RestaurantProfileDTO data;
}
