package com.example.orderup.module.restaurant.mapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import com.example.orderup.module.restaurant.entity.Review;
import com.example.orderup.module.restaurant.entity.Restaurant;
import com.example.orderup.module.restaurant.dto.ReviewDTO;
import com.example.orderup.module.user.service.UserService;
import com.example.orderup.module.user.entirty.User;

@Component
public class ReviewMapper {
    
    @Autowired
    private UserService userService;
    
    public ReviewDTO toReviewDTO(Review review, Restaurant restaurant) {
        User customer = userService.getUserById(review.getCustomerId());
        
        return ReviewDTO.builder()
                .id(review.getId())
                .comment(review.getUserComment())
                .rating(review.getRating())
                .dishImages(review.getImages())
                .likes(review.getLikes())
                .restaurantId(restaurant.getId())
                .restaurantName(restaurant.getBasicInfo().getName())
                .userId(review.getCustomerId())
                .userName(customer != null ? customer.getProfile().getName() : null)
                .userAvatar(customer != null ? customer.getProfile().getAvatar() : null)
                .restaurantReply(review.getRestaurantReply())
                .replyDate(review.getReplyDate())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }
}