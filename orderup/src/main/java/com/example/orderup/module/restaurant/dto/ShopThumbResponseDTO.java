package com.example.orderup.module.restaurant.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShopThumbResponseDTO {
    private int count;
    private List<ShopThumbDTO> data;
}