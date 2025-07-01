package com.example.orderup.module.restaurant.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DishThumbDTO {
    private String id;
    private String name;
    private String description;
    private String image;
    private int basePrice;
    private int discountPrice;
    private boolean isDiscounted;
    private boolean active;

    public boolean isActive() {
        return active;
    }
    public void setActive(boolean active) {
        this.active = active;
    }
}