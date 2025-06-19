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
    private Availability availability;
    private RatingInfo ratings;
    private int preparationTime;

    @Data
    @Builder
    public static class Option {
        private String name;
        private String type;
        private boolean isRequired;
        private List<Choice> choices;
    }

    @Data
    @Builder
    public static class Choice {
        private String name;
        private int price;
        private boolean isDefault;
    }

    @Data
    @Builder
    public static class TimeRange {
        private String start;
        private String end;
    }

    @Data
    @Builder
    public static class Availability {
        private boolean isAvailable;
        private List<TimeRange> availableTimes;
        private Integer stockQuantity;
        private boolean soldOut;
    }

    @Data
    @Builder
    public static class RatingInfo {
        private double averageRating;
        private int totalReviews;
    }
}