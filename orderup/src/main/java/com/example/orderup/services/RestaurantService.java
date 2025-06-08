package com.example.orderup.services;

import com.example.orderup.models.dto.RestaurantDTO;
import com.example.orderup.models.entities.Res.Restaurant;
import com.example.orderup.repositories.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RestaurantService {
    
    @Autowired
    private RestaurantRepository restaurantRepository;
    
    /**
     * Get all restaurants with pagination
     */
    public Page<RestaurantDTO> getAllRestaurants(int page, int size) {
        Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        Page<Restaurant> restaurantPage = restaurantRepository.findByIsActiveTrue(pageable);
        
        List<RestaurantDTO> restaurantDTOs = restaurantPage.getContent().stream()
                .map(RestaurantDTO::fromEntity)
                .collect(Collectors.toList());
        
        return new PageImpl<>(restaurantDTOs, pageable, restaurantPage.getTotalElements());
    }
    
    /**
     * Get restaurant by ID
     */
    public RestaurantDTO getRestaurantById(String id) {
        return restaurantRepository.findById(id)
                .map(RestaurantDTO::fromEntity)
                .orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + id));
    }
    
    /**
     * Create a new restaurant
     */
    public RestaurantDTO createRestaurant(Restaurant restaurant) {
        restaurant.setCreatedAt(LocalDateTime.now());
        restaurant.setUpdatedAt(LocalDateTime.now());
        restaurant.setVerificationStatus("pending");
        restaurant.setActive(true);
        
        Restaurant savedRestaurant = restaurantRepository.save(restaurant);
        return RestaurantDTO.fromEntity(savedRestaurant);
    }
    
    /**
     * Update an existing restaurant
     */
    public RestaurantDTO updateRestaurant(String id, Restaurant restaurantDetails) {
        return restaurantRepository.findById(id)
                .map(restaurant -> {
                    // Update fields from restaurantDetails to restaurant
                    if (restaurantDetails.getBasicInfo() != null) {
                        restaurant.setBasicInfo(restaurantDetails.getBasicInfo());
                    }
                    if (restaurantDetails.getAddress() != null) {
                        restaurant.setAddress(restaurantDetails.getAddress());
                    }
                    if (restaurantDetails.getBusinessInfo() != null) {
                        restaurant.setBusinessInfo(restaurantDetails.getBusinessInfo());
                    }
                    if (restaurantDetails.getOperatingHours() != null) {
                        restaurant.setOperatingHours(restaurantDetails.getOperatingHours());
                    }
                    if (restaurantDetails.getDelivery() != null) {
                        restaurant.setDelivery(restaurantDetails.getDelivery());
                    }
                    if (restaurantDetails.getTags() != null) {
                        restaurant.setTags(restaurantDetails.getTags());
                    }
                    
                    restaurant.setUpdatedAt(LocalDateTime.now());
                    
                    return RestaurantDTO.fromEntity(restaurantRepository.save(restaurant));
                })
                .orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + id));
    }
    
    /**
     * Delete a restaurant
     */
    public void deleteRestaurant(String id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + id));
        
        restaurantRepository.delete(restaurant);
    }
    
    /**
     * Update restaurant status (active/inactive)
     */
    public RestaurantDTO updateRestaurantStatus(String id, boolean isActive) {
        return restaurantRepository.findById(id)
                .map(restaurant -> {
                    restaurant.setActive(isActive);
                    restaurant.setUpdatedAt(LocalDateTime.now());
                    return RestaurantDTO.fromEntity(restaurantRepository.save(restaurant));
                })
                .orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + id));
    }
    
    /**
     * Update restaurant verification status
     */
    public RestaurantDTO updateVerificationStatus(String id, String status) {
        return restaurantRepository.findById(id)
                .map(restaurant -> {
                    restaurant.setVerificationStatus(status);
                    if ("approved".equals(status)) {
                        restaurant.setVerified(true);
                    } else if ("rejected".equals(status)) {
                        restaurant.setVerified(false);
                    }
                    restaurant.setUpdatedAt(LocalDateTime.now());
                    return RestaurantDTO.fromEntity(restaurantRepository.save(restaurant));
                })
                .orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + id));
    }
    
    /**
     * Find restaurants by cuisine type
     */
    public Page<RestaurantDTO> getRestaurantsByCuisineType(String cuisineType, Pageable pageable) {
        Page<Restaurant> restaurantPage = restaurantRepository.findByCuisineType(cuisineType, pageable);
        
        List<RestaurantDTO> restaurantDTOs = restaurantPage.getContent().stream()
                .map(RestaurantDTO::fromEntity)
                .collect(Collectors.toList());
        
        return new PageImpl<>(restaurantDTOs, pageable, restaurantPage.getTotalElements());
    }
    
    /**
     * Find restaurants by location (city)
     */
    public Page<RestaurantDTO> getRestaurantsByCity(String city, Pageable pageable) {
        Page<Restaurant> restaurantPage = restaurantRepository.findByAddressCityAndIsActiveTrue(city, pageable);
        
        List<RestaurantDTO> restaurantDTOs = restaurantPage.getContent().stream()
                .map(RestaurantDTO::fromEntity)
                .collect(Collectors.toList());
        
        return new PageImpl<>(restaurantDTOs, pageable, restaurantPage.getTotalElements());
    }
    
    /**
     * Search restaurants by name
     */
    public Page<RestaurantDTO> searchRestaurantsByName(String name, Pageable pageable) {
        Page<Restaurant> restaurantPage = restaurantRepository.findByNameContainingIgnoreCase(name, pageable);
        
        List<RestaurantDTO> restaurantDTOs = restaurantPage.getContent().stream()
                .map(RestaurantDTO::fromEntity)
                .collect(Collectors.toList());
        
        return new PageImpl<>(restaurantDTOs, pageable, restaurantPage.getTotalElements());
    }
    
    /**
     * Get featured restaurants
     */
    public Page<RestaurantDTO> getFeaturedRestaurants(Pageable pageable) {
        Page<Restaurant> restaurantPage = restaurantRepository.findByIsFeaturedTrueAndIsActiveTrue(pageable);
        
        List<RestaurantDTO> restaurantDTOs = restaurantPage.getContent().stream()
                .map(RestaurantDTO::fromEntity)
                .collect(Collectors.toList());
        
        return new PageImpl<>(restaurantDTOs, pageable, restaurantPage.getTotalElements());
    }
    
    /**
     * Find restaurants by delivery area
     */
    public Page<RestaurantDTO> getRestaurantsByDeliveryArea(String area, Pageable pageable) {
        Page<Restaurant> restaurantPage = restaurantRepository.findByDeliveryArea(area, pageable);
        
        List<RestaurantDTO> restaurantDTOs = restaurantPage.getContent().stream()
                .map(RestaurantDTO::fromEntity)
                .collect(Collectors.toList());
        
        return new PageImpl<>(restaurantDTOs, pageable, restaurantPage.getTotalElements());
    }
    
    /**
     * Find restaurants by minimum rating
     */
    public Page<RestaurantDTO> getRestaurantsByMinimumRating(double minRating, Pageable pageable) {
        Page<Restaurant> restaurantPage = restaurantRepository.findByMinimumRating(minRating, pageable);
        
        List<RestaurantDTO> restaurantDTOs = restaurantPage.getContent().stream()
                .map(RestaurantDTO::fromEntity)
                .collect(Collectors.toList());
        
        return new PageImpl<>(restaurantDTOs, pageable, restaurantPage.getTotalElements());
    }
}
