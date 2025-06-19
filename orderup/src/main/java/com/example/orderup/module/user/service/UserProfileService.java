package com.example.orderup.module.user.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.orderup.module.user.repository.UserProfileRepository;
import com.example.orderup.module.restaurant.entity.Restaurant;
import com.example.orderup.repositories.RestaurantRepository;
import com.example.orderup.module.user.dto.UserProfileDTO;
import com.example.orderup.module.user.dto.UserProfileDTO.*;
import com.example.orderup.module.user.entirty.Profile;
import com.example.orderup.module.user.entirty.User;
import com.example.orderup.module.user.entirty.Addresses;
import com.example.orderup.module.user.entirty.Coordinates;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Date;

@Service
public class UserProfileService {
    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    private SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

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
                    dateFormat.format(user.getProfile().getDateOfBirth()) : null)
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

    public UserProfileDTO updateUserProfile(String userId, UpdateProfileRequest request) {
        User user = userProfileRepository.findByUserId(userId);
        if (user == null || request.getProfile() == null) {
            return null;
        }

        Profile newProfile = new Profile();
        UserProfileInfo profileInfo = request.getProfile();
        
        newProfile.setFirstName(profileInfo.getFirstName());
        newProfile.setLastName(profileInfo.getLastName());
        newProfile.setPhone(profileInfo.getPhone());
        newProfile.setAvatar(profileInfo.getAvatar());
        newProfile.setGender(profileInfo.getGender());
        
        try {
            if (profileInfo.getDateOfBirth() != null) {
                newProfile.setDateOfBirth(dateFormat.parse(profileInfo.getDateOfBirth()));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        Profile updatedProfile = userProfileRepository.updateUserProfileById(userId, newProfile);
        if (updatedProfile == null) {
            return null;
        }

        return getUserProfile(userId);
    }

    public List<UserProfileDTO.AddressInfo> getUserAddresses(String userId) {
        User user = userProfileRepository.findByUserId(userId);
        if (user == null || user.getAddresses() == null) {
            return new ArrayList<>();
        }

        return user.getAddresses().stream()
            .map(this::convertToAddressInfo)
            .collect(Collectors.toList());
    }

    
    public UserProfileDTO addUserAddress(String userId, AddAddressRequest request) {
        User user = userProfileRepository.findByUserId(userId);
        if (user == null) {
            return null;
        }

        // Tạo địa chỉ mới
        Addresses newAddress = new Addresses();
        newAddress.setTitle(request.getTitle());
        newAddress.setFullAddress(request.getFullAddress());
        newAddress.setDefault(request.isDefault());

        if (request.getCoordinates() != null) {
            Coordinates coordinates = new Coordinates();
            coordinates.setLat(request.getCoordinates().getLat());
            coordinates.setLng(request.getCoordinates().getLng());
            newAddress.setCoordinates(coordinates);
        }

        // Thêm vào danh sách địa chỉ
        List<Addresses> addresses = user.getAddresses();
        if (addresses == null) {
            addresses = new ArrayList<>();
        }

        // Nếu địa chỉ mới là mặc định, cập nhật các địa chỉ khác
        if (newAddress.isDefault()) {
            addresses.forEach(addr -> addr.setDefault(false));
        }
        addresses.add(newAddress);
        user.setAddresses(addresses);

        // Lưu user
        userProfileRepository.updateUser(user);

        return getUserProfile(userId);
    }

    public UserProfileDTO updateUserAddress(String userId, int addressIndex, AddAddressRequest request) {
        User user = userProfileRepository.findByUserId(userId);
        if (user == null || user.getAddresses() == null || addressIndex >= user.getAddresses().size()) {
            return null;
        }

        List<Addresses> addresses = user.getAddresses();
        
        // Cập nhật địa chỉ
        Addresses addressToUpdate = addresses.get(addressIndex);
        addressToUpdate.setTitle(request.getTitle());
        addressToUpdate.setFullAddress(request.getFullAddress());
        
        // Xử lý trường hợp đổi địa chỉ mặc định
        if (request.isDefault() && !addressToUpdate.isDefault()) {
            addresses.forEach(addr -> addr.setDefault(false));
        }
        addressToUpdate.setDefault(request.isDefault());

        if (request.getCoordinates() != null) {
            Coordinates coordinates = new Coordinates();
            coordinates.setLat(request.getCoordinates().getLat());
            coordinates.setLng(request.getCoordinates().getLng());
            addressToUpdate.setCoordinates(coordinates);
        }

        // Lưu user
        userProfileRepository.updateUser(user);

        return getUserProfile(userId);
    }

    public UserProfileDTO deleteUserAddress(String userId, int addressIndex) {
        User user = userProfileRepository.findByUserId(userId);
        if (user == null || user.getAddresses() == null || addressIndex >= user.getAddresses().size()) {
            return null;
        }

        List<Addresses> addresses = user.getAddresses();
        
        // Kiểm tra nếu xóa địa chỉ mặc định
        boolean wasDefault = addresses.get(addressIndex).isDefault();
        addresses.remove(addressIndex);

        // Nếu xóa địa chỉ mặc định và còn địa chỉ khác, set địa chỉ đầu tiên làm mặc định
        if (wasDefault && !addresses.isEmpty()) {
            addresses.get(0).setDefault(true);
        }

        user.setAddresses(addresses);
        userProfileRepository.updateUser(user);

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
