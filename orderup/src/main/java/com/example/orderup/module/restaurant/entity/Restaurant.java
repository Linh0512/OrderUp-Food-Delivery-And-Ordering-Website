package com.example.orderup.module.restaurant.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.HashMap;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@Document(collection = "restaurants")
public class Restaurant {
    @Id
    private String id;
    
    private String hostId;
    private HostInfo hostInfo;
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
        private String priceRange;

        public BasicInfo() {
            this.images = new ArrayList<>();
        }
    }

    @Data
    public static class Address {
        private String fullAddress;
        private String district;
        private String city;
        private GeoCoordinates coordinates;

        public Address() {
            this.coordinates = new GeoCoordinates();
        }
    }

    @Data
    public static class GeoCoordinates {
        private double lat;
        private double lng;

        public GeoCoordinates() {
            this.lat = 0.0;
            this.lng = 0.0;
        }
    }

    @Data
    public static class BusinessInfo {
        private String businessLicense;
        private String taxCode;
        private String businessType;
        private List<String> cuisineTypes;

        public BusinessInfo() {
            this.cuisineTypes = new ArrayList<>();
        }
    }

    @Data
    public static class OperatingHour {
        private int dayOfWeek;

        @Field("isOpen")
        @JsonProperty("isOpen")
        private boolean open;
        
        private String openTime;
        private String closeTime;

        public OperatingHour() {
            this.open = true;
        }

        public OperatingHour(int dayOfWeek) {
            this.dayOfWeek = dayOfWeek;
            this.open = true;
        }

        public boolean isOpen() {
            return open;
        }

        public void setOpen(boolean open) {
            this.open = open;
        }
    }

    @Data
    public static class DeliveryInfo {
        private boolean deliveryAvailable;
        private int deliveryRadius;
        private double deliveryFee;
        private double freeDeliveryThreshold;
        private int estimatedDeliveryTime;
        private List<String> deliveryAreas;

        public DeliveryInfo() {
            this.deliveryAvailable = false;
            this.deliveryRadius = 5;
            this.deliveryFee = 0.0;
            this.freeDeliveryThreshold = 0.0;
            this.estimatedDeliveryTime = 30;
            this.deliveryAreas = new ArrayList<>();
        }

        public boolean isDeliveryAvailable() {
            return deliveryAvailable;
        }
        
        public void setDeliveryAvailable(boolean deliveryAvailable) {
            this.deliveryAvailable = deliveryAvailable;
        }
        
        public boolean getDeliveryAvailable() {
            return deliveryAvailable;
        }
    }

    @Data
    public static class RatingInfo {
        private double averageRating;
        private int totalReviews;
        private Map<String, Integer> ratingBreakdown;

        public RatingInfo() {
            this.averageRating = 0.0;
            this.totalReviews = 0;
            this.ratingBreakdown = new HashMap<>();
        }
    }

    @Data
    public static class BankInfo {
        private String bankName;
        private String accountNumber;
        private String accountHolder;
    }

    @Data
    public static class HostInfo {
        private String firstName;
        private String lastName;
        private String phone;
        private String email;
        private LocalDateTime dateOfBirth;
        private String gender;
        private String avatar;

        public String getFullName() {
            return firstName + " " + lastName;
        }
    }

    public Restaurant() {
        this.basicInfo = new BasicInfo();
        this.address = new Address();
        this.businessInfo = new BusinessInfo();
        this.operatingHours = new ArrayList<>();
        this.delivery = new DeliveryInfo();
        this.ratings = new RatingInfo();
        this.tags = new ArrayList<>();
        this.bankInfo = new BankInfo();
        this.hostInfo = new HostInfo();
        
        // Initialize operating hours for all days of the week
        ensureOperatingHours();
    }

    public void ensureOperatingHours() {
        if (this.operatingHours == null) {
            this.operatingHours = new ArrayList<>();
        }
        
        // Ensure we have entries for all 7 days of the week
        for (int i = 1; i <= 7; i++) {
            boolean found = false;
            for (OperatingHour hour : this.operatingHours) {
                if (hour.getDayOfWeek() == i) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                this.operatingHours.add(new OperatingHour(i));
            }
        }
    }
}