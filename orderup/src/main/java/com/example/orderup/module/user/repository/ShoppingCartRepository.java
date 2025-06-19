package com.example.orderup.module.user.repository;

import java.util.List;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.orderup.module.user.entirty.ShoppingCart;

@Repository
public interface ShoppingCartRepository extends MongoRepository<ShoppingCart, String> {
    List<ShoppingCart> findByUserId(ObjectId userId);
    ShoppingCart findByUserIdAndRestaurantId(ObjectId userId, ObjectId restaurantId);
    void deleteByUserId(ObjectId userId);
} 