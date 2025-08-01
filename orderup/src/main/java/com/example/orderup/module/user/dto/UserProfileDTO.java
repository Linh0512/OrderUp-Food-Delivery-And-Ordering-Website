package com.example.orderup.module.user.dto;

import java.util.List;
import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDTO {
    private String id;
    private String email;
    private String role;
    private UserProfileInfo profile;
    private List<AddressInfo> addresses;
    private RestaurantInfo restaurantInfo;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserProfileInfo {
        private String firstName;
        private String lastName;
        private String fullName;
        private String phone;
        private String avatar;
        private String gender;
        private String dateOfBirth;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AddressInfo {
        private String title;
        private String fullAddress;
        private boolean isDefault;
        private GeoCoordinates coordinates;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GeoCoordinates {
        private double lat;
        private double lng;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RestaurantInfo {
        private String id;
        private String name;
        private String description;
        private String phone;
        private String email;
        private String website;
        private String logo;
        private String coverImage;
        private String priceRange;
        private List<AddressInfo> address;
        private List<String> cuisineTypes;
        private boolean isActive;
        private boolean isVerified;
        private boolean isFeatured;
        private String verificationStatus;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateProfileRequest {
        private UserProfileInfo profile;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AddAddressRequest {
        private String title;
        private String fullAddress;
        private boolean isDefault;
        private GeoCoordinates coordinates;
    }
}
