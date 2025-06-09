package com.example.orderup.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.orderup.models.entities.Res.Dish;

import java.util.List;

@Repository
public interface DishRepository extends MongoRepository<Dish, String> {

    // Find dishes by restaurant ID
    Page<Dish> findByRestaurantIdAndIsActiveTrue(String restaurantId, Pageable pageable);
    
    // Find dishes by category ID
    Page<Dish> findByRestaurantIdAndCategoryIdAndIsActiveTrue(String restaurantId, String categoryId, Pageable pageable);
    
    // Find featured dishes
    Page<Dish> findByRestaurantIdAndIsFeaturedTrueAndIsActiveTrue(String restaurantId, Pageable pageable);
    
    // Search dishes by name
    @Query("{'restaurantId': ?0, 'basicInfo.name': {$regex: ?1, $options: 'i'}, 'isActive': true}")
    Page<Dish> findByRestaurantIdAndNameContainingIgnoreCase(String restaurantId, String name, Pageable pageable);
    
    // Find dishes by tag
    @Query("{'restaurantId': ?0, 'basicInfo.tags': {$in: [?1]}, 'isActive': true}")
    Page<Dish> findByRestaurantIdAndTag(String restaurantId, String tag, Pageable pageable);
    
    // Find dishes with discounts
    @Query("{'restaurantId': ?0, 'pricing.isDiscounted': true, 'isActive': true}")
    Page<Dish> findByRestaurantIdAndDiscounted(String restaurantId, Pageable pageable);
    
    // Find all dishes for a restaurant
    List<Dish> findAllByRestaurantId(String restaurantId);
    
    // Count dishes by restaurant ID
    long countByRestaurantId(String restaurantId);
    
    // Count dishes by restaurant ID and category ID
    long countByRestaurantIdAndCategoryId(String restaurantId, String categoryId);
}
