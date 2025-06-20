package com.example.orderup.module.restaurant.dto;

import lombok.Data;
import lombok.Builder;
import java.util.List;

@Data
@Builder
public class ShopThumbResponseDTO {
    private int count;
    private List<ShopThumbDTO> data;
}