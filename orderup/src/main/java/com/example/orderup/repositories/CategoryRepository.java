package com.example.orderup.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.orderup.module.restaurant.entity.Category;

import java.util.List;

@Repository
public interface CategoryRepository extends MongoRepository<Category, String> {
    
    // Find categories by restaurant ID
    List<Category> findByRestaurantIdOrderByDisplayOrder(String restaurantId);
    
    // Find active categories by restaurant ID
    List<Category> findByRestaurantIdAndIsActiveTrueOrderByDisplayOrder(String restaurantId);
    
    // Find categories by restaurant ID with pagination
    Page<Category> findByRestaurantId(String restaurantId, Pageable pageable);
    
    // Count categories by restaurant ID
    long countByRestaurantId(String restaurantId);
}
