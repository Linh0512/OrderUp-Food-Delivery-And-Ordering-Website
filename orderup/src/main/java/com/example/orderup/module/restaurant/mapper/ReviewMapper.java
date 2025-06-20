package com.example.orderup.module.restaurant.mapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import com.example.orderup.module.restaurant.entity.Review;
import com.example.orderup.module.restaurant.entity.Restaurant;
import com.example.orderup.module.restaurant.dto.ReviewDTO;
import com.example.orderup.module.user.service.UserService;
import com.example.orderup.module.user.entirty.User;
import com.example.orderup.module.user.entirty.Order;
import java.time.format.DateTimeFormatter;
import java.util.stream.Collectors;

@Component
public class ReviewMapper {
    
    @Autowired
    private UserService userService;
    
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    
    public ReviewDTO toReviewDTO(Review review, Restaurant restaurant, Order order) {
        User customer = userService.getUserById(review.getUserId());
        
        return ReviewDTO.builder()
                .id(review.getId())
                .userComment(review.getComment())
                .rating(review.getRating())
                .images(review.getImages())
                .orderItems(order.getOrderDetails().getItems().stream()
                    .map(item -> ReviewDTO.OrderItem.builder()
                        .dishName(item.getDishName())
                        .dishImage(item.getDishImage())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .build())
                    .collect(Collectors.toList()))
                .restaurantId(restaurant.getId())
                .userId(review.getUserId())
                .userName(customer != null ? customer.getProfile().getName() : null)
                .userAvatar(customer != null ? customer.getProfile().getAvatar() : null)
                .createdAt(review.getCreatedAt().format(formatter))
                .updatedAt(review.getUpdatedAt().format(formatter))
                .build();
    }

    public ReviewDTO toDTO(Review review) {
        if (review == null) return null;

        return ReviewDTO.builder()
            .id(review.getId())
            .userId(review.getUserId())
            .restaurantId(review.getRestaurantId())
            .userComment(review.getComment())
            .rating(review.getRating())
            .images(review.getImages())
            .createdAt(review.getCreatedAt() != null ? review.getCreatedAt().format(formatter) : null)
            .updatedAt(review.getUpdatedAt() != null ? review.getUpdatedAt().format(formatter) : null)
            .build();
    }
}