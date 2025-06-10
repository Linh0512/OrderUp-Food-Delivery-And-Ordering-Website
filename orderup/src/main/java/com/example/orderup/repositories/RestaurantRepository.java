package com.example.orderup.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.orderup.module.restaurant.entity.Restaurant;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantRepository extends MongoRepository<Restaurant, String> {

    // Find all active restaurants
    Page<Restaurant> findByActiveTrue(Pageable pageable);
    
    // Find restaurant by host ID
    Optional<Restaurant> findByHostId(String hostId);
    
    // Find restaurants by city
    Page<Restaurant> findByAddressCityAndActiveTrue(String city, Pageable pageable);
    
    // Find restaurants by district
    Page<Restaurant> findByAddressDistrictAndActiveTrue(String district, Pageable pageable);
    
    // Find featured restaurants
    @Query("{'isFeatured': true, 'isActive': true}")
    Page<Restaurant> findByFeaturedTrueAndActiveTrue(Pageable pageable);
    
    // Search restaurants by name
    @Query("{'basicInfo.name': {$regex: ?0, $options: 'i'}, 'isActive': true}")
    Page<Restaurant> findByNameContainingIgnoreCase(String name, Pageable pageable);
    
    // Find restaurants by cuisine type
    @Query("{'businessInfo.cuisineTypes': {$in: [?0]}, 'isActive': true}")
    Page<Restaurant> findByCuisineType(String cuisineType, Pageable pageable);
    
    // Find restaurants by tags
    @Query("{'tags': {$in: [?0]}, 'isActive': true}")
    Page<Restaurant> findByTag(String tag, Pageable pageable);
    
    // Find restaurants with delivery service
    @Query("{'delivery.isDeliveryAvailable': true, 'isActive': true}")
    Page<Restaurant> findWithDeliveryService(Pageable pageable);
    
    // Find restaurants by verification status
    Page<Restaurant> findByVerificationStatus(String status, Pageable pageable);
    
    // Count restaurants by cuisine type
    @Query(value = "{'businessInfo.cuisineTypes': {$in: [?0]}, 'isActive': true}", count = true)
    long countByCuisineType(String cuisineType);
    
    // Custom query to find restaurants within a delivery area
    @Query("{'delivery.deliveryAreas': {$in: [?0]}, 'isActive': true}")
    Page<Restaurant> findByDeliveryArea(String area, Pageable pageable);
    
    // Find restaurants by minimum rating
    @Query("{'ratings.averageRating': {$gte: ?0}, 'isActive': true}")
    Page<Restaurant> findByMinimumRating(double minRating, Pageable pageable);
        
    // Find restaurants by cuisine type with containing pattern
    @Query("{'businessInfo.cuisineTypes': {$regex: ?0, $options: 'i'}, 'isActive': true}")
    Page<Restaurant> findByBusinessInfoCuisineTypesContaining(String cuisineType, Pageable pageable);
    
    // Search restaurants by name (List result)
    @Query("{'basicInfo.name': {$regex: ?0, $options: 'i'}}")
    List<Restaurant> findByBasicInfoNameContainingIgnoreCase(String name);
    
    // Search restaurants by name with pagination
    @Query("{'basicInfo.name': {$regex: ?0, $options: 'i'}}")
    Page<Restaurant> findByBasicInfoNameContainingIgnoreCase(String name, Pageable pageable);
    
    // Find restaurants by delivery areas
    @Query("{'delivery.deliveryAreas': {$regex: ?0, $options: 'i'}, 'isActive': true}")
    Page<Restaurant> findByDeliveryDeliveryAreasContaining(String area, Pageable pageable);
    
    // Find restaurants by minimum rating with field path
    @Query("{'ratings.averageRating': {$gte: ?0}, 'isActive': true}")
    Page<Restaurant> findByRatingsAverageRatingGreaterThanEqual(double minRating, Pageable pageable);
    
    // Count all active restaurants
    @Query(value = "{'active': true}", count = true)
    long countByActiveTrue();
    
    // Count restaurants created after a specific date
    @Query(value = "{'createdAt': {$gt: ?0}}", count = true)
    long countByCreatedAtAfter(LocalDateTime date);
}
