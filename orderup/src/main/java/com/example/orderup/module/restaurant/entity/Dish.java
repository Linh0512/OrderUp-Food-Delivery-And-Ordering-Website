package com.example.orderup.module.restaurant.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import lombok.Data;
import org.bson.types.ObjectId;

@Data
@Document(collection = "dishes")
public class Dish {
    @Id
    private String id;
    private ObjectId restaurantId;
    private String categoryId;
    private BasicInfo basicInfo;
    private Pricing pricing;
    private NutritionInfo nutritionInfo;
    private List<Option> options;
    private Availability availability;
    private RatingInfo ratings;
    private StatInfo stats;
    private boolean isActive;
    private boolean isFeatured;
    private int preparationTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;


    public void setActive(boolean isActive) {
        this.isActive = isActive;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setFeatured(boolean isFeatured) {
        this.isFeatured = isFeatured;
    }

    public boolean isFeatured() {
        return isFeatured;
    }


    // Nested classes
    @Data
    public static class BasicInfo {
        private String name;
        private String description;
        private List<String> images;
        private List<String> tags;
    }

    @Data
    public static class Pricing {
        private int basePrice;
        private int discountPrice;
        private boolean isDiscounted;

        public boolean isDiscounted() {
            return isDiscounted;
        }

        public void setDiscounted(boolean isDiscounted) {
            this.isDiscounted = isDiscounted;
        }
    }

    @Data
    public static class NutritionInfo {
        private int calories;
        private int protein;
        private int carbs;
        private int fat;
        private List<String> ingredients;
        private List<String> allergens;
    }

    @Data
    public static class Option {
        private String name;
        private String type; // single, multiple
        private boolean isRequired;
        private List<Choice> choices;

        public void setRequired(boolean isRequired) {
            this.isRequired = isRequired;
        }

        public boolean isRequired() {
            return isRequired;
        }
    }

    @Data
    public static class Choice {
        private String name;
        private int price;

        private boolean isDefault;

        public boolean isDefault() {
            return isDefault;
        }

        public void setDefault(boolean isDefault) {
            this.isDefault = isDefault;
        }
    }

    @Data
    public static class TimeRange {
        private String start;
        private String end;
    }

    @Data
    public static class Availability {
        private boolean isAvailable;
        private List<TimeRange> availableTimes;
        private Integer stockQuantity;
        private boolean soldOut;

        public boolean isAvailable() {
            return isAvailable;
        }

        public void setAvailable(boolean isAvailable) {
            this.isAvailable = isAvailable;
        }
    }

    @Data
    public static class RatingInfo {
        private double averageRating;
        private int totalReviews;
    }

    @Data
    public static class StatInfo {
        private int totalOrders;
        private int viewCount;
    }
}
