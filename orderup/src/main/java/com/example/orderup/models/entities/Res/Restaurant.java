package com.example.orderup.models.entities.Res;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

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
    private boolean isActive;
    private boolean isVerified;
    private boolean isFeatured;
    private String verificationStatus;
    private BankInfo bankInfo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Nested classes
    public static class BasicInfo {
        private String name;
        private String description;
        private String phone;
        private String email;
        private String website;
        private List<String> images;
        private String logo;
        private String coverImage;

        // Getters and Setters
        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getWebsite() {
            return website;
        }

        public void setWebsite(String website) {
            this.website = website;
        }

        public List<String> getImages() {
            return images;
        }

        public void setImages(List<String> images) {
            this.images = images;
        }

        public String getLogo() {
            return logo;
        }

        public void setLogo(String logo) {
            this.logo = logo;
        }

        public String getCoverImage() {
            return coverImage;
        }

        public void setCoverImage(String coverImage) {
            this.coverImage = coverImage;
        }
    }

    public static class Address {
        private String fullAddress;
        private String district;
        private String city;
        private GeoCoordinates coordinates;

        public String getFullAddress() {
            return fullAddress;
        }

        public void setFullAddress(String fullAddress) {
            this.fullAddress = fullAddress;
        }

        public String getDistrict() {
            return district;
        }

        public void setDistrict(String district) {
            this.district = district;
        }

        public String getCity() {
            return city;
        }

        public void setCity(String city) {
            this.city = city;
        }

        public GeoCoordinates getCoordinates() {
            return coordinates;
        }

        public void setCoordinates(GeoCoordinates coordinates) {
            this.coordinates = coordinates;
        }
    }

    public static class GeoCoordinates {
        private double lat;
        private double lng;

        public double getLat() {
            return lat;
        }

        public void setLat(double lat) {
            this.lat = lat;
        }

        public double getLng() {
            return lng;
        }

        public void setLng(double lng) {
            this.lng = lng;
        }
    }

    public static class BusinessInfo {
        private String businessLicense;
        private String taxCode;
        private String businessType;
        private List<String> cuisineTypes;

        public String getBusinessLicense() {
            return businessLicense;
        }

        public void setBusinessLicense(String businessLicense) {
            this.businessLicense = businessLicense;
        }

        public String getTaxCode() {
            return taxCode;
        }

        public void setTaxCode(String taxCode) {
            this.taxCode = taxCode;
        }

        public String getBusinessType() {
            return businessType;
        }

        public void setBusinessType(String businessType) {
            this.businessType = businessType;
        }

        public List<String> getCuisineTypes() {
            return cuisineTypes;
        }

        public void setCuisineTypes(List<String> cuisineTypes) {
            this.cuisineTypes = cuisineTypes;
        }
    }

    public static class OperatingHour {
        private int dayOfWeek;
        private boolean isOpen;
        private String openTime;
        private String closeTime;

        public int getDayOfWeek() {
            return dayOfWeek;
        }

        public void setDayOfWeek(int dayOfWeek) {
            this.dayOfWeek = dayOfWeek;
        }

        public boolean isOpen() {
            return isOpen;
        }

        public void setOpen(boolean open) {
            isOpen = open;
        }

        public String getOpenTime() {
            return openTime;
        }

        public void setOpenTime(String openTime) {
            this.openTime = openTime;
        }

        public String getCloseTime() {
            return closeTime;
        }

        public void setCloseTime(String closeTime) {
            this.closeTime = closeTime;
        }
    }

    public static class DeliveryInfo {
        private boolean isDeliveryAvailable;
        private int deliveryRadius;
        private double deliveryFee;
        private double freeDeliveryThreshold;
        private int estimatedDeliveryTime;
        private List<String> deliveryAreas;

        public boolean isDeliveryAvailable() {
            return isDeliveryAvailable;
        }

        public void setDeliveryAvailable(boolean deliveryAvailable) {
            isDeliveryAvailable = deliveryAvailable;
        }

        public int getDeliveryRadius() {
            return deliveryRadius;
        }

        public void setDeliveryRadius(int deliveryRadius) {
            this.deliveryRadius = deliveryRadius;
        }

        public double getDeliveryFee() {
            return deliveryFee;
        }

        public void setDeliveryFee(double deliveryFee) {
            this.deliveryFee = deliveryFee;
        }

        public double getFreeDeliveryThreshold() {
            return freeDeliveryThreshold;
        }

        public void setFreeDeliveryThreshold(double freeDeliveryThreshold) {
            this.freeDeliveryThreshold = freeDeliveryThreshold;
        }

        public int getEstimatedDeliveryTime() {
            return estimatedDeliveryTime;
        }

        public void setEstimatedDeliveryTime(int estimatedDeliveryTime) {
            this.estimatedDeliveryTime = estimatedDeliveryTime;
        }

        public List<String> getDeliveryAreas() {
            return deliveryAreas;
        }

        public void setDeliveryAreas(List<String> deliveryAreas) {
            this.deliveryAreas = deliveryAreas;
        }
    }

    public static class RatingInfo {
        private double averageRating;
        private int totalReviews;
        private Map<String, Integer> ratingBreakdown;

        public double getAverageRating() {
            return averageRating;
        }

        public void setAverageRating(double averageRating) {
            this.averageRating = averageRating;
        }

        public int getTotalReviews() {
            return totalReviews;
        }

        public void setTotalReviews(int totalReviews) {
            this.totalReviews = totalReviews;
        }

        public Map<String, Integer> getRatingBreakdown() {
            return ratingBreakdown;
        }

        public void setRatingBreakdown(Map<String, Integer> ratingBreakdown) {
            this.ratingBreakdown = ratingBreakdown;
        }
    }

    public static class BankInfo {
        private String bankName;
        private String accountNumber;
        private String accountHolder;

        public String getBankName() {
            return bankName;
        }

        public void setBankName(String bankName) {
            this.bankName = bankName;
        }

        public String getAccountNumber() {
            return accountNumber;
        }

        public void setAccountNumber(String accountNumber) {
            this.accountNumber = accountNumber;
        }

        public String getAccountHolder() {
            return accountHolder;
        }

        public void setAccountHolder(String accountHolder) {
            this.accountHolder = accountHolder;
        }
    }

    // Getters and Setters for the main class
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getHostId() {
        return hostId;
    }

    public void setHostId(String hostId) {
        this.hostId = hostId;
    }

    public BasicInfo getBasicInfo() {
        return basicInfo;
    }

    public void setBasicInfo(BasicInfo basicInfo) {
        this.basicInfo = basicInfo;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public BusinessInfo getBusinessInfo() {
        return businessInfo;
    }

    public void setBusinessInfo(BusinessInfo businessInfo) {
        this.businessInfo = businessInfo;
    }

    public List<OperatingHour> getOperatingHours() {
        return operatingHours;
    }

    public void setOperatingHours(List<OperatingHour> operatingHours) {
        this.operatingHours = operatingHours;
    }

    public DeliveryInfo getDelivery() {
        return delivery;
    }

    public void setDelivery(DeliveryInfo delivery) {
        this.delivery = delivery;
    }

    public RatingInfo getRatings() {
        return ratings;
    }

    public void setRatings(RatingInfo ratings) {
        this.ratings = ratings;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public boolean isVerified() {
        return isVerified;
    }

    public void setVerified(boolean verified) {
        isVerified = verified;
    }

    public boolean isFeatured() {
        return isFeatured;
    }

    public void setFeatured(boolean featured) {
        isFeatured = featured;
    }

    public String getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(String verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

    public BankInfo getBankInfo() {
        return bankInfo;
    }

    public void setBankInfo(BankInfo bankInfo) {
        this.bankInfo = bankInfo;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
