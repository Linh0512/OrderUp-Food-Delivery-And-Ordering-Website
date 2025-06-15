package com.example.orderup.module.restaurant.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class DishListResponseDTO {
    private int count;
    private List<DishThumbDTO> data;
}