package com.example.orderup.module.restaurant.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.bson.types.ObjectId;
import com.example.orderup.module.restaurant.entity.Review;
import java.util.List;

@Repository
public class ReviewRepository {
    
    @Autowired
    private MongoTemplate mongoTemplate;
    
    public List<Review> findByRestaurantId(String restaurantId) {
        Query query = new Query(Criteria.where("restaurantId").is(new ObjectId(restaurantId)));
        return mongoTemplate.find(query, Review.class, "reviews");
    }
}