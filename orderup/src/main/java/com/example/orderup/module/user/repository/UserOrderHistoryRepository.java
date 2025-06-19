package com.example.orderup.module.user.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.bson.types.ObjectId;
import com.example.orderup.module.user.entirty.Order;
import java.time.LocalDateTime;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserOrderHistoryRepository extends MongoRepository<Order, String> {
    // Query cơ bản không có filter date
    Page<Order> findByCustomerId(ObjectId customerId, Pageable pageable);
    Page<Order> findByRestaurantId(ObjectId restaurantId, Pageable pageable);

    // Query có filter date
    @Query("{ 'customerId': ?0, 'createdAt': { $gte: ?1, $lt: ?2 } }")
    Page<Order> findByCustomerIdAndDateRange(
        ObjectId customerId, 
        LocalDateTime startDate, 
        LocalDateTime endDate, 
        Pageable pageable
    );

    @Query("{ 'restaurantId': ?0, 'createdAt': { $gte: ?1, $lt: ?2 } }")
    Page<Order> findByRestaurantIdAndDateRange(
        ObjectId restaurantId, 
        LocalDateTime startDate, 
        LocalDateTime endDate, 
        Pageable pageable
    );

    @Query("{ 'userId': ?0, 'restaurantId': ?1 }")
    List<Order> findByUserIdAndRestaurantId(String userId, String restaurantId);

    @Query("{ 'restaurantId': ?0 }")
    List<Order> findByRestaurantId(ObjectId restaurantId);
}
