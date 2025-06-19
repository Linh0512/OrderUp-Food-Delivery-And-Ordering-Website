package com.example.orderup.module.restaurant.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

import com.example.orderup.module.restaurant.entity.Review;

@Repository
public interface ReviewRepository extends MongoRepository<Review, String> {
    @Query("{ 'restaurantId': ?0 }")
    List<Review> findByRestaurantId(String restaurantId);

    @Query("{ 'userId': ?0, 'restaurantId': ?1 }")
    Optional<Review> findByUserIdAndRestaurantId(String userId, String restaurantId);
}