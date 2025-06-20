package com.example.orderup.module.restaurant.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.orderup.module.user.entirty.Order;
import com.example.orderup.module.restaurant.dto.OrderSummaryDTO;
import com.example.orderup.module.restaurant.mapper.OrderMapper;
import org.bson.types.ObjectId;
import java.util.List;
import java.util.stream.Collectors;

@Repository
public class OrderRepository {
    
    @Autowired
    private MongoTemplate mongoTemplate;
    
    @Autowired
    private OrderMapper orderMapper;
    
    public List<OrderSummaryDTO> findByRestaurantId(String restaurantId) {
        Query query = new Query(Criteria.where("restaurantId").is(new ObjectId(restaurantId)));
        List<Order> orders = mongoTemplate.find(query, Order.class, "orders");
        return orders.stream()
                .map(orderMapper::toOrderSummaryDTO)
                .collect(Collectors.toList());
    }
    
    public OrderSummaryDTO findById(String id) {
        Query query = new Query(Criteria.where("_id").is(new ObjectId(id)));
        Order order = mongoTemplate.findOne(query, Order.class, "orders");
        return orderMapper.toOrderSummaryDTO(order);
    }
    
    public OrderSummaryDTO save(OrderSummaryDTO order) {
        return mongoTemplate.save(order, "orders");
    }
    
    public void deleteById(String id) {
        Query query = new Query(Criteria.where("_id").is(id));
        mongoTemplate.remove(query, OrderSummaryDTO.class, "orders");
    }
} 