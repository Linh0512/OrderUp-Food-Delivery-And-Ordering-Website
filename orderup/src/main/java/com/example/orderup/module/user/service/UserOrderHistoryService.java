package com.example.orderup.module.user.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.bson.types.ObjectId;

import com.example.orderup.module.user.dto.UserOrderHistoryDetailDTO;
import com.example.orderup.module.user.dto.UserOrderHistoryThumbDTO;
import com.example.orderup.module.user.entirty.Order;
import com.example.orderup.module.user.mapper.UserOrderHistoryMapper;
import com.example.orderup.module.user.repository.UserOrderHistoryRepository;

import java.util.Comparator;
import java.time.LocalDateTime;


@Service
public class UserOrderHistoryService {
    private static final Logger logger = LoggerFactory.getLogger(UserOrderHistoryService.class);
    
    @Autowired
    private UserOrderHistoryRepository orderRepository;
    
    @Autowired
    private UserOrderHistoryMapper orderMapper;
    
    public Page<UserOrderHistoryThumbDTO> getUserOrderHistory(String userId, Pageable pageable) {
        logger.debug("Finding orders for userId: {} with pageable: {}", userId, pageable);
        ObjectId userObjectId = new ObjectId(userId);
        Page<Order> orders = orderRepository.findByCustomerId(userObjectId, pageable);
        logger.debug("Found {} orders for userId: {}", orders.getTotalElements(), userId);
        return orders.map(orderMapper::toUserOrderHistoryThumbDTO);
    }

    public Page<UserOrderHistoryThumbDTO> getRestaurantOrderHistory(String restaurantId, Pageable pageable) {
        logger.debug("Finding orders for restaurantId: {} with pageable: {}", restaurantId, pageable);
        ObjectId restaurantObjectId = new ObjectId(restaurantId);
        Page<Order> orders = orderRepository.findByRestaurantId(restaurantObjectId, pageable);
        logger.debug("Found {} orders for restaurantId: {}", orders.getTotalElements(), restaurantId);
        return orders.map(orderMapper::toUserOrderHistoryThumbDTO);
    }

    public Page<UserOrderHistoryThumbDTO> filterUserOrderByDate(
            String userId, 
            LocalDateTime orderDate, 
            Pageable pageable) {
        logger.debug("Filtering orders for userId: {} and date: {}", userId, orderDate);
        ObjectId userObjectId = new ObjectId(userId);
        
        Page<Order> orders;
        if (orderDate != null) {
            // Nếu có orderDate, lấy đơn hàng trong ngày đó
            LocalDateTime startOfDay = orderDate.toLocalDate().atStartOfDay();
            LocalDateTime endOfDay = startOfDay.plusDays(1);
            orders = orderRepository.findByCustomerIdAndDateRange(
                userObjectId, 
                startOfDay,
                endOfDay,
                pageable
            );
        } else {
            // Nếu không có orderDate, lấy tất cả
            orders = orderRepository.findByCustomerId(userObjectId, pageable);
        }
        
        logger.debug("Found {} orders for userId: {}", orders.getTotalElements(), userId);
        return orders.map(orderMapper::toUserOrderHistoryThumbDTO);
    }

    public Page<UserOrderHistoryThumbDTO> filterRestaurantOrderByDate(
        String restaurantId, 
        LocalDateTime orderDate, 
        Pageable pageable) {
        logger.debug("Filtering orders for restaurantId: {} and date: {}", restaurantId, orderDate);
        ObjectId restaurantObjectId = new ObjectId(restaurantId);
        
        Page<Order> orders;
        if (orderDate != null) {
            // Nếu có orderDate, lấy đơn hàng trong ngày đó
            LocalDateTime startOfDay = orderDate.toLocalDate().atStartOfDay();
            LocalDateTime endOfDay = startOfDay.plusDays(1);
            orders = orderRepository.findByRestaurantIdAndDateRange(
                restaurantObjectId, 
                startOfDay,
                endOfDay,
                pageable
            );
        } else {
            // Nếu không có orderDate, lấy tất cả
            orders = orderRepository.findByRestaurantId(restaurantObjectId, pageable);
        }
        
        logger.debug("Found {} orders for restaurantId: {}", orders.getTotalElements(), restaurantId);
        return orders.map(orderMapper::toUserOrderHistoryThumbDTO);
    }

    public UserOrderHistoryDetailDTO getOrderDetail(String orderId) {
        logger.debug("Finding order detail for orderId: {}", orderId);
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            logger.debug("No order found for orderId: {}", orderId);
            return null;
        }
        logger.debug("Found order detail for orderId: {}", orderId);
        return orderMapper.toUserOrderHistoryDetailDTO(order);
    }
}
