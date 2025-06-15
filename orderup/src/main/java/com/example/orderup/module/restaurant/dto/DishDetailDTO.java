package com.example.orderup.module.restaurant.dto;

import org.bson.types.ObjectId;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class DishDetailDTO {
    private String id;
    private String name;
    private String description;
    private int basePrice;
    private int discountPrice;
    @JsonProperty("isDiscounted")
    private boolean isDiscounted;
    private List<String> images;
    private List<String> tags;
    private int preparationTime;
    private String restaurantId;
    private String optionName;
    private String optionType;
    private boolean optionIsRequired;
    private List<String> choiceName;
    private List<Integer> choicePrice;
}