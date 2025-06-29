package com.example.orderup.module.restaurant.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DishListResponseDTO {
    private int count;
    private List<DishThumbDTO> data;
}