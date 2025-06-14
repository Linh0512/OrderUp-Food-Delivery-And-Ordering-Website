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
    
    public UserOrderHistoryDetailDTO getUserOrderDetail(String userId, String orderId) {
        logger.debug("Finding order detail for userId: {} and orderId: {}", userId, orderId);
        ObjectId userObjectId = new ObjectId(userId);
        Order order = orderRepository.findByCustomerIdAndId(userObjectId, orderId);
        if (order == null) {
            logger.debug("No order found for userId: {} and orderId: {}", userId, orderId);
            return null;
        }
        logger.debug("Found order detail for orderId: {}", orderId);
        return orderMapper.toUserOrderHistoryDetailDTO(order);
    }
}
