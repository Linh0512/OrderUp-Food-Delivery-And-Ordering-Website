package com.example.orderup.module.user.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.bson.types.ObjectId;
import com.example.orderup.module.user.entirty.ShoppingCart;

public interface ShoppingCartRepository extends MongoRepository<ShoppingCart, String> {
    ShoppingCart findByUserId(ObjectId userId);
    void deleteByUserId(ObjectId userId);
} 