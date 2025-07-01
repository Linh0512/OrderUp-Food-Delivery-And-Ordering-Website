package com.example.orderup.module.restaurant.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.bson.types.ObjectId;
import com.example.orderup.module.restaurant.entity.Dish;
import java.util.List;

@Repository
public class DishRepository {
    
    @Autowired
    private MongoTemplate mongoTemplate;
    
    public List<Dish> findByRestaurantId(ObjectId restaurantId) {
        Query query = new Query(Criteria.where("restaurantId").is(restaurantId));
        return mongoTemplate.find(query, Dish.class, "dishes");
    }
    
    public Dish findById(String id) {
        try {
            Query query = new Query(Criteria.where("_id").is(new ObjectId(id)));
            return mongoTemplate.findOne(query, Dish.class, "dishes");
        } catch (IllegalArgumentException e) {
            // Log lỗi nếu id không phải là ObjectId hợp lệ
            e.printStackTrace();
            return null;
        }
    }

    public Dish addDish(Dish dish) {
        dish.setId(new ObjectId().toString());
        return mongoTemplate.insert(dish, "dishes");
    }

    public Dish updateDish(Dish dish) {
        return mongoTemplate.save(dish, "dishes");
    }

    public void deleteDish(String id) {
        Query query = new Query(Criteria.where("_id").is(new ObjectId(id)));
        mongoTemplate.remove(query, Dish.class, "dishes");
    }
}