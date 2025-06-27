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
import com.example.orderup.config.security.JwtTokenProvider;

import java.util.Comparator;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.time.LocalDate;
import java.text.SimpleDateFormat;


@Service
public class UserOrderHistoryService {
    private static final Logger logger = LoggerFactory.getLogger(UserOrderHistoryService.class);
    
    @Autowired
    private UserOrderHistoryRepository orderRepository;

    @Autowired
    private UserService userService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserOrderHistoryMapper orderMapper;
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    public Page<UserOrderHistoryThumbDTO> getUserOrderHistory(String token, Pageable pageable) {
        logger.debug("Finding orders for userId: {} with pageable: {}", token, pageable);
        String userId = jwtTokenProvider.getUserIdFromToken(token);

        ObjectId userIdObject = new ObjectId(userId);
        Page<Order> orders = orderRepository.findByCustomerId(userIdObject, pageable);
        logger.debug("Found {} orders for userId: {}", orders.getTotalElements(), userId);
        return orders.map(order -> orderMapper.toUserOrderHistoryThumbDTO(order, userService.getUserById(userId)));
    }

    public Page<UserOrderHistoryThumbDTO> getRestaurantOrderHistory(String restaurantId, Pageable pageable) {
        logger.debug("Finding orders for restaurantId: {} with pageable: {}", restaurantId, pageable);
        ObjectId restaurantObjectId = new ObjectId(restaurantId);
        Page<Order> orders = orderRepository.findByRestaurantId(restaurantObjectId, pageable);
        logger.debug("Found {} orders for restaurantId: {}", orders.getTotalElements(), restaurantId);
        return orders.map(order -> orderMapper.toUserOrderHistoryThumbDTO(order, userService.getUserById(order.getCustomerId().toString())));
    }

    public Page<UserOrderHistoryThumbDTO> filterUserOrderByDate(
            String token, 
            LocalDateTime orderDate, 
            Pageable pageable) {
        logger.debug("Filtering orders for userId: {} and date: {}", token, orderDate);
        String userId = jwtTokenProvider.getUserIdFromToken(token);
        
        ObjectId userIdObject = new ObjectId(userId);

        Page<Order> orders;
        if (orderDate != null) {
            // Convert LocalDateTime to Date for MongoDB query
            Date startOfDay = Date.from(orderDate.toLocalDate().atStartOfDay()
                .atZone(java.time.ZoneId.systemDefault()).toInstant());
            Date endOfDay = Date.from(orderDate.toLocalDate().atStartOfDay().plusDays(1)
                .atZone(java.time.ZoneId.systemDefault()).toInstant());
            
            orders = orderRepository.findByCustomerIdAndDateRange(
                userIdObject, 
                startOfDay,
                endOfDay,
                pageable
            );
        } else {
            // Nếu không có orderDate, lấy tất cả
            orders = orderRepository.findByCustomerId(userIdObject, pageable);
        }
        
        logger.debug("Found {} orders for userId: {}", orders.getTotalElements(), userId);
        return orders.map(order -> orderMapper.toUserOrderHistoryThumbDTO(order, userService.getUserById(userId)));
    }

    public Page<UserOrderHistoryThumbDTO> filterRestaurantOrderByDate(
        String restaurantId, 
        LocalDateTime orderDate, 
        Pageable pageable) {
        logger.debug("Filtering orders for restaurantId: {} and date: {}", restaurantId, orderDate);
        ObjectId restaurantObjectId = new ObjectId(restaurantId);
        
        Page<Order> orders;
        if (orderDate != null) {
            // Convert LocalDateTime to Date for MongoDB query
            Date startOfDay = Date.from(orderDate.toLocalDate().atStartOfDay()
                .atZone(java.time.ZoneId.systemDefault()).toInstant());
            Date endOfDay = Date.from(orderDate.toLocalDate().atStartOfDay().plusDays(1)
                .atZone(java.time.ZoneId.systemDefault()).toInstant());
            
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
        return orders.map(order -> orderMapper.toUserOrderHistoryThumbDTO(order, userService.getUserById(order.getCustomerId().toString())));
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
        UserOrderHistoryDetailDTO dto = orderMapper.toUserOrderHistoryDetailDTO(order, userService.getUserById(order.getCustomerId().toString()));
        
        if (user != null && user.getProfile() != null) {
            SimpleDateFormat dateFormatter = new SimpleDateFormat("dd/MM/yyyy");
            Date dateOfBirth = user.getProfile().getDateOfBirth() != null ? 
                user.getProfile().getDateOfBirth() : null;
            UserOrderHistoryDetailDTO.UserProfile userProfile = UserOrderHistoryDetailDTO.UserProfile.builder()
                .fullName(user.getProfile().getName())
                .avatar(user.getProfile().getAvatar())
                .dateOfBirth(dateOfBirth != null ? dateFormatter.format(dateOfBirth) : null)
                .gender(user.getProfile().getGender())
                .address(order.getDeliveryInfo().getAddress().getFullAddress())
                .build();
            dto.setUserProfile(userProfile);
        }
        
        logger.debug("Found order detail for orderId: {}", orderId);
        return dto;
    }
}
