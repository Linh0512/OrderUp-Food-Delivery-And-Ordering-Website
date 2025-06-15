package com.example.orderup.module.restaurant.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ReviewDTO {
    private String id;
    private String comment;
    private int rating;
    private List<String> dishImages;
    private int likes;
    private String restaurantId;
    private String restaurantName;
    private String userId;
    private String userName;
    private String userAvatar;
    private String restaurantReply;
    private LocalDateTime replyDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}