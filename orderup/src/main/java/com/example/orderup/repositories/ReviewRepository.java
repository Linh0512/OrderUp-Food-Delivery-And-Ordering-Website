package com.example.orderup.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.orderup.models.entities.Res.Review;

import java.util.List;

@Repository
public interface ReviewRepository extends MongoRepository<Review, String> {
    
    // Find reviews by restaurant ID
    Page<Review> findByRestaurantIdAndIsVisibleTrue(String restaurantId, Pageable pageable);
    
    // Find reviews by dish ID
    Page<Review> findByDishIdAndIsVisibleTrue(String dishId, Pageable pageable);
    
    // Find reviews by user ID
    Page<Review> findByUserId(String userId, Pageable pageable);
    
    // Find reviews by restaurant ID and rating
    Page<Review> findByRestaurantIdAndRatingAndIsVisibleTrue(String restaurantId, int rating, Pageable pageable);
    
    // Find recommended reviews
    Page<Review> findByRestaurantIdAndIsRecommendedTrueAndIsVisibleTrue(String restaurantId, Pageable pageable);
    
    // Count reviews by restaurant ID
    long countByRestaurantId(String restaurantId);
    
    // Count reviews by dish ID
    long countByDishId(String dishId);
    
    // Count reviews by restaurant ID and rating
    long countByRestaurantIdAndRating(String restaurantId, int rating);
    
    // Average rating by restaurant ID
    @Query(value = "{ 'restaurantId' : ?0, 'isVisible': true }", count = false)
    List<Review> findAllVisibleByRestaurantId(String restaurantId);
    
    // Average rating by dish ID
    @Query(value = "{ 'dishId' : ?0, 'isVisible': true }", count = false)
    List<Review> findAllVisibleByDishId(String dishId);
}
