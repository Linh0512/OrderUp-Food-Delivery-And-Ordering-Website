package com.example.orderup.module.restaurant.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.bson.types.ObjectId;

import com.example.orderup.module.restaurant.entity.Restaurant;
import com.example.orderup.module.restaurant.entity.Dish;

import java.util.List;

@Repository
public class RestaurantDetailRepository {
    
    @Autowired
    private MongoTemplate mongoTemplate;
    
    public Restaurant findRestaurantById(String restaurantId) {
        Query query = new Query(Criteria.where("_id").is(restaurantId));
        return mongoTemplate.findOne(query, Restaurant.class, "restaurants");
    }

    public List<Dish> findDishesByRestaurantId(ObjectId restaurantId) {
        Query query = new Query(Criteria.where("restaurantId").is(restaurantId));
        return mongoTemplate.find(query, Dish.class, "dishes");
    }

    public Restaurant save(Restaurant restaurant) {
        return mongoTemplate.save(restaurant, "restaurants");
    }

    public boolean existsById(String restaurantId) {
        Query query = new Query(Criteria.where("_id").is(restaurantId));
        return mongoTemplate.exists(query, Restaurant.class, "restaurants");
    }
}
