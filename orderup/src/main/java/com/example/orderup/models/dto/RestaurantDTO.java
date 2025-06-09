package com.example.orderup.models.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import com.example.orderup.models.entities.Res.Restaurant;

public class RestaurantDTO {
    private String id;
    private String hostId;
    private BasicInfoDTO basicInfo;
    private AddressDTO address;
    private BusinessInfoDTO businessInfo;
    private List<OperatingHourDTO> operatingHours;
    private DeliveryInfoDTO delivery;
    private RatingInfoDTO ratings;
    private List<String> tags;
    private boolean isActive;
    private boolean isVerified;
    private boolean isFeatured;
    private String verificationStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Nested DTO classes
    public static class BasicInfoDTO {
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

    public static class AddressDTO {
        private String fullAddress;
        private String district;
        private String city;
        private GeoCoordinatesDTO coordinates;

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

        public GeoCoordinatesDTO getCoordinates() {
            return coordinates;
        }

        public void setCoordinates(GeoCoordinatesDTO coordinates) {
            this.coordinates = coordinates;
        }
    }

    public static class GeoCoordinatesDTO {
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

    public static class BusinessInfoDTO {
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

    public static class OperatingHourDTO {
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

    public static class DeliveryInfoDTO {
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

    public static class RatingInfoDTO {
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

    public BasicInfoDTO getBasicInfo() {
        return basicInfo;
    }

    public void setBasicInfo(BasicInfoDTO basicInfo) {
        this.basicInfo = basicInfo;
    }

    public AddressDTO getAddress() {
        return address;
    }

    public void setAddress(AddressDTO address) {
        this.address = address;
    }

    public BusinessInfoDTO getBusinessInfo() {
        return businessInfo;
    }

    public void setBusinessInfo(BusinessInfoDTO businessInfo) {
        this.businessInfo = businessInfo;
    }

    public List<OperatingHourDTO> getOperatingHours() {
        return operatingHours;
    }

    public void setOperatingHours(List<OperatingHourDTO> operatingHours) {
        this.operatingHours = operatingHours;
    }

    public DeliveryInfoDTO getDelivery() {
        return delivery;
    }

    public void setDelivery(DeliveryInfoDTO delivery) {
        this.delivery = delivery;
    }

    public RatingInfoDTO getRatings() {
        return ratings;
    }

    public void setRatings(RatingInfoDTO ratings) {
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

    // Conversion methods
    public static RestaurantDTO fromEntity(Restaurant restaurant) {
        RestaurantDTO dto = new RestaurantDTO();
        dto.setId(restaurant.getId());
        dto.setHostId(restaurant.getHostId());
        
        // Convert BasicInfo
        if (restaurant.getBasicInfo() != null) {
            BasicInfoDTO basicInfoDTO = new BasicInfoDTO();
            basicInfoDTO.setName(restaurant.getBasicInfo().getName());
            basicInfoDTO.setDescription(restaurant.getBasicInfo().getDescription());
            basicInfoDTO.setPhone(restaurant.getBasicInfo().getPhone());
            basicInfoDTO.setEmail(restaurant.getBasicInfo().getEmail());
            basicInfoDTO.setWebsite(restaurant.getBasicInfo().getWebsite());
            basicInfoDTO.setImages(restaurant.getBasicInfo().getImages());
            basicInfoDTO.setLogo(restaurant.getBasicInfo().getLogo());
            basicInfoDTO.setCoverImage(restaurant.getBasicInfo().getCoverImage());
            dto.setBasicInfo(basicInfoDTO);
        }
        
        // Convert Address
        if (restaurant.getAddress() != null) {
            AddressDTO addressDTO = new AddressDTO();
            addressDTO.setFullAddress(restaurant.getAddress().getFullAddress());
            addressDTO.setDistrict(restaurant.getAddress().getDistrict());
            addressDTO.setCity(restaurant.getAddress().getCity());
            
            if (restaurant.getAddress().getCoordinates() != null) {
                GeoCoordinatesDTO coordsDTO = new GeoCoordinatesDTO();
                coordsDTO.setLat(restaurant.getAddress().getCoordinates().getLat());
                coordsDTO.setLng(restaurant.getAddress().getCoordinates().getLng());
                addressDTO.setCoordinates(coordsDTO);
            }
            
            dto.setAddress(addressDTO);
        }
        
        // Set other fields
        dto.setTags(restaurant.getTags());
        dto.setActive(restaurant.isActive());
        dto.setVerified(restaurant.isVerified());
        dto.setFeatured(restaurant.isFeatured());
        dto.setVerificationStatus(restaurant.getVerificationStatus());
        dto.setCreatedAt(restaurant.getCreatedAt());
        dto.setUpdatedAt(restaurant.getUpdatedAt());
        
        // TODO: Convert remaining nested objects (businessInfo, operatingHours, delivery, ratings)
        
        return dto;
    }
}
