package com.example.orderup.module.restaurant.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import lombok.Data;

@Data
@Document(collection = "restaurants")
public class Restaurant {
    @Id
    private String id;
    
    private String hostId;
    private BasicInfo basicInfo;
    private Address address;
    private BusinessInfo businessInfo;
    private List<OperatingHour> operatingHours;
    private DeliveryInfo delivery;
    private RatingInfo ratings;
    private List<String> tags;

    @Field("isActive")
    private boolean active;

    @Field("isVerified")
    private boolean verified;

    @Field("isFeatured")
    private boolean featured;
    
    private String verificationStatus;
    private BankInfo bankInfo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean isActive) {
        this.active = isActive;
    }

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(boolean isVerified) {
        this.verified = isVerified;
    }

    public boolean isFeatured() {
        return featured;
    }

    public void setFeatured(boolean isFeatured) {
        this.featured = isFeatured;
    }

    // Nested classes
    @Data
    public static class BasicInfo {
        private String name;
        private String description;
        private String phone;
        private String email;
        private String website;
        private List<String> images;
        private String logo;
        private String coverImage;
    }

    @Data
    public static class Address {
        private String fullAddress;
        private String district;
        private String city;
        private GeoCoordinates coordinates;
    }

    @Data
    public static class GeoCoordinates {
        private double lat;
        private double lng;
    }

    @Data
    public static class BusinessInfo {
        private String businessLicense;
        private String taxCode;
        private String businessType;
        private List<String> cuisineTypes;
    }

    @Data
    public static class OperatingHour {
        private int dayOfWeek;
        private boolean isOpen;
        private String openTime;
        private String closeTime;
    }

    @Data
    public static class DeliveryInfo {
        private boolean isDeliveryAvailable;
        private int deliveryRadius;
        private double deliveryFee;
        private double freeDeliveryThreshold;
        private int estimatedDeliveryTime;
        private List<String> deliveryAreas;
    }

    @Data
    public static class RatingInfo {
        private double averageRating;
        private int totalReviews;
        private Map<String, Integer> ratingBreakdown;
    }

    @Data
    public static class BankInfo {
        private String bankName;
        private String accountNumber;
        private String accountHolder;
    }
}
