package com.example.orderup.module.restaurant.service;

import com.example.orderup.module.restaurant.entity.Restaurant;
import com.example.orderup.repositories.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RestaurantService {
    
    @Autowired
    private RestaurantRepository restaurantRepository;
    
    /**
     * Get all restaurants with pagination
     */
    public Page<Restaurant> getAllRestaurants(int page, int size) {
        Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        return restaurantRepository.findByActiveTrue(pageable);
    }
    
    /**
     * Get all restaurants with pagination using Pageable
     */
    public Page<Restaurant> getAllRestaurantsPage(Pageable pageable) {
        return restaurantRepository.findByActiveTrue(pageable);
    }
    
    /**
     * Get restaurant by ID
     */
    public Restaurant getRestaurantById(String id) {
        return restaurantRepository.findById(id)
                .orElse(null);
    }
    
    /**
     * Create a new restaurant
     */
    public Restaurant createRestaurant(Restaurant restaurant) {
        restaurant.setCreatedAt(LocalDateTime.now());
        restaurant.setUpdatedAt(LocalDateTime.now());
        restaurant.setVerificationStatus("pending");
        restaurant.setActive(true);
        
        return restaurantRepository.save(restaurant);
    }
    
    /**
     * Update an existing restaurant
     */
    public Restaurant updateRestaurant(String id, Restaurant restaurantDetails) {
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
                    
                    return restaurantRepository.save(restaurant);
                })
                .orElse(null);
    }
    
    /**
     * Save restaurant (create or update)
     */
    public Restaurant saveRestaurant(Restaurant restaurant) {
        // Đảm bảo đã set ngày cập nhật
        restaurant.setUpdatedAt(LocalDateTime.now());
        
        // Lưu và trả về restaurant đã lưu
        Restaurant saved = restaurantRepository.save(restaurant);
        
        System.out.println("DEBUG - Saved restaurant: ID=" + saved.getId() + ", Name=" + 
                        (saved.getBasicInfo() != null ? saved.getBasicInfo().getName() : "N/A"));
        
        return saved;
    }
    
    /**
     * Delete a restaurant
     */
    public boolean deleteRestaurant(String id) {
        try {
            Restaurant restaurant = getRestaurantById(id);
            if (restaurant == null) {
                return false;
            }
            
            restaurantRepository.delete(restaurant);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * Update restaurant status (active/inactive)
     */
    public Restaurant updateRestaurantStatus(String id, boolean isActive) {
        return restaurantRepository.findById(id)
                .map(restaurant -> {
                    restaurant.setActive(isActive);
                    restaurant.setUpdatedAt(LocalDateTime.now());
                    return restaurantRepository.save(restaurant);
                })
                .orElse(null);
    }
    
    /**
     * Update restaurant verification status
     */
    public Restaurant updateVerificationStatus(String id, String status) {
        return restaurantRepository.findById(id)
                .map(restaurant -> {
                    restaurant.setVerificationStatus(status);
                    if ("approved".equals(status)) {
                        restaurant.setVerified(true);
                    } else if ("rejected".equals(status)) {
                        restaurant.setVerified(false);
                    }
                    restaurant.setUpdatedAt(LocalDateTime.now());
                    return restaurantRepository.save(restaurant);
                })
                .orElse(null);
    }
    
    /**
     * Find restaurants by cuisine type
     */
    public Page<Restaurant> getRestaurantsByCuisineType(String cuisineType, Pageable pageable) {
        return restaurantRepository.findByBusinessInfoCuisineTypesContaining(cuisineType, pageable);
    }
    
    /**
     * Find restaurants by location (city)
     */
    public Page<Restaurant> getRestaurantsByCity(String city, Pageable pageable) {
        return restaurantRepository.findByAddressCityAndActiveTrue(city, pageable);
    }
    
    /**
     * Search restaurants by name
     */
    public List<Restaurant> searchRestaurantsByName(String name) {
        return restaurantRepository.findByBasicInfoNameContainingIgnoreCase(name);
    }
    
    /**
     * Search restaurants by name with pagination
     */
    public Page<Restaurant> searchRestaurantsByName(String name, Pageable pageable) {
        return restaurantRepository.findByBasicInfoNameContainingIgnoreCase(name, pageable);
    }
    
    /**
     * Search restaurants by name with pagination, alternate method name
     */
    public Page<Restaurant> searchRestaurantsByNamePage(String name, Pageable pageable) {
        return searchRestaurantsByName(name, pageable);
    }
    
    /**
     * Get featured restaurants
     */
    public Page<Restaurant> getFeaturedRestaurants(Pageable pageable) {
        return restaurantRepository.findByFeaturedTrueAndActiveTrue(pageable);
    }
    
    /**
     * Find restaurants by delivery area
     */
    public Page<Restaurant> getRestaurantsByDeliveryArea(String area, Pageable pageable) {
        return restaurantRepository.findByDeliveryDeliveryAreasContaining(area, pageable);
    }
    
    /**
     * Find restaurants by minimum rating
     */
    public Page<Restaurant> getRestaurantsByMinimumRating(double minRating, Pageable pageable) {
        return restaurantRepository.findByRatingsAverageRatingGreaterThanEqual(minRating, pageable);
    }
    
    /**
     * Get restaurant statistics
     */
    public Map<String, Object> getRestaurantStats() {
        Map<String, Object> stats = new HashMap<>();
        
        long totalRestaurants = restaurantRepository.count();
        long activeRestaurants = restaurantRepository.countByActiveTrue();
        
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        long newRestaurants = restaurantRepository.countByCreatedAtAfter(thirtyDaysAgo);
        
        stats.put("totalRestaurants", totalRestaurants);
        stats.put("activeRestaurants", activeRestaurants);
        stats.put("newRestaurants", newRestaurants);
        
        return stats;
    }
}