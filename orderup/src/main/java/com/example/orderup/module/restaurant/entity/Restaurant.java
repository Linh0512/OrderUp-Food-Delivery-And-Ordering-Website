package com.example.orderup.module.restaurant.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Date;
import lombok.Data;

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
        // FIX: Đổi tên để khớp với HTML form
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

        // FIX: Giữ lại cả hai method để tương thích
        public boolean isDeliveryAvailable() {
            return deliveryAvailable;
        }
        
        public void setDeliveryAvailable(boolean deliveryAvailable) {
            this.deliveryAvailable = deliveryAvailable;
        }
        
        // Backward compatibility
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

        public BankInfo() {
            this.bankName = "";
            this.accountNumber = "";
            this.accountHolder = "";
        }
    }

    @Data
    public static class HostInfo {
        private String firstName;
        private String lastName;
        private String phone;
        private String email;
        private Date dateOfBirth;
        private String gender;
        private String avatar;

        public String getFullName() {
            return (firstName != null ? firstName : "") + " " + (lastName != null ? lastName : "").trim();
        }
    }

    // Constructor cho class chính
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
        this.active = true;
        this.verified = false;
        this.featured = false;
        this.verificationStatus = "pending";
        
        // FIX: Khởi tạo operating hours cho 7 ngày với đúng thứ tự
        // 0 = Thứ Hai, 1 = Thứ Ba, ..., 6 = Chủ Nhật
        for (int i = 0; i < 7; i++) {
            OperatingHour hour = new OperatingHour(i);
            this.operatingHours.add(hour);
        }
    }
    
    // FIX: Method để đảm bảo operatingHours luôn có đủ 7 phần tử
    public void ensureOperatingHours() {
        if (this.operatingHours == null) {
            this.operatingHours = new ArrayList<>();
        }
        
        // Đảm bảo có đủ 7 ngày
        while (this.operatingHours.size() < 7) {
            OperatingHour hour = new OperatingHour(this.operatingHours.size());
            this.operatingHours.add(hour);
        }
        
        // Đảm bảo dayOfWeek được set đúng
        for (int i = 0; i < this.operatingHours.size() && i < 7; i++) {
            if (this.operatingHours.get(i) != null) {
                this.operatingHours.get(i).setDayOfWeek(i);
            }
        }
    }
}