package com.example.orderup.module.user.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.bson.types.ObjectId;
import com.example.orderup.module.user.entirty.Order;

public interface UserOrderHistoryRepository extends MongoRepository<Order, String> {
    Page<Order> findByCustomerId(ObjectId customerId, Pageable pageable);
    
    @Query("{ '$or': [ { 'customerId': ?0 }, { 'userId': ?0 } ], '_id': ?1 }")
    Order findByCustomerIdAndId(ObjectId customerId, String orderId);
}
