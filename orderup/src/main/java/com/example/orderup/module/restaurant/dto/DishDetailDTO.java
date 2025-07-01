package com.example.orderup.module.restaurant.dto;

import org.springframework.data.mongodb.core.mapping.Field;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonPOJOBuilder;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonDeserialize(builder = DishDetailDTO.DishDetailDTOBuilder.class)
public class DishDetailDTO {
    private String id;
    private String restaurantId;
    private String categoryId;
    private String name;
    private String description;
    private List<String> images;
    private List<String> tags;
    private int basePrice;
    private int discountPrice;
    @JsonProperty("isDiscounted")
    private boolean isDiscounted;
    private List<Option> options;
    private RatingInfo ratings;
    private int preparationTime;

    @Field("isActive")
    private boolean active;

    public boolean isActive() {
        return active;
    }
    public void setActive(boolean active) {
        this.active = active;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Option {
        private String name;
        private String type;
        @JsonProperty("required")
        private boolean isRequired;
        private List<Choice> choices;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Choice {
        private String name;
        private int price;
        @JsonProperty("default")
        private boolean isDefault;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TimeRange {
        private String start;
        private String end;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RatingInfo {
        private double averageRating;
        private int totalReviews;
    }

    @JsonPOJOBuilder(withPrefix = "")
    public static class DishDetailDTOBuilder {
    }
}