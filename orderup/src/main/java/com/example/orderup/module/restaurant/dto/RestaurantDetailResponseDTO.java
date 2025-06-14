package com.example.orderup.module.restaurant.dto;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RestaurantDetailResponseDTO {
    private int count;
    private List<RestaurantDetailDTO> data;
}
