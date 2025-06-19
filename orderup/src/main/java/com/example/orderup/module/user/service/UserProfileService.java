package com.example.orderup.module.user.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.orderup.module.user.repository.UserProfileRepository;
import com.example.orderup.module.restaurant.entity.Restaurant;
import com.example.orderup.repositories.RestaurantRepository;
import com.example.orderup.module.user.dto.UserProfileDTO;
import com.example.orderup.module.user.entirty.Profile;
import com.example.orderup.module.user.entirty.User;
import com.example.orderup.module.user.entirty.Addresses;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserProfileService {
    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    public UserProfileDTO getUserProfile(String userId) {
        User user = userProfileRepository.findByUserId(userId);
        if (user == null) {
            return null;
        }

        // Build basic profile info
        UserProfileDTO.UserProfileInfo profileInfo = null;
        if (user.getProfile() != null) {
            profileInfo = UserProfileDTO.UserProfileInfo.builder()
                .firstName(user.getProfile().getFirstName())
                .lastName(user.getProfile().getLastName())
                .fullName(user.getProfile().getName())
                .phone(user.getProfile().getPhone())
                .avatar(user.getProfile().getAvatar())
                .gender(user.getProfile().getGender())
                .dateOfBirth(user.getProfile().getDateOfBirth() != null ? 
                    user.getProfile().getDateOfBirth().toString() : null)
                .build();
        }

        // Build addresses info
        List<UserProfileDTO.AddressInfo> addressesInfo = new ArrayList<>();
        if (user.getAddresses() != null) {
            addressesInfo = user.getAddresses().stream()
                .map(this::convertToAddressInfo)
                .collect(Collectors.toList());
        }

        // Build restaurant info if user is restaurant host
        UserProfileDTO.RestaurantInfo restaurantInfo = null;
        if ("RESTAURANTHOST".equalsIgnoreCase(user.getRole())) {
            Restaurant restaurant = restaurantRepository.findByHostId(userId).orElse(null);
            if (restaurant != null) {
                List<UserProfileDTO.AddressInfo> restaurantAddresses = new ArrayList<>();
                if (restaurant.getAddress() != null) {
                    restaurantAddresses.add(convertRestaurantAddressToAddressInfo(restaurant.getAddress()));
                }

                restaurantInfo = UserProfileDTO.RestaurantInfo.builder()
                    .id(restaurant.getId())
                    .name(restaurant.getBasicInfo().getName())
                    .description(restaurant.getBasicInfo().getDescription())
                    .phone(restaurant.getBasicInfo().getPhone())
                    .email(restaurant.getBasicInfo().getEmail())
                    .website(restaurant.getBasicInfo().getWebsite())
                    .logo(restaurant.getBasicInfo().getLogo())
                    .coverImage(restaurant.getBasicInfo().getCoverImage())
                    .priceRange(restaurant.getBasicInfo().getPriceRange())
                    .address(restaurantAddresses)
                    .cuisineTypes(restaurant.getBusinessInfo() != null ? 
                        restaurant.getBusinessInfo().getCuisineTypes() : null)
                    .isActive(restaurant.isActive())
                    .isVerified(restaurant.isVerified())
                    .isFeatured(restaurant.isFeatured())
                    .verificationStatus(restaurant.getVerificationStatus())
                    .build();
            }
        }

        // Build final DTO
        return UserProfileDTO.builder()
            .id(user.getId())
            .email(user.getEmail())
            .role(user.getRole())
            .profile(profileInfo)
            .addresses(addressesInfo)
            .restaurantInfo(restaurantInfo)
            .build();
    }

    public UserProfileDTO updateUserProfile(String userId, Profile newProfile) {
        User user = userProfileRepository.findByUserId(userId);
        if (user == null) {
            return null;
        }

        // Ensure fullName is properly set
        if (newProfile != null) {
            newProfile.setFirstName(newProfile.getFirstName());
            newProfile.setLastName(newProfile.getLastName());
        }

        Profile updatedProfile = userProfileRepository.updateUserProfileById(userId, newProfile);
        if (updatedProfile == null) {
            return null;
        }

        // Return updated profile
        return getUserProfile(userId);
    }

    private UserProfileDTO.AddressInfo convertToAddressInfo(Addresses address) {
        return UserProfileDTO.AddressInfo.builder()
            .title(address.getTitle())
            .fullAddress(address.getFullAddress())
            .isDefault(address.isDefault())
            .coordinates(address.getCoordinates() != null ? 
                UserProfileDTO.GeoCoordinates.builder()
                    .lat(address.getCoordinates().getLat())
                    .lng(address.getCoordinates().getLng())
                    .build() : null)
            .build();
    }

    private UserProfileDTO.AddressInfo convertRestaurantAddressToAddressInfo(Restaurant.Address address) {
        return UserProfileDTO.AddressInfo.builder()
            .title("Restaurant Address")
            .fullAddress(address.getFullAddress())
            .isDefault(true)
            .coordinates(address.getCoordinates() != null ? 
                UserProfileDTO.GeoCoordinates.builder()
                    .lat(address.getCoordinates().getLat())
                    .lng(address.getCoordinates().getLng())
                    .build() : null)
            .build();
    }
}
