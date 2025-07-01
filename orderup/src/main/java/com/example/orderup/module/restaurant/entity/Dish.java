package com.example.orderup.module.restaurant.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;
import java.util.List;
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
    private Date createdAt;
    private Date updatedAt;


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
        private String preparationTime; // e.g., "15-20 phút"
    }

    @Data
    public static class Pricing {
        private int basePrice;
        private int discountPrice;
        private boolean isDiscounted;
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

    // Business methods
    public void activate() {
        this.isActive = true;
        this.updatedAt = new Date();
    }
    
    public void deactivate() {
        this.isActive = false;
        this.updatedAt = new Date();
    }
    
    public double getFinalPrice() {
        if (pricing != null && pricing.isDiscounted && pricing.discountPrice > 0) {
            return pricing.discountPrice;
        }
        return pricing != null ? pricing.basePrice : 0;
    }
    
    public boolean hasValidDiscount() {
        return pricing != null && pricing.isDiscounted && 
               pricing.discountPrice > 0 && pricing.discountPrice < pricing.basePrice;
    }
    
    // Additional business logic
    public void updateBasicInfo(String name, String description, List<String> images) {
        if (this.basicInfo == null) {
            this.basicInfo = new BasicInfo();
        }
        
        if (name != null && !name.trim().isEmpty()) {
            this.basicInfo.name = name;
        }
        
        if (description != null) {
            this.basicInfo.description = description;
        }
        
        if (images != null && !images.isEmpty()) {
            this.basicInfo.images = images;
        }
        
        this.updatedAt = new Date();
    }
    
    public void updatePricing(int basePrice, Integer discountPrice) {
        if (this.pricing == null) {
            this.pricing = new Pricing();
        }
        
        this.pricing.basePrice = basePrice;
        
        if (discountPrice != null && discountPrice > 0 && discountPrice < basePrice) {
            this.pricing.discountPrice = discountPrice;
            this.pricing.isDiscounted = true;
        } else {
            this.pricing.discountPrice = 0;
            this.pricing.isDiscounted = false;
        }
        
        this.updatedAt = new Date();
    }
    
    // Stock management (if needed)
    @Data
    public static class StockInfo {
        private Integer stockQuantity;
        private boolean trackStock;
        private Integer lowStockThreshold;
    }
    
    private StockInfo stockInfo;
    
    public boolean isInStock() {
        if (stockInfo == null || !stockInfo.trackStock) {
            return true; // Unlimited stock
        }
        return stockInfo.stockQuantity != null && stockInfo.stockQuantity > 0;
    }
    
    public boolean isLowStock() {
        if (stockInfo == null || !stockInfo.trackStock || stockInfo.lowStockThreshold == null) {
            return false;
        }
        return stockInfo.stockQuantity != null && 
               stockInfo.stockQuantity <= stockInfo.lowStockThreshold;
    }
}
