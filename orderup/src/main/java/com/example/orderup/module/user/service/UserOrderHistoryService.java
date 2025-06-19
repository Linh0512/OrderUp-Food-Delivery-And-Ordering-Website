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
import com.example.orderup.module.user.entirty.User;
import com.example.orderup.module.user.mapper.UserOrderHistoryMapper;
import com.example.orderup.module.user.repository.UserOrderHistoryRepository;
import com.example.orderup.module.user.repository.UserRepository;

import java.util.Comparator;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;


@Service
public class UserOrderHistoryService {
    private static final Logger logger = LoggerFactory.getLogger(UserOrderHistoryService.class);
    
    @Autowired
    private UserOrderHistoryRepository orderRepository;
    
    @Autowired
    private UserRepository userRepository;
    
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
        
        // Lấy thông tin user profile
        User user = userRepository.findById(order.getCustomerId().toString()).orElse(null);
        UserOrderHistoryDetailDTO dto = orderMapper.toUserOrderHistoryDetailDTO(order);
        
        if (user != null && user.getProfile() != null) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            UserOrderHistoryDetailDTO.UserProfile userProfile = UserOrderHistoryDetailDTO.UserProfile.builder()
                .firstName(user.getProfile().getFirstName())
                .lastName(user.getProfile().getLastName())
                .fullName(user.getProfile().getName())
                .phone(user.getProfile().getPhone())
                .avatar(user.getProfile().getAvatar())
                .dateOfBirth(user.getProfile().getDateOfBirth() != null ? 
                    user.getProfile().getDateOfBirth().toString() : null)
                .gender(user.getProfile().getGender())
                .build();
            dto.setUserProfile(userProfile);
        }
        
        logger.debug("Found order detail for orderId: {}", orderId);
        return dto;
    }
}
