package com.example.orderup.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.orderup.models.entities.Res.Restaurant;

import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantRepository extends MongoRepository<Restaurant, String> {

    // Find all active restaurants
    Page<Restaurant> findByIsActiveTrue(Pageable pageable);
    
    // Find restaurant by host ID
    Optional<Restaurant> findByHostId(String hostId);
    
    // Find restaurants by city
    Page<Restaurant> findByAddressCityAndIsActiveTrue(String city, Pageable pageable);
    
    // Find restaurants by district
    Page<Restaurant> findByAddressDistrictAndIsActiveTrue(String district, Pageable pageable);
    
    // Find featured restaurants
    Page<Restaurant> findByIsFeaturedTrueAndIsActiveTrue(Pageable pageable);
    
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
}
